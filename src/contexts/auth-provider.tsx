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

function logAuthInitializationError(error: unknown) {
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { message: String(error) };
  console.error("[Auth] Failed to initialize Supabase session", detail);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const finishAsAnonymous = (error: unknown) => {
      logAuthInitializationError(error);
      if (!mounted) return;
      setSession(null);
      setReady(true);
    };

    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
        if (!mounted) return;
        setSession(next);
        setReady(true);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    } catch (error) {
      finishAsAnonymous(error);
      return () => {
        mounted = false;
        unsubscribe?.();
      };
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!mounted) return;
        setSession(data.session);
        setReady(true);
      })
      .catch(finishAsAnonymous);

    return () => {
      mounted = false;
      unsubscribe?.();
    };
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[Auth] Remote sign-out failed; clearing the local session", {
        name: error.name,
        message: error.message,
        status: error.status,
      });
      await supabase.auth.signOut({ scope: "local" });
    }
    setSession(null);
    setReady(true);
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
      hasAccess: accessStatus !== "blocked",
      isAdmin: profile?.role === "admin" || profile?.role === "owner",
      refreshProfile,
      signOut,
    }),
    [
      session,
      profile,
      ready,
      userId,
      profileQuery.isPending,
      accessStatus,
      refreshProfile,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
