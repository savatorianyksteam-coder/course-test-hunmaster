import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { ready, isAuthenticated } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      navigate({ to: "/login", replace: true });
    }
  }, [isAuthenticated, navigate, ready]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="aurora grain grid min-h-screen place-items-center px-4 py-32">
        <GlassPanel className="w-full max-w-md p-8 text-center text-sm text-muted-foreground">
          Проверяем сессию…
        </GlassPanel>
      </div>
    );
  }

  return <Outlet />;
}
