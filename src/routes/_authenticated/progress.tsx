import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Flame, Layers, Target } from "lucide-react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { AnimatedCounter } from "@/components/hunmaster/animated-counter";
import { AccuracyChart, WeeklyActivityChart, WordsChart } from "@/components/hunmaster/charts";
import { skillProgress } from "@/data/hunmaster";
import { useLearningStats } from "@/hooks/useLearningStats";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Прогресс обучения — HunMaster Learn" },
      {
        name: "description",
        content: "Статистика обучения венгерскому: активность, точность, словарь и навыки.",
      },
      { property: "og:title", content: "Прогресс обучения — HunMaster Learn" },
      { property: "og:description", content: "Наглядная аналитика вашего прогресса по курсу." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { data } = useLearningStats();
  const cards = [
    { icon: Layers, label: "Прогресс курса", value: `${data?.courseProgress ?? 0}%` },
    { icon: BookOpen, label: "Изучено слов", value: data?.wordsLearned ?? 0 },
    { icon: Target, label: "Уроков", value: data?.lessonsCompleted ?? 0 },
    { icon: Flame, label: "Серия", value: `${data?.streak ?? 0} дней` },
    {
      icon: Clock,
      label: "Время обучения",
      value: `${Math.round((data?.minutesSpent ?? 0) / 60)} ч`,
    },
  ];

  return (
    <PageShell eyebrow="Аналитика" title="Прогресс">
      <AccessGate>
        <Stagger className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map((c) => (
              <StaggerItem key={c.label}>
                <GlassPanel className="h-full p-5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <c.icon className="size-3.5 text-primary" /> {c.label}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold">
                    {typeof c.value === "number" ? <AnimatedCounter value={c.value} /> : c.value}
                  </div>
                </GlassPanel>
              </StaggerItem>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <StaggerItem className="lg:col-span-2">
              <GlassPanel className="h-full p-6">
                <h2 className="font-display text-lg font-bold">Активность за неделю</h2>
                <div className="-mx-2 mt-3">
                  <WeeklyActivityChart data={data?.weeklyActivity} />
                </div>
              </GlassPanel>
            </StaggerItem>
            <StaggerItem>
              <GlassPanel className="h-full p-6">
                <h2 className="font-display text-lg font-bold">Точность</h2>
                <div className="mt-3">
                  <AccuracyChart accuracy={data?.accuracy} />
                </div>
              </GlassPanel>
            </StaggerItem>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <StaggerItem>
              <GlassPanel className="h-full p-6">
                <h2 className="font-display text-lg font-bold">Новые слова по неделям</h2>
                <div className="-mx-2 mt-3">
                  <WordsChart data={data?.weeklyWords} />
                </div>
              </GlassPanel>
            </StaggerItem>
            <StaggerItem>
              <GlassPanel className="h-full p-6">
                <h2 className="font-display text-lg font-bold">Навыки</h2>
                <div className="mt-4 space-y-4">
                  {skillProgress.map((s) => (
                    <div key={s.section}>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{s.section}</span>
                        <span>{s.value}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="bar-fill h-full rounded-full bg-[image:var(--gradient-mint)]"
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </StaggerItem>
          </div>

          <StaggerItem>
            <GlassPanel className="p-6">
              <h2 className="font-display text-lg font-bold">Календарь занятий</h2>
              <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto">
                {(data?.activityCalendar ?? []).map((d) => (
                  <span
                    key={d.date}
                    title={`Уровень активности: ${d.level}`}
                    className="size-3.5 rounded-[5px] bg-primary"
                    style={{ opacity: 0.12 + d.level * 0.2 }}
                  />
                ))}
              </div>
            </GlassPanel>
          </StaggerItem>
        </Stagger>
      </AccessGate>
    </PageShell>
  );
}
