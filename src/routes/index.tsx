import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock, Flame, Layers, Sparkles } from "lucide-react";
import { LearningHero } from "@/components/hunmaster/learning-hero";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { AnimatedCounter } from "@/components/hunmaster/animated-counter";
import { Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { CourseEmblem } from "@/components/hunmaster/course-emblem";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLearningStats } from "@/hooks/useLearningStats";
import { fetchMyCourses } from "@/services/courses";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "HunMaster Learn — учебный дашборд" },
      {
        name: "description",
        content: "Личный дашборд HunMaster Learn: ваши курсы, прогресс и продолжение обучения.",
      },
      { property: "og:title", content: "HunMaster Learn — учебный дашборд" },
      {
        property: "og:description",
        content: "Продолжайте обучение венгерскому: курсы, уроки и прогресс в одном месте.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: stats } = useLearningStats();
  const coursesQuery = useQuery({
    queryKey: ["my-courses", user?.id],
    queryFn: () => fetchMyCourses(user!.id),
    enabled: Boolean(user?.id),
  });
  const active = coursesQuery.data?.[0] ?? null;

  const learningStats = {
    courseProgress: stats?.courseProgress ?? active?.progress ?? 0,
    wordsLearned: stats?.wordsLearned ?? 0,
    streak: stats?.streak ?? 0,
    timeSpent: `${Math.round((stats?.minutesSpent ?? 0) / 60)} ч`,
  };

  return (
    <>
      <LearningHero course={active} />
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AccessGate>
            {coursesQuery.isPending && (
              <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
                Загружаем личный кабинет…
              </GlassPanel>
            )}

            {!coursesQuery.isPending && !active && (
              <GlassPanel className="p-8 text-center sm:p-12">
                <h2 className="font-display text-2xl font-bold">У вас пока нет доступных курсов</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Когда администратор HunMaster выдаст доступ к курсу, он появится здесь
                  автоматически.
                </p>
                <Button asChild className="mt-7 rounded-full px-7">
                  <Link to="/courses">Проверить мои курсы</Link>
                </Button>
              </GlassPanel>
            )}

            {active && (
              <Stagger className="grid gap-5 lg:grid-cols-3">
                <StaggerItem className="lg:col-span-2">
                  <GlassPanel className="h-full p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <CourseEmblem code={active.code} />
                        <div>
                          <h2 className="font-display text-xl font-bold">{active.title}</h2>
                          <p className="text-xs text-muted-foreground">
                            {active.lessonsCount} уроков · {active.sectionsCount} модулей
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
                        {
                          icon: Layers,
                          label: "Прогресс",
                          value: `${learningStats.courseProgress}%`,
                        },
                        { icon: BookOpen, label: "Слов", value: learningStats.wordsLearned },
                        { icon: Clock, label: "Время", value: learningStats.timeSpent },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3"
                        >
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <item.icon className="size-3.5 text-primary" /> {item.label}
                          </div>
                          <div className="mt-1 font-display text-lg font-bold">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3">
                      <div className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Дальше по программе
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Откройте курс, чтобы увидеть опубликованные уроки и продолжить с места
                        остановки.
                      </p>
                    </div>
                  </GlassPanel>
                </StaggerItem>

                <StaggerItem>
                  <GlassPanel className="h-full p-6 sm:p-7">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="size-3.5 text-primary" /> Активный курс
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold">{active.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {active.completedLessons} из {active.lessonsCount} уроков завершено
                    </p>
                    <div className="mt-5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Пройдено</span>
                        <span>{active.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="bar-fill h-full rounded-full bg-[image:var(--gradient-mint)]"
                          style={{ width: `${active.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button asChild className="mt-6 w-full rounded-full">
                      <Link to="/courses/$courseId" params={{ courseId: active.id }}>
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
                        Завершайте уроки, чтобы серия обновлялась в общей базе.
                      </p>
                    </div>
                  </GlassPanel>
                </StaggerItem>
              </Stagger>
            )}
          </AccessGate>
        </div>
      </section>
    </>
  );
}
