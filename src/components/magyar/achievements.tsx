import { Lock, Trophy } from "lucide-react";
import { achievements } from "@/data/platform";
import { Reveal } from "./reveal";

export function Achievements() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((a, i) => (
        <Reveal key={a.title} delay={i * 60}>
          <div
            className={`card-hover glass flex h-full items-center gap-4 rounded-[1.5rem] p-5 ${
              a.unlocked ? "" : "opacity-55"
            }`}
          >
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                a.unlocked
                  ? "bg-[image:var(--gradient-brand)] text-primary-foreground"
                  : "border border-border bg-secondary/50 text-muted-foreground"
              }`}
            >
              {a.unlocked ? <Trophy className="size-5" /> : <Lock className="size-4" />}
            </span>
            <div>
              <h4 className="font-display text-base font-semibold">{a.title}</h4>
              <p className="text-sm text-muted-foreground">{a.description}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}