import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, Check, ChevronDown, Lock, Play } from "lucide-react";
import { useState } from "react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { AnimatedCounter } from "@/components/hunmaster/animated-counter";
import { a1Modules, courses, learningStats, type LessonState } from "@/data/hunmaster";

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Венгерский язык A1 — HunMaster Learn" },
      {
        name: "description",
        content: "Модули и уроки курса венгерского языка A1: программа, прогресс и доступ к урокам.",
      },
      { property: "og:title", content: "Венгерский язык A1 — HunMaster Learn" },
      { property: "og:description", content: "12 модулей, 60 уроков и наглядный прогресс курса." },
    ],
  }),
  component: CoursePage,
});

const stateIcon: Record<LessonState, typeof Check> = {
  done: Check,
  current: Play,
  available: BookOpen,
  locked: Lock,
};

function CoursePage() {
  const { courseId } = Route.useParams();
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw notFound();
  const [open, setOpen] = useState<string[]>([a1Modules[0]!.code, a1Modules[2]!.code]);

  const toggle = (code: string) =>
    setOpen((o) => (o.includes(code) ? o.filter((c) => c !== code) : [...o, code]));

  return (
    <PageShell eyebrow="Курс" title={`${course.title.replace(" A1", "")} — ${course.code}`}>
      <AccessGate>
        <Stagger className="space-y-6">
          <StaggerItem>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Завершено", value: `${learningStats.courseProgress}%` },
                {
                  label: "Уроков",
                  value: `${learningStats.lessonsDone} / ${learningStats.lessonsTotal}`,
                },
                { label: "Изученных слов", value: learningStats.wordsLearned },
              ].map((s) => (
                <GlassPanel key={s.label} className="p-5">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="mt-1 font-display text-2xl font-bold">
                    {typeof s.value === "number" ? <AnimatedCounter value={s.value} /> : s.value}
                  </div>
                </GlassPanel>
              ))}
            </div>
          </StaggerItem>

          {a1Modules.map((m) => {
            const expanded = open.includes(m.code);
            const done = m.lessons.filter((l) => l.state === "done").length;
            return (
              <StaggerItem key={m.code}>
                <GlassPanel className="overflow-hidden p-0">
                  <button
                    onClick={() => toggle(m.code)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl font-extrabold text-primary">
                        {m.code}
                      </span>
                      <div>
                        <div className="font-display text-lg font-bold">{m.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {done} / {m.lessons.length} уроков пройдено
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-2 px-4 pb-5 sm:px-6">
                        {m.lessons.map((l) => {
                          const Icon = stateIcon[l.state];
                          const locked = l.state === "locked";
                          const content = (
                            <div
                              className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                                l.state === "current"
                                  ? "border-primary/45 bg-primary/10"
                                  : "border-border/60 bg-secondary/25"
                              } ${locked ? "opacity-55" : "hover:border-primary/40"}`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`grid size-8 place-items-center rounded-xl ${
                                    l.state === "done"
                                      ? "bg-accent/15 text-accent"
                                      : "bg-primary/12 text-primary"
                                  }`}
                                >
                                  <Icon className="size-4" />
                                </span>
                                <div>
                                  <div className="text-sm font-semibold">{l.title}</div>
                                  <div className="text-xs text-muted-foreground">{l.hu}</div>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Урок {l.number}
                              </span>
                            </div>
                          );
                          return locked ? (
                            <div key={l.id}>{content}</div>
                          ) : (
                            <Link key={l.id} to="/lesson/$lessonId" params={{ lessonId: l.id }}>
                              {content}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
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