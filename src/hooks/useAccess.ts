import { useAuth } from "./useAuth";

export function useAccess() {
  const { accessStatus, hasAccess, profile, profileLoading } = useAuth();
  return {
    status: accessStatus,
    hasAccess,
    loading: profileLoading,
    startedAt: profile?.access_started_at ?? null,
    expiresAt: profile?.access_expires_at ?? null,
  };
}