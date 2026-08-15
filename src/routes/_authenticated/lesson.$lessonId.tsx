import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Volume2, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentLesson, lessonSteps } from "@/data/hunmaster";

export const Route = createFileRoute("/_authenticated/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Урок 12 — Знакомство и рассказ о себе | HunMaster Learn" },
      {
        name: "description",
        content: "Интерактивный урок венгерского: теория, новые слова, аудирование и практика.",
      },
      { property: "og:title", content: "Урок 12 — Знакомство и рассказ о себе" },
      { property: "og:description", content: "Демонстрационный интерактивный урок HunMaster Learn." },
    ],
  }),
  component: LessonPage,
});

type Status = "idle" | "correct" | "wrong";

function LessonPage() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [built, setBuilt] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const step = lessonSteps[index]!;
  const total = lessonSteps.length;
  const isInfo = step.kind === "theory" || step.kind === "word";

  const reset = () => {
    setChoice(null);
    setText("");
    setBuilt([]);
    setStatus("idle");
  };

  const next = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      reset();
    }
  };

  const check = () => {
    let ok = false;
    if (step.kind === "choice" || step.kind === "listen") ok = choice === step.correct;
    if (step.kind === "input") ok = step.answers.includes(text.trim().toLowerCase());
    if (step.kind === "build") ok = built.join(" ") === step.correct.join(" ");
    setStatus(ok ? "correct" : "wrong");
  };

  const canCheck =
    (step.kind === "choice" || step.kind === "listen") ? choice !== null
    : step.kind === "input" ? text.trim().length > 0
    : step.kind === "build" ? built.length === step.tokens.length
    : false;

  return (
    <div className="aurora grain min-h-screen px-4 pt-28 pb-20 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <AccessGate>
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/courses/$courseId"
              params={{ courseId: currentLesson.courseId }}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> К курсу
            </Link>
            <span className="text-sm text-muted-foreground">
              {index + 1} / {total}
            </span>
          </div>

          <div className="mt-4">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              Урок {currentLesson.number}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{currentLesson.title}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="bar-fill h-full rounded-full bg-[image:var(--gradient-brand)]"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassPanel
                className={`mt-7 p-6 sm:p-8 ${
                  status === "correct" ? "animate-correct" : status === "wrong" ? "animate-wrong" : ""
                }`}
              >
                {step.kind === "theory" && (
                  <div>
                    <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Теория
                    </span>
                    <h2 className="mt-3 font-display text-xl font-bold">{step.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    <div className="mt-5 space-y-2">
                      {step.examples.map((e) => (
                        <div
                          key={e.hu}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3"
                        >
                          <span className="font-display text-sm font-semibold">{e.hu}</span>
                          <span className="text-sm text-muted-foreground">{e.ru}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step.kind === "word" && (
                  <div className="text-center">
                    <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Новое слово
                    </span>
                    <div className="mt-4 font-display text-4xl font-extrabold">{step.hu}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{step.transcription}</div>
                    <div className="mt-4 text-lg">{step.ru}</div>
                    <Button variant="outline" className="mt-5 rounded-full">
                      <Volume2 className="mr-1 size-4" /> Прослушать
                    </Button>
                    <p className="mx-auto mt-5 flex max-w-sm items-start gap-2 text-left text-xs text-muted-foreground">
                      <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" /> {step.hint}
                    </p>
                  </div>
                )}

                {(step.kind === "choice" || step.kind === "listen") && (
                  <div>
                    <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      {step.kind === "listen" ? "Аудирование" : "Выбор ответа"}
                    </span>
                    <h2 className="mt-3 font-display text-xl font-bold">{step.prompt}</h2>
                    {step.kind === "listen" && (
                      <Button variant="outline" className="mt-4 rounded-full">
                        <Volume2 className="mr-1 size-4" /> Воспроизвести
                      </Button>
                    )}
                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {step.options.map((o, i) => {
                        const selected = choice === i;
                        const revealed = status !== "idle";
                        const correct = i === step.correct;
                        return (
                          <button
                            key={o}
                            disabled={revealed}
                            onClick={() => setChoice(i)}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                              revealed && correct
                                ? "border-accent/60 bg-accent/12"
                                : revealed && selected
                                  ? "border-destructive/60 bg-destructive/12"
                                  : selected
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-border/60 bg-secondary/25 hover:border-primary/35"
                            }`}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step.kind === "input" && (
                  <div>
                    <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Ввод перевода
                    </span>
                    <h2 className="mt-3 font-display text-xl font-bold">{step.prompt}</h2>
                    <div className="mt-4 font-display text-3xl font-extrabold">{step.hu}</div>
                    <Input
                      value={text}
                      disabled={status !== "idle"}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Ваш ответ"
                      className="mt-5 h-12 rounded-2xl"
                    />
                  </div>
                )}

                {step.kind === "build" && (
                  <div>
                    <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Составление предложения
                    </span>
                    <h2 className="mt-3 font-display text-xl font-bold">{step.prompt}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{step.ru}</p>
                    <div className="mt-5 flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-3">
                      {built.map((t, i) => (
                        <button
                          key={`${t}-${i}`}
                          onClick={() => setBuilt(built.filter((_, j) => j !== i))}
                          className="rounded-xl bg-primary/12 px-3 py-1.5 text-sm font-medium text-primary"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {step.tokens
                        .filter((t) => !built.includes(t))
                        .map((t) => (
                          <button
                            key={t}
                            onClick={() => setBuilt([...built, t])}
                            className="rounded-xl border border-border/60 bg-secondary/30 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40"
                          >
                            {t}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {status !== "idle" && (
                  <div
                    className={`mt-6 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
                      status === "correct"
                        ? "bg-accent/12 text-accent"
                        : "bg-destructive/12 text-destructive"
                    }`}
                  >
                    {status === "correct" ? <Check className="size-4" /> : <X className="size-4" />}
                    {status === "correct" ? "Верно!" : "Попробуйте ещё раз в следующий раз"}
                  </div>
                )}

                <div className="mt-7 flex justify-end gap-3">
                  {isInfo || status !== "idle" ? (
                    <Button
                      onClick={next}
                      disabled={index === total - 1}
                      className="rounded-full px-7"
                    >
                      {index === total - 1 ? "Урок завершён" : "Дальше"}
                      <ArrowRight className="ml-1 size-4" />
                    </Button>
                  ) : (
                    <Button onClick={check} disabled={!canCheck} className="rounded-full px-7">
                      Проверить
                    </Button>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </AnimatePresence>
        </AccessGate>
      </div>
    </div>
  );
}