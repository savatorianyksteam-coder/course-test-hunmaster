import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Layers, Sparkles } from "lucide-react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { CourseEmblem } from "@/components/hunmaster/course-emblem";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyCourses } from "@/services/courses";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [
      { title: "Мои курсы — HunMaster Learn" },
      {
        name: "description",
        content: "Курсы HunMaster Learn, открытые ученику через общую базу HunMaster Admin.",
      },
      { property: "og:title", content: "Мои курсы — HunMaster Learn" },
      {
        property: "og:description",
        content: "Ваши учебные программы и прогресс по каждой из них.",
      },
    ],
  }),
  component: MyCourses,
});

function MyCourses() {
  const { user } = useAuth();
  const coursesQuery = useQuery({
    queryKey: ["my-courses", user?.id],
    queryFn: () => fetchMyCourses(user!.id),
    enabled: Boolean(user?.id),
  });

  const courses = coursesQuery.data ?? [];
  const [primary, ...rest] = courses;

  return (
    <PageShell
      eyebrow="Обучение"
      title="Мои курсы"
      description="Доступы приходят из HunMaster Admin и обновляются без ручной синхронизации."
    >
      <AccessGate>
        {coursesQuery.isPending && (
          <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
            Загружаем ваши курсы…
          </GlassPanel>
        )}

        {coursesQuery.isError && (
          <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
            Не удалось загрузить курсы. Попробуйте обновить страницу.
          </GlassPanel>
        )}

        {!coursesQuery.isPending && !coursesQuery.isError && courses.length === 0 && (
          <GlassPanel className="p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-bold">У вас пока нет доступных курсов</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Когда команда HunMaster выдаст доступ в Admin Panel, курс появится здесь
              автоматически.
            </p>
          </GlassPanel>
        )}

        {courses.length > 0 && (
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
                          {primary.description ?? "Описание курса пока не добавлено."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Layers className="size-4" /> {primary.lessonsCount} уроков
                          </span>
                          <span className="flex items-center gap-2">
                            <Sparkles className="size-4" /> {primary.sectionsCount} модулей
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="size-4" /> доступ открыт
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
              {rest.map((course) => (
                <StaggerItem key={course.id}>
                  <GlassPanel className="h-full p-6">
                    <CourseEmblem code={course.code} />
                    <h3 className="mt-5 font-display text-xl font-bold">{course.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {course.description ?? "Описание курса пока не добавлено."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Layers className="size-3.5" /> {course.lessonsCount} уроков
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" /> {course.progress}%
                      </span>
                    </div>
                    <Button asChild variant="outline" className="mt-6 w-full rounded-full">
                      <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                        Открыть курс
                      </Link>
                    </Button>
                  </GlassPanel>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        )}
      </AccessGate>
    </PageShell>
  );
}
