import { Link } from "@tanstack/react-router";
import { AlertTriangle, Clock, Lock, ShieldCheck, Send } from "lucide-react";
import type { ReactNode } from "react";
import { brand } from "@/data/hunmaster";
import { usePaidAccess } from "@/hooks/usePaidAccess";
import type { PaidAccessReason, PaidAccessResult } from "@/services/access.types";
import { GlassPanel } from "./glass-panel";
import { Button } from "@/components/ui/button";

const icons = {
  account_blocked: Lock,
  pending: Clock,
  no_enrollment: ShieldCheck,
  expired: AlertTriangle,
  revoked: Lock,
};

const copy: Record<PaidAccessReason, { title: string; description: string; cta: string }> = {
  account_blocked: {
    title: "Доступ к аккаунту ограничен",
    description: "Для получения информации обратитесь в поддержку.",
    cta: "Написать в поддержку",
  },
  pending: {
    title: "Доступ ожидает активации",
    description: "Ваш аккаунт создан, но активный доступ к платному курсу ещё не выдан.",
    cta: "Получить доступ",
  },
  no_enrollment: {
    title: "Нужен активный курс",
    description: "Этот раздел открывается после активации платного курса HunMaster.",
    cta: "Получить доступ",
  },
  expired: {
    title: "Срок доступа закончился",
    description: "Ваш прогресс сохранён. Для продления курса свяжитесь с HunMaster.",
    cta: "Продлить доступ",
  },
  revoked: {
    title: "Доступ к курсу отозван",
    description: "Чтобы восстановить доступ, свяжитесь с командой HunMaster.",
    cta: "Связаться с HunMaster",
  },
};

type AccessGateProps = {
  children: ReactNode;
  access?: PaidAccessResult | undefined;
  loading?: boolean;
  title?: string;
  description?: string;
};

/** Fail-closed paid gate backed by the authenticated server-side enrollment decision. */
export function AccessGate({ children, access, loading, title, description }: AccessGateProps) {
  const accessQuery = usePaidAccess({ enabled: access === undefined && !loading });
  const resolved = access ?? accessQuery.data;
  const isLoading = loading ?? (access === undefined && accessQuery.isPending);

  if (isLoading) {
    return (
      <GlassPanel className="mx-auto max-w-xl p-10 text-center">
        <p className="text-sm text-muted-foreground">Проверяем доступ…</p>
      </GlassPanel>
    );
  }
  if (resolved?.allowed) return <>{children}</>;

  const reason = resolved?.reason ?? "no_enrollment";
  const state = copy[reason];
  const Icon = icons[reason];

  return (
    <GlassPanel className="mx-auto max-w-xl p-8 text-center sm:p-12">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="size-6" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold">{title ?? state.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description ?? state.description}
      </p>
      <Button asChild className="mt-7 rounded-full px-7">
        <a href={brand.telegram} target="_blank" rel="noreferrer">
          <Send className="mr-1 size-4" /> {state.cta}
        </a>
      </Button>
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
