import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const USERNAME_RULES = {
  min: 3,
  max: 30,
  pattern: /^[a-z0-9_]+$/,
};

export type AuthResult =
  | { ok: true; access_token: string; refresh_token: string }
  | {
      ok: false;
      code:
        | "invalid_credentials"
        | "username_taken"
        | "email_taken"
        | "validation"
        | "server_configuration"
        | "session_creation"
        | "server";
      message: string;
    };

const usernameSchema = z
  .string()
  .trim()
  .min(USERNAME_RULES.min, "Логин должен содержать минимум 3 символа")
  .max(USERNAME_RULES.max, "Логин слишком длинный")
  .regex(USERNAME_RULES.pattern, "Допустимы латинские буквы, цифры и _")
  .transform((value) => value.toLowerCase());

const credentialsSchema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(200),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(80, "Слишком длинное имя"),
  username: usernameSchema,
  email: z
    .string()
    .trim()
    .email("Введите корректный Email")
    .max(254)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов").max(200),
});

const invalidCredentials = {
  ok: false as const,
  code: "invalid_credentials" as const,
  message: "Неверный Email, логин или пароль",
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type ErrorLike = { code?: unknown; message?: unknown; status?: unknown; name?: unknown };

function errorLike(error: unknown): ErrorLike {
  return error != null && typeof error === "object" ? (error as ErrorLike) : {};
}

function logAuthError(operation: string, error: unknown) {
  const detail = errorLike(error);
  console.error("[Auth] Operation failed", {
    operation,
    name: typeof detail.name === "string" ? detail.name : undefined,
    code: typeof detail.code === "string" ? detail.code : undefined,
    status: typeof detail.status === "number" ? detail.status : undefined,
    message:
      typeof detail.message === "string"
        ? detail.message
        : error instanceof Error
          ? error.message
          : String(error),
  });
}

function isServerConfigurationError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof errorLike(error).message === "string"
        ? String(errorLike(error).message)
        : "";
  return (
    message.includes("Missing Supabase") ||
    message.includes("Invalid Supabase URL") ||
    message.includes("Unexpected Supabase project") ||
    message.includes("Invalid Supabase service-role") ||
    message.includes("Secret Supabase key") ||
    message.includes("Service-role Supabase key")
  );
}

function unexpectedServerFailure(operation: string, error: unknown): AuthResult {
  logAuthError(operation, error);
  if (isServerConfigurationError(error)) {
    return {
      ok: false,
      code: "server_configuration",
      message: "Сервис авторизации временно не настроен. Сообщите команде HunMaster.",
    };
  }
  return {
    ok: false,
    code: "server",
    message: "Сервис авторизации временно недоступен. Попробуйте ещё раз.",
  };
}

type LoginEmailResolution =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid_identifier" }
  | { ok: false; reason: "lookup_failed"; error: unknown };

async function resolveLoginEmail(identifier: string): Promise<LoginEmailResolution> {
  const normalized = identifier.trim().toLowerCase();
  if (isEmail(normalized)) return { ok: true, email: normalized };

  const parsedUsername = usernameSchema.safeParse(normalized);
  if (!parsedUsername.success) return { ok: false, reason: "invalid_identifier" };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .ilike("username", parsedUsername.data)
    .maybeSingle();

  if (error) return { ok: false, reason: "lookup_failed", error };
  if (!data?.email) return { ok: false, reason: "invalid_identifier" };
  return { ok: true, email: data.email };
}

function isAlreadyRegistered(error: unknown) {
  const detail = errorLike(error);
  const normalized = typeof detail.message === "string" ? detail.message.toLowerCase() : "";
  const code = typeof detail.code === "string" ? detail.code.toLowerCase() : "";
  return (
    code.includes("email_exists") ||
    code.includes("user_already_exists") ||
    normalized.includes("already") ||
    normalized.includes("registered") ||
    normalized.includes("exists")
  );
}

function isWeakPassword(error: unknown) {
  const detail = errorLike(error);
  const code = typeof detail.code === "string" ? detail.code.toLowerCase() : "";
  const message = typeof detail.message === "string" ? detail.message.toLowerCase() : "";
  return (
    code.includes("weak_password") || (message.includes("password") && message.includes("weak"))
  );
}

async function cleanupNewUser(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) logAuthError("registration_cleanup", error);
  return !error;
}

/** Public: creates a Supabase Auth email/password user and a shared Admin-compatible student profile. */
export const registerAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<AuthResult> => {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        code: "validation",
        message: parsed.error.issues[0]?.message ?? "Проверьте введённые данные",
      };
    }

    try {
      const { email, name, password, username } = parsed.data;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { createServerAuthClient } = await import("./internal-auth.server");

      const { data: existingUsername, error: usernameLookupError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle();
      if (usernameLookupError) {
        logAuthError("register_username_lookup", usernameLookupError);
        return { ok: false, code: "server", message: "Не удалось проверить логин" };
      }
      if (existingUsername)
        return { ok: false, code: "username_taken", message: "Этот логин уже занят" };

      const { data: existingEmail, error: emailLookupError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (emailLookupError) {
        logAuthError("register_email_lookup", emailLookupError);
        return { ok: false, code: "server", message: "Не удалось проверить Email" };
      }
      if (existingEmail) {
        return {
          ok: false,
          code: "email_taken",
          message: "Пользователь с таким Email уже существует",
        };
      }

      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, full_name: name },
      });

      if (createError || !created.user) {
        if (createError) logAuthError("register_create_user", createError);
        if (isAlreadyRegistered(createError)) {
          return {
            ok: false,
            code: "email_taken",
            message: "Пользователь с таким Email уже существует",
          };
        }
        if (isWeakPassword(createError)) {
          return {
            ok: false,
            code: "validation",
            message: "Пароль не соответствует требованиям безопасности",
          };
        }

        // The database trigger enforces username uniqueness during Auth creation too.
        const { data: conflictingUsername } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .ilike("username", username)
          .maybeSingle();
        if (conflictingUsername) {
          return { ok: false, code: "username_taken", message: "Этот логин уже занят" };
        }
        return {
          ok: false,
          code: "server",
          message: "Не удалось создать аккаунт. Попробуйте ещё раз.",
        };
      }

      const now = new Date().toISOString();
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: created.user.id,
            email,
            username,
            full_name: name,
            role: "student",
            account_status: "pending",
            is_active: true,
            last_seen_at: now,
          },
          { onConflict: "id" },
        )
        .select("id, role, account_status, is_active")
        .single();

      if (
        profileError ||
        !profile ||
        profile.id !== created.user.id ||
        profile.role !== "student" ||
        profile.account_status !== "pending" ||
        profile.is_active !== true
      ) {
        logAuthError("register_profile", profileError ?? new Error("Unexpected profile defaults"));
        const cleaned = await cleanupNewUser(created.user.id);
        const duplicate = profileError?.code === "23505";
        if (duplicate)
          return { ok: false, code: "username_taken", message: "Этот логин уже занят" };
        return {
          ok: false,
          code: "server",
          message: cleaned
            ? "Не удалось создать профиль. Попробуйте ещё раз."
            : "Регистрация не завершена. Обратитесь в поддержку HunMaster.",
        };
      }

      const auth = createServerAuthClient();
      const { data: session, error: signInError } = await auth.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !session.session) {
        logAuthError("register_session", signInError ?? new Error("Session was not returned"));
        const cleaned = await cleanupNewUser(created.user.id);
        return {
          ok: false,
          code: "session_creation",
          message: cleaned
            ? "Не удалось завершить регистрацию. Попробуйте ещё раз."
            : "Аккаунт создан, но сессия не открылась. Попробуйте войти.",
        };
      }

      return {
        ok: true,
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
      };
    } catch (error) {
      return unexpectedServerFailure("register_unexpected", error);
    }
  });

/** Public: signs in with Email or username. Username lookup stays server-side and never exposes private email. */
export const loginWithIdentifier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<AuthResult> => {
    const parsed = credentialsSchema.safeParse(data);
    if (!parsed.success) return invalidCredentials;

    try {
      const resolution = await resolveLoginEmail(parsed.data.identifier);
      if (!resolution.ok) {
        if (resolution.reason === "lookup_failed") {
          logAuthError("login_username_lookup", resolution.error);
          return {
            ok: false,
            code: "server",
            message: "Не удалось проверить логин. Попробуйте ещё раз.",
          };
        }
        return invalidCredentials;
      }

      const { createServerAuthClient } = await import("./internal-auth.server");
      const auth = createServerAuthClient();
      const { data: session, error } = await auth.auth.signInWithPassword({
        email: resolution.email,
        password: parsed.data.password,
      });
      if (error || !session.session) return invalidCredentials;

      // The password-grant client is authenticated as this user, so RLS can safely
      // update its own activity without making email login depend on service-role.
      const { error: lastSeenError } = await auth
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", session.user.id);
      if (lastSeenError) logAuthError("login_last_seen", lastSeenError);

      return {
        ok: true,
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
      };
    } catch (error) {
      return unexpectedServerFailure("login_unexpected", error);
    }
  });

export const loginWithUsername = loginWithIdentifier;

/** Authenticated: records activity for the admin panel ("последний вход"). */
export const touchLastSeen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", context.userId);
    if (error) {
      logAuthError("touch_last_seen", error);
      return { ok: false as const };
    }
    return { ok: true };
  });
