import { Check } from "lucide-react";
import { useState } from "react";
import { dailyGoals } from "@/data/platform";
import { Reveal } from "./reveal";

export function DailyGoal() {
  const [goals, setGoals] = useState(dailyGoals);
  const done = goals.filter((g) => g.done).length;
  const percent = Math.round((done / goals.length) * 100);

  return (
    <Reveal>
      <div className="glass h-full rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-xl font-bold">Сегодняшняя цель</h3>
          <span className="text-sm text-muted-foreground">
            {done} из {goals.length}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[image:var(--gradient-mint)] transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <ul className="mt-6 space-y-3">
          {goals.map((g, i) => (
            <li key={g.title}>
              <button
                onClick={() =>
                  setGoals((prev) =>
                    prev.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)),
                  )
                }
                className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3 text-left transition-colors hover:border-accent/50"
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors ${
                    g.done
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-transparent"
                  }`}
                >
                  <Check className="size-3.5" />
                </span>
                <span
                  className={`text-sm ${g.done ? "text-muted-foreground line-through" : ""}`}
                >
                  {g.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}