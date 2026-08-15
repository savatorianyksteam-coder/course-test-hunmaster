import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Flame, Layers, Sparkles } from "lucide-react";
import { LearningHero } from "@/components/hunmaster/learning-hero";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { AnimatedCounter } from "@/components/hunmaster/animated-counter";
import { Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { CourseEmblem } from "@/components/hunmaster/course-emblem";
import { Button } from "@/components/ui/button";
import { a1Modules, a1LessonIds, courses } from "@/data/hunmaster";
import { useLearningStats } from "@/hooks/useLearningStats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HunMaster Learn — учебный дашборд" },
      {
        name: "description",
        content:
          "Личный дашборд HunMaster Learn: текущий урок, прогресс курса, серия занятий и статистика обучения венгерскому.",
      },
      { property: "og:title", content: "HunMaster Learn — учебный дашборд" },
      {
        property: "og:description",
        content: "Продолжайте обучение венгерскому: модули, уроки и прогресс в одном месте.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const active = courses[0]!;
  const { data } = useLearningStats();
  const done = new Set(data?.completedLessonIds ?? []);
  const allLessons = a1Modules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.title })));
  const upcoming = allLessons.filter((l) => !done.has(l.id)).slice(0, 3);
  const next = upcoming[0] ?? allLessons[0]!;
  const learningStats = {
    courseProgress: data?.courseProgress ?? 0,
    wordsLearned: data?.wordsLearned ?? 0,
    streak: data?.streak ?? 0,
    timeSpent: `${Math.round((data?.minutesSpent ?? 0) / 60)} ч`,
  };
  const currentLesson = {
    id: next.id,
    number: next.number,
    title: next.title,
    module: next.module,
    duration: "15 мин",
    tasks: 0,
    progress: Math.round(((data?.lessonsCompleted ?? 0) / (a1LessonIds.length || 1)) * 100),
  };

  return (
    <>
      <LearningHero />
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AccessGate>
            <Stagger className="grid gap-5 lg:grid-cols-3">
              <StaggerItem className="lg:col-span-2">
                <GlassPanel className="h-full p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <CourseEmblem code={active.code} />
                      <div>
                        <h2 className="font-display text-xl font-bold">{active.title}</h2>
                        <p className="text-xs text-muted-foreground">
                          {active.lessons} уроков · {active.modules} модулей · ~{active.hours} часов
                        </p>
                      </div>
                    </div>
                    <Button asChild className="rounded-full px-6">
                      <Link to="/courses/$courseId" params={{ courseId: active.id }}>
                        К курсу <ArrowRight className="ml-1 size-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: Layers, label: "Прогресс", value: `${learningStats.courseProgress}%` },
                      { icon: BookOpen, label: "Слов", value: learningStats.wordsLearned },
                      { icon: Clock, label: "Время", value: learningStats.timeSpent },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <s.icon className="size-3.5 text-primary" /> {s.label}
                        </div>
                        <div className="mt-1 font-display text-lg font-bold">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2.5">
                    <div className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Дальше по программе
                    </div>
                    {upcoming.map((l) => (
                      <Link
                        key={l.id}
                        to="/lesson/$lessonId"
                        params={{ lessonId: l.id }}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/8"
                      >
                        <div>
                          <div className="text-sm font-semibold">
                            Урок {l.number} — {l.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {l.module} · {l.hu}
                          </div>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </GlassPanel>
              </StaggerItem>

              <StaggerItem>
                <GlassPanel className="h-full p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" /> Текущий урок
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold">
                    Урок {currentLesson.number} — {currentLesson.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentLesson.module} · {currentLesson.duration}
                  </p>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Пройдено</span>
                      <span>{currentLesson.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="bar-fill h-full rounded-full bg-[image:var(--gradient-mint)]"
                        style={{ width: `${currentLesson.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button asChild className="mt-6 w-full rounded-full">
                    <Link to="/lesson/$lessonId" params={{ lessonId: currentLesson.id }}>
                      Продолжить
                    </Link>
                  </Button>

                  <div className="mt-7 rounded-2xl border border-border/60 bg-secondary/25 p-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Flame className="size-3.5 text-primary" /> Серия занятий
                    </div>
                    <div className="mt-1 font-display text-3xl font-bold">
                      <AnimatedCounter value={learningStats.streak} /> дней
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Занимайтесь сегодня, чтобы не прервать серию.
                    </p>
                  </div>
                </GlassPanel>
              </StaggerItem>
            </Stagger>
          </AccessGate>
        </div>
      </section>
    </>
  );
}