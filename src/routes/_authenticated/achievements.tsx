import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, Flame, Lock, Star, Target, Trophy } from "lucide-react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { achievementDefs } from "@/data/hunmaster";
import { useLearningStats } from "@/hooks/useLearningStats";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({
    meta: [
      { title: "Достижения — HunMaster Learn" },
      {
        name: "description",
        content: "Награды за серии занятий, изученные слова и завершённые модули курса.",
      },
      { property: "og:title", content: "Достижения — HunMaster Learn" },
      { property: "og:description", content: "Ваши награды и открытые цели обучения." },
    ],
  }),
  component: AchievementsPage,
});

const icons = { award: Award, flame: Flame, star: Star, trophy: Trophy, book: BookOpen, target: Target };

function AchievementsPage() {
  const { data } = useLearningStats();
  const value = (metric: string) => {
    if (metric === "lessons") return data?.lessonsCompleted ?? 0;
    if (metric === "streak") return data?.streak ?? 0;
    if (metric === "words") return data?.wordsLearned ?? 0;
    if (metric === "perfect") return data?.perfectLessons ?? 0;
    return 0;
  };
  const achievements = achievementDefs.map((a) => {
    const current = value(a.metric);
    return {
      ...a,
      unlocked: current >= a.target,
      progress: Math.min(100, Math.round((current / a.target) * 100)),
    };
  });
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <PageShell
      eyebrow="Награды"
      title="Достижения"
      description={`Открыто ${unlocked} из ${achievements.length} наград.`}
    >
      <AccessGate>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const Icon = icons[a.icon];
            return (
              <StaggerItem key={a.id}>
                <GlassPanel className={`h-full p-6 ${a.unlocked ? "" : "opacity-65"}`}>
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid size-12 place-items-center rounded-2xl ${
                        a.unlocked
                          ? "bg-[image:var(--gradient-brand)] text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {a.unlocked ? <Icon className="size-5" /> : <Lock className="size-5" />}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {a.unlocked ? "Открыто" : `${a.progress}%`}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="bar-fill h-full rounded-full bg-[image:var(--gradient-mint)]"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                </GlassPanel>
              </StaggerItem>
            );
          })}
        </Stagger>
      </AccessGate>
    </PageShell>
  );
}