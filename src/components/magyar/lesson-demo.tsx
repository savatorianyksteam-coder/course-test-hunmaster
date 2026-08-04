import { ArrowRight, Check, Volume2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { currentLesson, lessonQuestion, lessonStages } from "@/data/platform";

export function LessonDemo() {
  const [stage, setStage] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState(currentLesson.progress);

  const isCorrect = selected === lessonQuestion.correct;

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <aside className="glass h-max rounded-[1.75rem] p-5">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Этапы урока
        </div>
        <ul className="mt-4 space-y-1.5">
          {lessonStages.map((s, i) => (
            <li key={s}>
              <button
                onClick={() => setStage(i)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors ${
                  stage === i
                    ? "bg-primary/12 font-medium text-primary"
                    : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                <span className="grid size-6 place-items-center rounded-full bg-secondary text-xs">
                  {i + 1}
                </span>
                {s}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentLesson.title}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl font-bold sm:text-2xl">{lessonQuestion.prompt}</h3>
            <button
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Прослушать"
            >
              <Volume2 className="size-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {lessonQuestion.options.map((opt, i) => {
              const state =
                checked && i === lessonQuestion.correct
                  ? "border-accent bg-accent/12 text-foreground"
                  : checked && i === selected
                    ? "border-destructive bg-destructive/12"
                    : selected === i
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-secondary/30 hover:border-primary/40";
              return (
                <button
                  key={opt}
                  disabled={checked}
                  onClick={() => setSelected(i)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition-all duration-300 ${state}`}
                >
                  {opt}
                  {checked && i === lessonQuestion.correct && <Check className="size-4 text-accent" />}
                  {checked && i === selected && i !== lessonQuestion.correct && (
                    <X className="size-4 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {checked && (
            <p
              className={`animate-rise mt-5 text-sm ${isCorrect ? "text-accent" : "text-destructive"}`}
            >
              {isCorrect
                ? "Верно! «Köszönöm» означает «Спасибо»."
                : "Не совсем. «Köszönöm» переводится как «Спасибо»."}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              className="rounded-full px-7"
              disabled={selected === null || checked}
              onClick={() => setChecked(true)}
            >
              Проверить ответ
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-7"
              disabled={!checked}
              onClick={() => {
                setChecked(false);
                setSelected(null);
                setProgress((p) => Math.min(100, p + 10));
                setStage((s) => Math.min(lessonStages.length - 1, s + 1));
              }}
            >
              Следующее задание <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}