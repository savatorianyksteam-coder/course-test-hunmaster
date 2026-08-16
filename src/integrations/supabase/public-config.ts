export const HUNMASTER_SUPABASE_URL = "https://lthzuqejupoanyblalmy.supabase.co";
export const HUNMASTER_SUPABASE_PUBLISHABLE_KEY = "sb_publishable__BVezovzEyp5jB2qzqxz8A_vGc7qpS9";

export function readProcessEnv(name: string): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  return process.env[name];
}
