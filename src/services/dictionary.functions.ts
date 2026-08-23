import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { readPaidAccess } from "./access.server";
import type { PaidAccessResult } from "./access.types";
import type { DictionaryEntry } from "./dictionary.types";

export type DictionaryResult =
  | { access: PaidAccessResult & { allowed: false }; items: [] }
  | { access: PaidAccessResult & { allowed: true }; items: DictionaryEntry[] };

/** Dictionary data is returned only after the same backend enrollment decision as other paid pages. */
export const getDictionary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DictionaryResult> => {
    const access = await readPaidAccess(context);
    if (!access.allowed) return { access, items: [] };

    const { dictionaryEntries } = await import("./dictionary.server");
    return { access, items: dictionaryEntries };
  });
