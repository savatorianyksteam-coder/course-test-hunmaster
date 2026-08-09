import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { effectiveAccessStatus, fetchMyProfile, type Profile } from "@/services/profiles";
import type { AccessStatus } from "@/data/hunmaster";

export type AuthValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  /** Session restoration finished (persistent session already read from storage). */
  ready: boolean;
  profileLoading: boolean;
  accessStatus: AccessStatus;
  hasAccess: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchMyProfile(userId!),
    enabled: Boolean(userId),
    // Access status is changed from the admin panel — keep it fresh.
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const refreshProfile = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
  }, [queryClient, userId]);

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
  }, [queryClient]);

  const profile = profileQuery.data ?? null;
  const accessStatus = effectiveAccessStatus(profile);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isAuthenticated: Boolean(session),
      ready,
      profileLoading: Boolean(userId) && profileQuery.isPending,
      accessStatus,
      hasAccess: accessStatus === "active",
      isAdmin: profile?.role === "admin",
      refreshProfile,
      signOut,
    }),
    [session, profile, ready, userId, profileQuery.isPending, accessStatus, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}