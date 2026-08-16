import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Image, Lightbulb, PlayCircle, Volume2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { Button } from "@/components/ui/button";
import {
  completeLesson,
  getLessonContent,
  type LessonBlock,
  type LessonContentResult,
} from "@/services/learning.functions";

export const Route = createFileRoute("/_authenticated/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Урок — HunMaster Learn" },
      {
        name: "description",
        content: "Интерактивный урок HunMaster Learn из общей базы курсов.",
      },
      { property: "og:title", content: "Урок — HunMaster Learn" },
      { property: "og:description", content: "Теория, материалы урока и сохранение прогресса." },
    ],
  }),
  component: LessonPage,
});

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function blockTitle(block: LessonBlock) {
  return asText(block.content["title"], block.type === "heading" ? "Заголовок" : "Материал урока");
}

function blockBody(block: LessonBlock) {
  return (
    asText(block.content["body"]) ||
    asText(block.content["text"]) ||
    asText(block.content["description"])
  );
}

function vocabularyItems(block: LessonBlock) {
  const items = block.content["items"];
  if (!Array.isArray(items)) return [];
  return items.map(asRecord);
}

function RenderBlock({ block }: { block: LessonBlock }) {
  const title = blockTitle(block);
  const body = blockBody(block);

  if (block.type === "heading") {
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Раздел
        </span>
        <h2 className="mt-3 font-display text-2xl font-bold">{title}</h2>
        {body && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>}
      </div>
    );
  }

  if (block.type === "vocabulary") {
    const items = vocabularyItems(block);
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Новые слова
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
        {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
        <div className="mt-5 space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Слова для этого блока пока не добавлены.
            </p>
          )}
          {items.map((item, index) => (
            <div
              key={`${asText(item["hu"], "word")}-${index}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3"
            >
              <div>
                <span className="font-display text-sm font-semibold">
                  {asText(item["hu"], "—")}
                </span>
                {asText(item["transcription"]) && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {asText(item["transcription"])}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {asText(item["ru"]) || asText(item["translation"], "—")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "audio" || block.type === "video") {
    const url = asText(block.content["url"]) || asText(block.content["src"]);
    const Icon = block.type === "audio" ? Volume2 : PlayCircle;
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {block.type === "audio" ? "Аудио" : "Видео"}
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
        {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
        {url ? (
          <Button asChild variant="outline" className="mt-5 rounded-full">
            <a href={url} target="_blank" rel="noreferrer">
              <Icon className="mr-1 size-4" /> Открыть материал
            </a>
          </Button>
        ) : (
          <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" /> Медиафайл пока не
            добавлен.
          </p>
        )}
      </div>
    );
  }

  if (block.type === "image") {
    const url = asText(block.content["url"]) || asText(block.content["src"]);
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          Изображение
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
        {url ? (
          <img
            src={url}
            alt={title}
            className="mt-5 max-h-[420px] w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="mt-5 grid min-h-48 place-items-center rounded-2xl border border-dashed border-border text-muted-foreground">
            <Image className="size-8" />
          </div>
        )}
        {body && <p className="mt-4 text-sm text-muted-foreground">{body}</p>}
      </div>
    );
  }

  if (block.type === "exercise" || block.type === "quiz") {
    const options = block.content["options"];
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {block.type === "quiz" ? "Тест" : "Практика"}
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">
          {asText(block.content["prompt"], title)}
        </h2>
        {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
        {Array.isArray(options) && options.length > 0 ? (
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {options.map((option, index) => (
              <button
                key={`${String(option)}-${index}`}
                className="rounded-2xl border border-border/60 bg-secondary/25 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary/35"
              >
                {String(option)}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Задание пока не содержит вариантов ответа.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Теория</span>
      <h2 className="mt-3 font-display text-xl font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {body || "Содержимое блока пока не добавлено."}
      </p>
    </div>
  );
}

function LessonPage() {
  const { lessonId } = Route.useParams();
  const fetchLesson = useServerFn(getLessonContent);
  const saveProgress = useServerFn(completeLesson);
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);

  const lessonQuery = useQuery({
    queryKey: ["lesson-content", lessonId],
    queryFn: () => fetchLesson({ data: { lessonId } }),
  });

  const result = lessonQuery.data as LessonContentResult | undefined;
  const allowed = result?.allowed ? result : null;
  const blocks = allowed?.blocks ?? [];
  const total = blocks.length;
  const step = blocks[index] ?? null;

  const progressMutation = useMutation({
    mutationFn: (payload: { progress: number; completed: boolean }) =>
      saveProgress({ data: { lessonId, ...payload } }),
    onSuccess: async (response) => {
      if (!response.ok) {
        toast.error("Не удалось сохранить прогресс");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["learning-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["lesson-content", lessonId] });
      await queryClient.invalidateQueries({ queryKey: ["course-detail"] });
      if (response.completed) toast.success("Урок завершён");
    },
    onError: () => toast.error("Не удалось сохранить прогресс"),
  });

  const next = () => {
    if (!total) return;
    const isLast = index >= total - 1;
    const progress = isLast ? 100 : Math.round(((index + 1) / total) * 100);
    progressMutation.mutate({ progress, completed: isLast });
    if (!isLast) setIndex(index + 1);
  };

  return (
    <div className="aurora grain min-h-screen px-4 pt-28 pb-20 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <AccessGate>
          {lessonQuery.isPending && (
            <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
              Загружаем урок…
            </GlassPanel>
          )}

          {lessonQuery.isError && (
            <GlassPanel className="p-8 text-center text-sm text-muted-foreground">
              Не удалось загрузить урок. Попробуйте обновить страницу.
            </GlassPanel>
          )}

          {result && !result.allowed && (
            <GlassPanel className="p-8 text-center sm:p-12">
              <h1 className="font-display text-2xl font-bold">Урок недоступен</h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Открывать уроки можно только при активном доступе к курсу.
              </p>
            </GlassPanel>
          )}

          {allowed && (
            <>
              <div className="flex items-center justify-between gap-4">
                <Link
                  to="/courses/$courseId"
                  params={{ courseId: allowed.course.id }}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-4" /> К курсу
                </Link>
                <span className="text-sm text-muted-foreground">
                  {total ? index + 1 : 0} / {total}
                </span>
              </div>

              <div className="mt-4">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">
                  Урок {allowed.lesson.position + 1}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{allowed.lesson.title}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="bar-fill h-full rounded-full bg-[image:var(--gradient-brand)]"
                    style={{ width: `${total ? ((index + 1) / total) * 100 : allowed.progress}%` }}
                  />
                </div>
              </div>

              {total === 0 && (
                <GlassPanel className="mt-7 p-8 text-center">
                  <h2 className="font-display text-xl font-bold">Урок пока пуст</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Когда команда HunMaster добавит lesson blocks в Admin Panel, они появятся здесь.
                  </p>
                </GlassPanel>
              )}

              {step && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassPanel className="mt-7 p-6 sm:p-8">
                      <RenderBlock block={step} />
                      <div className="mt-7 flex justify-end gap-3">
                        <Button
                          onClick={next}
                          disabled={progressMutation.isPending || allowed.completed}
                          className="rounded-full px-7"
                        >
                          {index === total - 1 ? "Завершить урок" : "Дальше"}
                          {index === total - 1 ? (
                            <Check className="ml-1 size-4" />
                          ) : (
                            <ArrowRight className="ml-1 size-4" />
                          )}
                        </Button>
                      </div>
                    </GlassPanel>
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}
        </AccessGate>
      </div>
    </div>
  );
}
