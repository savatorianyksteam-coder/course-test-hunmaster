import { Clock, Flame, GraduationCap, Target } from "lucide-react";
import { demoUser } from "@/data/platform";
import { WeeklyActivityChart } from "./activity-chart";
import { ProgressRing } from "./progress-ring";
import { Reveal } from "./reveal";
import { Section } from "./section";

const stats = [
  { label: "Дней обучения", value: `${demoUser.daysLearning}`, icon: GraduationCap },
  { label: "Серия занятий", value: `${demoUser.streak} дней`, icon: Flame },
  { label: "Изучено слов", value: `${demoUser.wordsLearned}`, icon: Target },
  { label: "Время обучения", value: `${demoUser.hoursLearned} часов`, icon: Clock },
];

export function DashboardDemo() {
  return (
    <Section
      eyebrow="Личный кабинет"
      title="Ваш прогресс всегда перед глазами"
      description="Так выглядит рабочее пространство ученика: понятная статистика, цели и активность за неделю."
    >
      <Reveal>
        <div className="glass rounded-[2rem] p-5 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Добрый день,</div>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">{demoUser.name}</h3>
            </div>
            <div className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Уровень {demoUser.level}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-border/60 bg-secondary/30 p-6">
              <ProgressRing value={demoUser.courseProgress} caption="прогресс курса" />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Выполнено уроков: {demoUser.lessonsDone} из {demoUser.lessonsTotal}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="card-hover rounded-2xl border border-border/60 bg-secondary/30 p-4"
                  >
                    <s.icon className="size-4 text-primary" />
                    <div className="mt-3 font-display text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold">Активность за неделю</span>
                  <span className="text-xs text-muted-foreground">минуты занятий</span>
                </div>
                <div className="mt-3">
                  <WeeklyActivityChart height={180} />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-accent/35 bg-accent/10 p-4">
                <Target className="size-4 text-accent" />
                <span className="text-sm">
                  Ближайшая цель: <strong className="font-semibold">{demoUser.nextGoal}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}