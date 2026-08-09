import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const USERNAME_RULES = {
  min: 3,
  max: 24,
  pattern: /^[a-zA-Z0-9_.]+$/,
};

export type AuthResult =
  | { ok: true; access_token: string; refresh_token: string }
  | { ok: false; code: "invalid_credentials" | "username_taken" | "validation" | "server"; message: string };

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(200),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(60, "Слишком длинное имя"),
  username: z
    .string()
    .trim()
    .min(USERNAME_RULES.min, "Логин должен содержать минимум 3 символа")
    .max(USERNAME_RULES.max, "Логин слишком длинный")
    .regex(USERNAME_RULES.pattern, "Допустимы латинские буквы, цифры, _ и ."),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов").max(200),
});

/** Public: creates a real account (name + username + password) and signs the user in. */
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
    const { name, username, password } = parsed.data;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { usernameToInternalEmail, createServerAuthClient } = await import(
      "./internal-auth.server"
    );

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .maybeSingle();
    if (lookupError) return { ok: false, code: "server", message: "Не удалось проверить логин" };
    if (existing) return { ok: false, code: "username_taken", message: "Этот логин уже занят" };

    const email = usernameToInternalEmail(username);
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, name },
    });
    if (createError || !created.user) {
      const taken = createError?.message?.toLowerCase().includes("already");
      return taken
        ? { ok: false, code: "username_taken", message: "Этот логин уже занят" }
        : { ok: false, code: "server", message: "Не удалось создать аккаунт" };
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: created.user.id,
      username,
      name,
      role: "user",
      access_status: "pending",
    });
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

/** Public: signs in with username + password. The internal identifier stays server-side. */
export const loginWithUsername = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<AuthResult> => {
    const parsed = credentialsSchema.safeParse(data);
    const generic = {
      ok: false as const,
      code: "invalid_credentials" as const,
      message: "Неверный логин или пароль",
    };
    if (!parsed.success) return generic;

    const { usernameToInternalEmail, createServerAuthClient } = await import(
      "./internal-auth.server"
    );
    const auth = createServerAuthClient();
    const { data: session, error } = await auth.auth.signInWithPassword({
      email: usernameToInternalEmail(parsed.data.username),
      password: parsed.data.password,
    });
    if (error || !session.session) return generic;

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