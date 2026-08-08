import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell } from "@/components/hunmaster/page-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/mock-auth";
import { accessCopy, brand, learningStats, type AccessStatus } from "@/data/hunmaster";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль ученика — HunMaster Learn" },
      { name: "description", content: "Профиль, статус доступа и учебная статистика в HunMaster Learn." },
      { property: "og:title", content: "Профиль ученика — HunMaster Learn" },
      { property: "og:description", content: "Данные аккаунта и статус доступа к курсам." },
    ],
  }),
  component: ProfilePage,
});

const statuses: AccessStatus[] = ["active", "pending", "expired", "blocked"];

function ProfilePage() {
  const { user, accessStatus, setAccessStatus } = useAuth();

  return (
    <PageShell eyebrow="Аккаунт" title="Профиль">
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] font-display text-lg font-bold text-primary-foreground">
              {user?.name.slice(0, 1)}
            </span>
            <div>
              <div className="font-display text-xl font-bold">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            {[
              ["Telegram", user?.telegram],
              ["Уровень", user?.level],
              ["Доступ до", user?.accessUntil],
              ["Время обучения", learningStats.timeSpent],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <Button
            variant="outline"
            className="mt-6 rounded-full"
            onClick={() => toast("Редактирование появится позже", { description: "Демо-режим" })}
          >
            Редактировать профиль
          </Button>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold">Статус доступа</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Демонстрационное переключение состояний — позже будет приходить из базы данных.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setAccessStatus(s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium uppercase transition-colors ${
                  accessStatus === s
                    ? "border-primary/50 bg-primary/12 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border/60 bg-secondary/25 p-5">
            <div className="font-display text-base font-bold">{accessCopy[accessStatus].title}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {accessCopy[accessStatus].description}
            </p>
            <a
              href={brand.telegram}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              t.me/HunMaster
            </a>
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  );
}
