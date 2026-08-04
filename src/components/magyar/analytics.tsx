import { activityCalendar, demoUser, sectionProgress } from "@/data/platform";
import { AccuracyChart, WeeklyActivityChart, WordsChart } from "./activity-chart";
import { Reveal } from "./reveal";

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="glass card-hover h-full rounded-[1.75rem] p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Analytics() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Reveal className="lg:col-span-2">
        <Panel title="Активность за последние 7 дней" subtitle="минуты">
          <WeeklyActivityChart height={230} />
        </Panel>
      </Reveal>
      <Reveal delay={80}>
        <Panel title="Точность упражнений" subtitle="за месяц">
          <AccuracyChart />
        </Panel>
      </Reveal>
      <Reveal delay={120}>
        <Panel title="Выучено слов по неделям">
          <WordsChart />
        </Panel>
      </Reveal>
      <Reveal delay={160}>
        <Panel title="Прогресс по разделам">
          <ul className="space-y-4">
            {sectionProgress.map((s) => (
              <li key={s.section}>
                <div className="flex justify-between text-sm">
                  <span>{s.section}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-1000"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </Reveal>
      <Reveal delay={200}>
        <Panel title="Время обучения" subtitle="всего">
          <div className="font-display text-4xl font-bold">{demoUser.hoursLearned} ч</div>
          <p className="mt-2 text-sm text-muted-foreground">
            В среднем 24 минуты в день за последние две недели.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { v: `${demoUser.streak}`, l: "серия" },
              { v: `${demoUser.lessonsDone}`, l: "уроков" },
              { v: `${demoUser.wordsLearned}`, l: "слов" },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl border border-border/60 bg-secondary/30 p-3">
                <div className="font-display text-lg font-bold">{x.v}</div>
                <div className="text-xs text-muted-foreground">{x.l}</div>
              </div>
            ))}
          </div>
        </Panel>
      </Reveal>
      <Reveal delay={240} className="lg:col-span-3">
        <Panel title="Календарь активности" subtitle="последние 13 недель">
          <div className="flex flex-wrap gap-1.5">
            {activityCalendar.map((d) => (
              <span
                key={d.day}
                title={`Уровень активности: ${d.level}`}
                className="size-4 rounded-[6px] transition-transform hover:scale-125"
                style={{
                  background:
                    d.level === 0
                      ? "var(--secondary)"
                      : `color-mix(in oklab, var(--brand-green) ${d.level * 25}%, var(--secondary))`,
                }}
              />
            ))}
          </div>
        </Panel>
      </Reveal>
    </div>
  );
}