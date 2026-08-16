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
      code: "invalid_credentials" | "username_taken" | "email_taken" | "validation" | "server";
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

async function resolveLoginEmail(identifier: string): Promise<string | null> {
  const normalized = identifier.trim().toLowerCase();
  if (isEmail(normalized)) return normalized;

  const parsedUsername = usernameSchema.safeParse(normalized);
  if (!parsedUsername.success) return null;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .ilike("username", parsedUsername.data)
    .maybeSingle();

  if (error || !data?.email) return null;
  return data.email;
}

function isAlreadyRegistered(message?: string) {
  const normalized = message?.toLowerCase() ?? "";
  return (
    normalized.includes("already") ||
    normalized.includes("registered") ||
    normalized.includes("exists")
  );
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

    const { email, name, password, username } = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createServerAuthClient } = await import("./internal-auth.server");

    const { data: existingUsername, error: usernameLookupError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .maybeSingle();
    if (usernameLookupError)
      return { ok: false, code: "server", message: "Не удалось проверить логин" };
    if (existingUsername)
      return { ok: false, code: "username_taken", message: "Этот логин уже занят" };

    const { data: existingEmail, error: emailLookupError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (emailLookupError)
      return { ok: false, code: "server", message: "Не удалось проверить Email" };
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
      if (isAlreadyRegistered(createError?.message)) {
        return {
          ok: false,
          code: "email_taken",
          message: "Пользователь с таким Email уже существует",
        };
      }
      return { ok: false, code: "server", message: "Не удалось создать аккаунт" };
    }

    const now = new Date().toISOString();
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
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
    );

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      const taken = profileError.code === "23505";
      return taken
        ? { ok: false, code: "username_taken", message: "Этот логин уже занят" }
        : { ok: false, code: "server", message: "Не удалось создать профиль" };
    }

    const auth = createServerAuthClient();
    const { data: session, error: signInError } = await auth.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !session.session) {
      return { ok: false, code: "server", message: "Аккаунт создан, но войти не удалось" };
    }

    return {
      ok: true,
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    };
  });

/** Public: signs in with Email or username. Username lookup stays server-side and never exposes private email. */
export const loginWithIdentifier = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<AuthResult> => {
    const parsed = credentialsSchema.safeParse(data);
    if (!parsed.success) return invalidCredentials;

    const email = await resolveLoginEmail(parsed.data.identifier);
    if (!email) return invalidCredentials;

    const { createServerAuthClient } = await import("./internal-auth.server");
    const auth = createServerAuthClient();
    const { data: session, error } = await auth.auth.signInWithPassword({
      email,
      password: parsed.data.password,
    });
    if (error || !session.session) return invalidCredentials;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", session.user.id);

    return {
      ok: true,
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
    };
  });

export const loginWithUsername = loginWithIdentifier;

/** Authenticated: records activity for the admin panel ("последний вход"). */
export const touchLastSeen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", context.userId);
    return { ok: true };
  });
