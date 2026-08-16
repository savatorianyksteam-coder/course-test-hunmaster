import { Link } from "@tanstack/react-router";
import { AlertTriangle, Clock, Lock, ShieldCheck, Send } from "lucide-react";
import type { ReactNode } from "react";
import { accessCopy, brand } from "@/data/hunmaster";
import { useAuth } from "@/hooks/useAuth";
import { GlassPanel } from "./glass-panel";
import { Button } from "@/components/ui/button";

const icons = {
  active: ShieldCheck,
  pending: Clock,
  expired: AlertTriangle,
  blocked: Lock,
};

/** Renders children for signed-in students unless the shared profile is blocked. */
export function AccessGate({ children }: { children: ReactNode }) {
  const { accessStatus, profileLoading } = useAuth();
  if (profileLoading) {
    return (
      <GlassPanel className="mx-auto max-w-xl p-10 text-center">
        <p className="text-sm text-muted-foreground">Проверяем доступ…</p>
      </GlassPanel>
    );
  }
  if (accessStatus !== "blocked") return <>{children}</>;

  const copy = accessCopy[accessStatus];
  const Icon = icons[accessStatus];

  return (
    <GlassPanel className="mx-auto max-w-xl p-8 text-center sm:p-12">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="size-6" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold">{copy.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
      {copy.cta && (
        <Button asChild className="mt-7 rounded-full px-7">
          <a href={brand.telegram} target="_blank" rel="noreferrer">
            <Send className="mr-1 size-4" /> {copy.cta}
          </a>
        </Button>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Telegram:{" "}
        <a href={brand.telegram} className="text-primary" target="_blank" rel="noreferrer">
          t.me/HunMaster
        </a>
      </p>
      <p className="mt-6 text-xs text-muted-foreground">
        Текущий статус доступа виден в{" "}
        <Link to="/profile" className="text-primary underline-offset-4 hover:underline">
          профиле
        </Link>
        .
      </p>
    </GlassPanel>
  );
}
