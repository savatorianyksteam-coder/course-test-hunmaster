import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { PaidAccessResult } from "./access.types";

type AccessContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
};

type EnrollmentAccessRow = Pick<
  Database["public"]["Tables"]["enrollments"]["Row"],
  "status" | "expires_at"
>;

function isActiveEnrollment(row: EnrollmentAccessRow, now: number) {
  return row.status === "active" && (!row.expires_at || new Date(row.expires_at).getTime() > now);
}

/** Server-only paid access decision shared by every protected learning surface. */
export async function readPaidAccess(context: AccessContext): Promise<PaidAccessResult> {
  const [profileResult, enrollmentResult] = await Promise.all([
    context.supabase
      .from("profiles")
      .select("role, account_status, is_active")
      .eq("id", context.userId)
      .maybeSingle(),
    context.supabase.from("enrollments").select("status, expires_at").eq("user_id", context.userId),
  ]);

  if (profileResult.error) throw new Error(profileResult.error.message);
  if (enrollmentResult.error) throw new Error(enrollmentResult.error.message);

  const profile = profileResult.data;
  if (!profile) return { allowed: false, reason: "pending" };
  if (!profile.is_active || profile.account_status === "blocked") {
    return { allowed: false, reason: "account_blocked" };
  }

  // Preserve the existing privileged review path used by the shared HunMaster backend.
  if (profile.role === "admin" || profile.role === "owner") {
    return { allowed: true, reason: null };
  }

  const enrollments = (enrollmentResult.data ?? []) as EnrollmentAccessRow[];
  const now = Date.now();
  if (enrollments.some((row) => isActiveEnrollment(row, now))) {
    return { allowed: true, reason: null };
  }

  if (profile.account_status === "pending") return { allowed: false, reason: "pending" };
  if (enrollments.some((row) => row.status === "revoked")) {
    return { allowed: false, reason: "revoked" };
  }
  if (
    enrollments.some(
      (row) =>
        row.status === "expired" ||
        row.status === "completed" ||
        (row.expires_at != null && new Date(row.expires_at).getTime() <= now),
    )
  ) {
    return { allowed: false, reason: "expired" };
  }

  return { allowed: false, reason: "no_enrollment" };
}
