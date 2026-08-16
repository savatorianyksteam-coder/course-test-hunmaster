import { supabase } from "@/integrations/supabase/client";
import type { AccessStatus, UserRole } from "@/data/hunmaster";

export type Profile = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  account_status: "pending" | "active" | "blocked";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
};

export async function fetchMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, username, full_name, avatar_url, role, account_status, is_active, created_at, updated_at, last_seen_at",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Profile | null) ?? null;
}

/** Only safe profile fields are writable by the user; the database blocks role/security fields. */
export async function updateMyName(userId: string, fullName: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

/**
 * Course access is enrollment-based. This status only blocks the whole account
 * when an admin has explicitly disabled it.
 */
export function effectiveAccessStatus(profile: Profile | null): AccessStatus {
  if (!profile) return "pending";
  if (!profile.is_active || profile.account_status === "blocked") return "blocked";
  return "active";
}
