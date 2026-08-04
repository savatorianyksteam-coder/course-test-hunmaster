import { createFileRoute } from "@tanstack/react-router";
import { LessonDemo } from "@/components/magyar/lesson-demo";
import { DailyGoal } from "@/components/magyar/daily-goal";
import { Section } from "@/components/magyar/section";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Практика — урок венгерского языка | MagyarFlow" },
      {
        name: "description",
        content: "Демонстрационный урок: теория, новые слова, аудирование, практика и тест.",
      },
      { property: "og:title", content: "Практика — урок венгерского языка | MagyarFlow" },
      { property: "og:description", content: "Интерактивный урок с заданиями и проверкой ответов." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  return (
    <div className="aurora pt-28 sm:pt-36">
      <Section
        eyebrow="Урок 12"
        title="Знакомство и рассказ о себе"
        description="Выберите вариант ответа и проверьте себя — интерфейс работает в демонстрационном режиме."
      >
        <LessonDemo />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="glass rounded-[2rem] p-7">
            <h3 className="font-display text-lg font-semibold">Новые слова урока</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Engem hívnak", "Меня зовут"],
                ["Örülök", "Приятно познакомиться"],
                ["Honnan jössz?", "Откуда ты?"],
                ["Magyarul tanulok", "Я учу венгерский"],
              ].map(([hu, ru]) => (
                <div
                  key={hu}
                  className="card-hover rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3"
                >
                  <div className="font-display text-sm font-semibold">{hu}</div>
                  <div className="text-sm text-muted-foreground">{ru}</div>
                </div>
              ))}
            </div>
          </div>
          <DailyGoal />
        </div>
      </Section>
    </div>
  );
}