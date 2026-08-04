import { Link } from "@tanstack/react-router";
import { Lock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentLesson, upcomingLessons } from "@/data/platform";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function ContinueLearning() {
  return (
    <Section
      eyebrow="Продолжить обучение"
      title="Вы остановились на знакомстве"
      description="Вернитесь к текущему уроку или выберите следующую тему программы."
    >
      <Reveal>
        <div className="glass card-hover grid gap-6 rounded-[2rem] p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="text-xs font-semibold tracking-wider text-accent uppercase">
              Текущий урок
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold">{currentLesson.title}</h3>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{currentLesson.duration}</span>
              <span>•</span>
              <span>{currentLesson.tasks} заданий</span>
              <span>•</span>
              <span>выполнено {currentLesson.progress}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-1000"
                style={{ width: `${currentLesson.progress}%` }}
              />
            </div>
            <Button asChild size="lg" className="mt-6 rounded-full px-7">
              <Link to="/practice">
                <PlayCircle className="mr-1 size-4" /> Продолжить урок
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
            <div className="font-display text-sm font-semibold">Этапы урока</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Теория", "Новые слова", "Аудирование", "Практика", "Итоговый тест"].map(
                (stage, i) => (
                  <li key={stage} className="flex items-center gap-3">
                    <span
                      className={`grid size-6 place-items-center rounded-full text-xs ${
                        i < 2 ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {stage}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {upcomingLessons.map((l, i) => (
          <Reveal key={l.title} delay={i * 55}>
            <div
              className={`card-hover glass relative h-full rounded-[1.5rem] p-5 ${
                l.locked ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.locked && <Lock className="size-4 text-muted-foreground" />}
              </div>
              <h4 className="mt-4 font-display text-lg font-semibold">{l.title}</h4>
              <p className="text-sm text-muted-foreground italic">{l.hu}</p>
              <p className="mt-4 text-xs text-muted-foreground">{l.tasks} заданий</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}