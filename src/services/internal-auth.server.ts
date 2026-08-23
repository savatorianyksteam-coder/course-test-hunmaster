import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  assertHunMasterSupabaseUrl,
  assertSupabasePublishableKey,
  HUNMASTER_SUPABASE_PUBLISHABLE_KEY,
  HUNMASTER_SUPABASE_URL,
} from "@/integrations/supabase/public-config";

function supabaseUrl() {
  return assertHunMasterSupabaseUrl(
    process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || HUNMASTER_SUPABASE_URL,
    "server auth client",
  );
}

function supabaseAnonKey() {
  return assertSupabasePublishableKey(
    process.env["SUPABASE_ANON_KEY"] ||
      process.env["VITE_SUPABASE_ANON_KEY"] ||
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      HUNMASTER_SUPABASE_PUBLISHABLE_KEY,
    "server auth client",
  );
}

/** Publishable-key client used server-side for password grants (no session persistence). */
export function createServerAuthClient() {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) {
    throw new Error("Missing Supabase URL or anon key for server auth");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
