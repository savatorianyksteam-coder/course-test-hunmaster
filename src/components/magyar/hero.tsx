import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { heroWords, platform, demoUser } from "@/data/platform";
import { WeeklyActivityChart } from "./activity-chart";

export function Hero() {
  const [offset, setOffset] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = window.setInterval(() => setActive((a) => (a + 1) % heroWords.length), 2600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(id);
    };
  }, []);

  return (
    <section className="aurora relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-40 lg:pb-28">
      <div
        className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-[image:var(--gradient-brand)] opacity-20 blur-3xl"
        style={{ transform: `translateY(${offset * 0.12}px)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-52 -left-32 size-[30rem] rounded-full bg-[image:var(--gradient-mint)] opacity-15 blur-3xl"
        style={{ transform: `translateY(${offset * -0.08}px)` }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {platform.tagline}
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
            Заговори на <span className="text-gradient">венгерском</span> уверенно
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {platform.heroSubtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="glow-edge rounded-full px-7">
              <Link to="/practice">
                Начать бесплатно <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/courses">Посмотреть программу</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { value: "60+", label: "уроков уровня A1" },
              { value: "2 400", label: "слов и выражений" },
              { value: "15 мин", label: "в день достаточно" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="glass animate-float rounded-[2rem] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Текущий уровень</div>
                <div className="font-display text-2xl font-bold">{demoUser.level}</div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-medium text-primary">
                <Flame className="size-3.5" /> {demoUser.streak} дней подряд
              </div>
            </div>

            <div className="mt-5 grid gap-2.5">
              {heroWords.map((w, i) => (
                <div
                  key={w.hu}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500 ${
                    active === i
                      ? "border-primary/45 bg-primary/10 translate-x-1"
                      : "border-border/60 bg-secondary/40"
                  }`}
                >
                  <span className="font-display text-sm font-semibold">{w.hu}</span>
                  <span className="text-sm text-muted-foreground">{w.ru}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-border/60 bg-secondary/30 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Изучено слов</span>
                <span className="font-display text-lg font-bold">{demoUser.wordsLearned}</span>
              </div>
              <div className="-mx-2 mt-2">
                <WeeklyActivityChart height={120} />
              </div>
            </div>
          </div>

          <div
            className="glass absolute -bottom-6 -left-4 hidden rounded-2xl px-4 py-3 sm:block"
            style={{ transform: `translateY(${offset * -0.05}px)` }}
          >
            <div className="text-xs text-muted-foreground">Прогресс курса</div>
            <div className="font-display text-xl font-bold">{demoUser.courseProgress}%</div>
          </div>
        </div>
      </div>
    </section>
  );
}