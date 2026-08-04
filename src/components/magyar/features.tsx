import { features } from "@/data/platform";
import { Reveal } from "./reveal";
import { Section } from "./section";

const accentClass = {
  red: "text-brand-red",
  green: "text-brand-green",
  gold: "text-brand-gold",
} as const;

export function Features() {
  return (
    <Section
      eyebrow="Возможности"
      title="Всё, что нужно для системного изучения"
      description="Каждый элемент платформы помогает превратить занятия в привычку и видеть реальный результат."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <div className="card-hover group glass h-full rounded-[1.75rem] p-6">
              <div className="grid size-12 place-items-center rounded-2xl border border-border/60 bg-secondary/50 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                <f.icon className={`size-5 ${accentClass[f.accent]}`} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              <div className="mt-5 h-px w-full origin-left scale-x-0 bg-[image:var(--gradient-brand)] transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}