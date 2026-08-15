import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell } from "@/components/hunmaster/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLearningStats } from "@/hooks/useLearningStats";
import { useSignOut } from "@/hooks/useSignOut";
import { updateMyName } from "@/services/profiles";
import { accessCopy, brand } from "@/data/hunmaster";

export const Route = createFileRoute("/_authenticated/profile")({
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

const fmt = (v: string | null) =>
  v ? new Date(v).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" }) : "—";

function ProfilePage() {
  const { profile, accessStatus, refreshProfile } = useAuth();
  const { data: stats } = useLearningStats();
  const signOut = useSignOut();
  const queryClient = useQueryClient();
  const [name, setName] = useState(profile?.name ?? "");

  const save = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      await updateMyName(profile.id, name.trim());
    },
    onSuccess: async () => {
      await refreshProfile();
      await queryClient.invalidateQueries();
      toast.success("Профиль обновлён");
    },
    onError: () => toast.error("Не удалось сохранить имя"),
  });

  return (
    <PageShell eyebrow="Аккаунт" title="Профиль">
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassPanel className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] font-display text-lg font-bold text-primary-foreground">
              {(profile?.name ?? "?").slice(0, 1)}
            </span>
            <div>
              <div className="font-display text-xl font-bold">{profile?.name ?? "—"}</div>
              <div className="text-sm text-muted-foreground">@{profile?.username ?? "—"}</div>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            {[
              ["Роль", profile?.role === "admin" ? "Администратор" : "Ученик"],
              ["Аккаунт создан", fmt(profile?.created_at ?? null)],
              ["Доступ с", fmt(profile?.access_started_at ?? null)],
              ["Доступ до", profile?.access_expires_at ? fmt(profile.access_expires_at) : "Бессрочно"],
              ["Время обучения", `${Math.round((stats?.minutesSpent ?? 0) / 60)} ч`],
              ["Пройдено уроков", `${stats?.lessonsCompleted ?? 0} из ${stats?.lessonsTotal ?? 0}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/50 pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <Label htmlFor="name">Отображаемое имя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-2xl"
              required
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={save.isPending} className="rounded-full px-6">
                {save.isPending ? "Сохраняем…" : "Сохранить"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void signOut()}
              >
                Выйти
              </Button>
            </div>
          </form>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold">Статус доступа</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Статусом управляет команда HunMaster — он приходит из общей базы данных.
          </p>
          <div className="mt-5">
            <span className="rounded-full border border-primary/50 bg-primary/12 px-4 py-2 text-sm font-medium text-primary uppercase">
              {accessStatus}
            </span>
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
