import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLearningStats } from "@/services/learning.functions";
import { useAuth } from "./useAuth";

export function useLearningStats() {
  const { isAuthenticated, user } = useAuth();
  const fetchStats = useServerFn(getLearningStats);
  return useQuery({
    queryKey: ["learning-stats", user?.id],
    queryFn: () => fetchStats(),
    enabled: isAuthenticated,
  });
}
