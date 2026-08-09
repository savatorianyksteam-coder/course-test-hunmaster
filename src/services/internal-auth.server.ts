// SERVER ONLY. Maps a public username to the internal auth identifier used by
// the auth system. The internal identifier is never exposed to the browser.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const INTERNAL_DOMAIN = "users.hunmaster.internal";

export function usernameToInternalEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${INTERNAL_DOMAIN}`;
}

/** Publishable-key client used server-side for password grants (no session persistence). */
export function createServerAuthClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
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