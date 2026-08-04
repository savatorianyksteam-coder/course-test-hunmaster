import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Layers, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/platform";
import { Reveal } from "@/components/magyar/reveal";
import { Section } from "@/components/magyar/section";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Курсы венгерского языка — MagyarFlow" },
      {
        name: "description",
        content: "Уровни A1–B2: программы, количество уроков, длительность и прогресс обучения.",
      },
      { property: "og:title", content: "Курсы венгерского языка — MagyarFlow" },
      { property: "og:description", content: "Программа обучения венгерскому от нуля до B2." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="aurora pt-28 sm:pt-36">
      <Section
        eyebrow="Программа"
        title="Уровни обучения"
        description="Курс построен по европейской шкале: от первых слов до уверенного общения. Сейчас доступен уровень A1."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {courses.map((c, i) => (
            <Reveal key={c.code} delay={i * 80}>
              <div
                className={`card-hover glass h-full rounded-[2rem] p-7 ${
                  c.available ? "" : "opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-[image:var(--gradient-brand)] px-4 py-1.5 font-display text-sm font-bold text-primary-foreground">
                    {c.code}
                  </span>
                  {!c.available && (
                    <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
                      <Lock className="size-3" /> Скоро
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Layers className="size-4" /> {c.lessons} уроков
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="size-4" /> {c.duration}
                  </span>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Прохождение</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-[image:var(--gradient-mint)] transition-[width] duration-1000"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
                {c.available ? (
                  <Button asChild className="mt-7 rounded-full px-7">
                    <Link to="/practice">
                      Открыть курс <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="mt-7 rounded-full px-7">
                    Скоро
                  </Button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}