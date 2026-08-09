import { supabase } from "@/integrations/supabase/client";
import type { AccessStatus, UserRole } from "@/data/hunmaster";

export type Profile = {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  access_status: AccessStatus;
  access_started_at: string | null;
  access_expires_at: string | null;
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
};

export async function fetchMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, name, role, access_status, access_started_at, access_expires_at, created_at, updated_at, last_seen_at",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Profile | null) ?? null;
}

/** Only the display name is writable by the user; the database blocks everything else. */
export async function updateMyName(userId: string, name: string) {
  const { error } = await supabase.from("profiles").update({ name }).eq("id", userId);
  if (error) throw new Error(error.message);
}

/**
 * Effective status: a profile marked active whose access window has passed is
 * shown (and treated by the database) as expired.
 */
export function effectiveAccessStatus(profile: Profile | null): AccessStatus {
  if (!profile) return "pending";
  if (profile.role === "admin") return "active";
  if (
    profile.access_status === "active" &&
    profile.access_expires_at &&
    new Date(profile.access_expires_at).getTime() <= Date.now()
  ) {
    return "expired";
  }
  return profile.access_status;
}