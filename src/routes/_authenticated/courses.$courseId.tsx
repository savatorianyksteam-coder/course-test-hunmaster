import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Check, ChevronDown, Lock, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { AnimatedCounter } from "@/components/hunmaster/animated-counter";
import { useAuth } from "@/hooks/useAuth";
import { fetchCourseDetail } from "@/services/courses";

export const Route = createFileRoute("/_authenticated/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "Курс — HunMaster Learn" },
      {
        name: "description",
        content: "Модули, уроки и прогресс курса HunMaster Learn.",
      },
      { property: "og:title", content: "Курс — HunMaster Learn" },
      { property: "og:description", content: "Реальная программа курса и ваш прогресс." },
    ],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState<string[]>([]);

  const courseQuery = useQuery({
    queryKey: ["course-detail", courseId, user?.id],
    queryFn: () => fetchCourseDetail(courseId, user!.id),
    enabled: Boolean(user?.id),
  });

  const course = courseQuery.data;

  useEffect(() => {
    if (course?.sections.length && open.length === 0) {
      setOpen([course.sections[0]!.id]);
    }
  }, [course?.sections, open.length]);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((sectionId) => sectionId !== id) : [...current, id],
    );

  return (
    <PageShell eyebrow="Курс" title={course?.title ?? "Курс"}>
      <AccessGate>
        {courseQuery.isPending && (
          <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
            Загружаем курс…
          </GlassPanel>
        )}

        {courseQuery.isError && (
          <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
            Не удалось загрузить курс. Попробуйте обновить страницу.
          </GlassPanel>
        )}

        {!courseQuery.isPending && !courseQuery.isError && !course && (
          <GlassPanel className="p-8 text-center sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Lock className="size-6" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-bold">Курс недоступен</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Доступ открывается только при активном enrollment в HunMaster Admin.
            </p>
          </GlassPanel>
        )}

        {course && (
          <Stagger className="space-y-6">
            <StaggerItem>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Завершено", value: `${course.progress}%` },
                  {
                    label: "Уроков",
                    value: `${course.completedLessons} / ${course.lessonsCount}`,
                  },
                  { label: "Модулей", value: course.sectionsCount },
                ].map((item) => (
                  <GlassPanel key={item.label} className="p-5">
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="mt-1 font-display text-2xl font-bold">
                      {typeof item.value === "number" ? (
                        <AnimatedCounter value={item.value} />
                      ) : (
                        item.value
                      )}
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </StaggerItem>

            {course.sections.map((section) => {
              const expanded = open.includes(section.id);
              const done = section.lessons.filter((lesson) => lesson.completed).length;
              return (
                <StaggerItem key={section.id}>
                  <GlassPanel className="overflow-hidden p-0">
                    <button
                      onClick={() => toggle(section.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-display text-xl font-extrabold text-primary">
                          {String(section.position + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="font-display text-lg font-bold">{section.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {done} / {section.lessons.length} уроков пройдено
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
                          {section.lessons.length === 0 && (
                            <div className="rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3 text-sm text-muted-foreground">
                              В этом модуле пока нет опубликованных уроков.
                            </div>
                          )}
                          {section.lessons.map((lesson) => {
                            const Icon = lesson.completed
                              ? Check
                              : lesson.progress > 0
                                ? Play
                                : BookOpen;
                            return (
                              <Link
                                key={lesson.id}
                                to="/lesson/$lessonId"
                                params={{ lessonId: lesson.id }}
                              >
                                <div
                                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                                    lesson.progress > 0 && !lesson.completed
                                      ? "border-primary/45 bg-primary/10"
                                      : "border-border/60 bg-secondary/25"
                                  } hover:border-primary/40`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`grid size-8 place-items-center rounded-xl ${
                                        lesson.completed
                                          ? "bg-accent/15 text-accent"
                                          : "bg-primary/12 text-primary"
                                      }`}
                                    >
                                      <Icon className="size-4" />
                                    </span>
                                    <div>
                                      <div className="text-sm font-semibold">{lesson.title}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {lesson.description ?? "Описание урока пока не добавлено."}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    Урок {lesson.position + 1}
                                  </span>
                                </div>
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
        )}
      </AccessGate>
    </PageShell>
  );
}
