import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./useAuth";

export function useSignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return async () => {
    await signOut();
    navigate({ to: "/login", replace: true });
  };
}
