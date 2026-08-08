import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Layers, Lock, Sparkles } from "lucide-react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { CourseEmblem } from "@/components/hunmaster/course-emblem";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/hunmaster";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Мои курсы — HunMaster Learn" },
      {
        name: "description",
        content: "Курсы венгерского языка на HunMaster Learn: A1, A2, B1 и разговорный курс.",
      },
      { property: "og:title", content: "Мои курсы — HunMaster Learn" },
      { property: "og:description", content: "Ваши учебные программы и прогресс по каждой из них." },
    ],
  }),
  component: MyCourses,
});

function MyCourses() {
  const [primary, ...rest] = courses;

  return (
    <PageShell
      eyebrow="Обучение"
      title="Мои курсы"
      description="Активная программа и доступные в будущем уровни."
    >
      <AccessGate>
        <Stagger className="space-y-5">
          {primary && (
            <StaggerItem>
              <GlassPanel className="p-6 sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <CourseEmblem code={primary.code} className="size-16" />
                    <div>
                      <h2 className="font-display text-2xl font-bold sm:text-3xl">
                        {primary.title}
                      </h2>
                      <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                        {primary.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Layers className="size-4" /> {primary.lessons} уроков
                        </span>
                        <span className="flex items-center gap-2">
                          <Sparkles className="size-4" /> {primary.modules} модулей
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="size-4" /> ~{primary.hours} часов
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="lg" className="glow-edge rounded-full px-8">
                    <Link to="/courses/$courseId" params={{ courseId: primary.id }}>
                      Продолжить <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-7">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Прогресс</span>
                    <span>{primary.progress}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="bar-fill h-full rounded-full bg-[image:var(--gradient-brand)]"
                      style={{ width: `${primary.progress}%` }}
                    />
                  </div>
                </div>
              </GlassPanel>
            </StaggerItem>
          )}

          <div className="grid gap-5 lg:grid-cols-3">
            {rest.map((c) => (
              <StaggerItem key={c.id}>
                <GlassPanel className="h-full p-6 opacity-80">
                  <div className="flex items-start justify-between">
                    <CourseEmblem code={c.code} />
                    <span className="flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground">
                      <Lock className="size-3" />
                      {c.state === "soon" ? "Скоро" : "Недоступно"}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Layers className="size-3.5" /> {c.lessons} уроков
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" /> ~{c.hours} ч
                    </span>
                  </div>
                  <Button disabled variant="outline" className="mt-6 w-full rounded-full">
                    {c.state === "soon" ? "Скоро" : "Недоступно"}
                  </Button>
                </GlassPanel>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </AccessGate>
    </PageShell>
  );
}