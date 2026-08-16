import { useAuth } from "./useAuth";

export function useAccess() {
  const { accessStatus, hasAccess, profile, profileLoading } = useAuth();
  return {
    status: accessStatus,
    hasAccess,
    loading: profileLoading,
    startedAt: profile?.created_at ?? null,
    expiresAt: null,
  };
}
