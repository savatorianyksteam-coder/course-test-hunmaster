import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AccessStatus } from "@/data/hunmaster";

export type DemoUser = {
  name: string;
  email: string;
  telegram: string;
  level: string;
  accessUntil: string;
};

const demoUser: DemoUser = {
  name: "",
  email: "",
  telegram: "",
  level: "A1",
  accessUntil: "—",
};

/**
 * DEMO auth/access layer.
 * Session lives in localStorage only. Replace this provider with Supabase Auth
 * later — the component API (user, isAuthenticated, accessStatus) stays the same.
 */

const STORAGE_KEY = "hunmaster-demo-session";
const ACCESS_KEY = "hunmaster-demo-access";

type AuthValue = {
  user: DemoUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  accessStatus: AccessStatus;
  setAccessStatus: (s: AccessStatus) => void;
  signIn: (partial?: Partial<DemoUser>) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue>({
  user: demoUser,
  isAuthenticated: true,
  hydrated: false,
  accessStatus: "active",
  setAccessStatus: () => {},
  signIn: () => {},
  signOut: () => {},
});

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(demoUser);
  const [accessStatus, setAccess] = useState<AccessStatus>("active");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "signed-out") setUser(null);
      else if (raw) setUser({ ...demoUser, ...JSON.parse(raw) });
      const access = window.localStorage.getItem(ACCESS_KEY) as AccessStatus | null;
      if (access) setAccess(access);
    } catch {
      /* ignore demo storage errors */
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((partial?: Partial<DemoUser>) => {
    const next = { ...demoUser, ...partial };
    setUser(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(partial ?? {}));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.localStorage.setItem(STORAGE_KEY, "signed-out");
  }, []);

  const setAccessStatus = useCallback((s: AccessStatus) => {
    setAccess(s);
    window.localStorage.setItem(ACCESS_KEY, s);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hydrated,
      accessStatus,
      setAccessStatus,
      signIn,
      signOut,
    }),
    [user, hydrated, accessStatus, setAccessStatus, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);