import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { readPaidAccess } from "./access.server";
import type { PaidAccessResult } from "./access.types";

/** Authenticated, server-backed access state for paid HunMaster Learn surfaces. */
export const getPaidAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PaidAccessResult> => readPaidAccess(context));
