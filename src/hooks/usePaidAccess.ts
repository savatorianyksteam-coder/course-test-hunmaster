import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPaidAccess } from "@/services/access.functions";
import { useAuth } from "./useAuth";

export function usePaidAccess({ enabled = true }: { enabled?: boolean } = {}) {
  const { isAuthenticated, ready, user } = useAuth();
  const fetchAccess = useServerFn(getPaidAccess);

  return useQuery({
    queryKey: ["paid-access", user?.id],
    queryFn: () => fetchAccess(),
    enabled: enabled && ready && isAuthenticated,
    staleTime: 15_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
