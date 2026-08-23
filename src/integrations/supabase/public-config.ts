export const HUNMASTER_SUPABASE_PROJECT_REF = "lthzuqejupoanyblalmy";
export const HUNMASTER_SUPABASE_URL = `https://${HUNMASTER_SUPABASE_PROJECT_REF}.supabase.co`;
export const HUNMASTER_SUPABASE_PUBLISHABLE_KEY = "sb_publishable__BVezovzEyp5jB2qzqxz8A_vGc7qpS9";

export function readProcessEnv(name: string): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  return process.env[name];
}

/** Prevent browser and server clients from silently targeting different Supabase projects. */
export function assertHunMasterSupabaseUrl(value: string, source: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid Supabase URL configured for ${source}`);
  }

  const expectedHost = `${HUNMASTER_SUPABASE_PROJECT_REF}.supabase.co`;
  if (parsed.protocol !== "https:" || parsed.hostname !== expectedHost) {
    throw new Error(
      `Unexpected Supabase project configured for ${source}; expected ${HUNMASTER_SUPABASE_PROJECT_REF}`,
    );
  }

  return parsed.origin;
}

/** Fail closed if a server secret is ever assigned to a browser/publishable-key variable. */
export function assertSupabasePublishableKey(value: string, source: string): string {
  if (value.startsWith("sb_secret_")) {
    throw new Error(`Secret Supabase key configured for ${source}`);
  }

  if (value.split(".").length === 3) {
    try {
      const encoded = value.split(".")[1]!;
      const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
      const payload = JSON.parse(atob(padded)) as { role?: unknown };
      if (payload.role === "service_role") {
        throw new Error(`Service-role Supabase key configured for ${source}`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Service-role")) throw error;
      // Let Supabase report malformed legacy publishable keys without echoing their value.
    }
  }

  return value;
}
