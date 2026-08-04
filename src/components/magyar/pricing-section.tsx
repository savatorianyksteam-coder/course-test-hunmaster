import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/data/platform";
import { Reveal } from "./reveal";
import { toast } from "sonner";

export function PricingSection() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:mx-auto lg:max-w-4xl">
      {plans.map((p, i) => (
        <Reveal key={p.name} delay={i * 90}>
          <div
            className={`glass card-hover relative h-full rounded-[2rem] p-7 ${
              p.highlighted ? "glow-edge border-primary/40" : ""
            }`}
          >
            {p.highlighted && (
              <span className="absolute -top-3 right-6 rounded-full bg-[image:var(--gradient-brand)] px-3 py-1 text-xs font-semibold text-primary-foreground">
                Рекомендуем
              </span>
            )}
            <h3 className="font-display text-xl font-bold">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={p.highlighted ? "default" : "outline"}
              className="mt-8 w-full rounded-full"
              onClick={() =>
                toast("Скоро будет доступно", {
                  description: "Оплата появится в следующей версии платформы",
                })
              }
            >
              Скоро будет доступно
            </Button>
          </div>
        </Reveal>
      ))}
    </div>
  );
}