import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Flame, Layers, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { currentLesson } from "@/data/hunmaster";
import { useAuth } from "@/hooks/useAuth";
import { useLearningStats } from "@/hooks/useLearningStats";
import { AnimatedCounter } from "./animated-counter";
import { GlassPanel } from "./glass-panel";
import { MagneticButton } from "./magnetic-button";
import { WeeklyActivityChart } from "./charts";

export function LearningHero() {
  const { profile } = useAuth();
  const { data } = useLearningStats();
  const learningStats = {
    courseProgress: data?.courseProgress ?? 0,
    wordsLearned: data?.wordsLearned ?? 0,
    lessonsDone: data?.lessonsCompleted ?? 0,
    lessonsTotal: data?.lessonsTotal ?? 0,
    streak: data?.streak ?? 0,
  };
  const [offset, setOffset] = useState(0);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = window.setTimeout(() => setFill(learningStats.courseProgress), 250);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, [learningStats.courseProgress]);

  const stats = [
    { icon: Target, label: "Уровень", value: "A1" },
    { icon: Flame, label: "Серия", value: `${learningStats.streak} дней` },
    { icon: BookOpen, label: "Изучено слов", value: learningStats.wordsLearned },
    {
      icon: Layers,
      label: "Пройдено уроков",
      value: `${learningStats.lessonsDone} / ${learningStats.lessonsTotal}`,
    },
  ];

  return (
    <section className="aurora grain relative overflow-hidden px-4 pt-28 pb-14 sm:px-6 sm:pt-36 lg:pb-20">
      <div
        className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-[image:var(--gradient-brand)] opacity-20 blur-3xl"
        style={{ transform: `translateY(${offset * 0.12}px)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-52 -left-32 size-[30rem] rounded-full bg-[image:var(--gradient-mint)] opacity-15 blur-3xl"
        style={{ transform: `translateY(${offset * -0.08}px)` }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            HunMaster Learn · закрытая платформа
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-6xl">
            С возвращением, <span className="text-gradient">{profile?.name ?? "ученик"}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Продолжим изучать венгерский?
          </p>

          <div className="mt-8">
            <MagneticButton asChild size="lg" className="glow-edge rounded-full px-8">
              <Link to="/lesson/$lessonId" params={{ lessonId: currentLesson.id }}>
                Продолжить обучение <ArrowRight className="ml-1 size-4" />
              </Link>
            </MagneticButton>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{currentLesson.courseTitle}</span>
            <span className="opacity-40">/</span>
            <span>{currentLesson.module}</span>
            <span className="opacity-40">/</span>
            <span>
              Урок {currentLesson.number} — {currentLesson.title}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassPanel className="p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Learning overview</div>
                <div className="font-display text-2xl font-bold">Венгерский A1</div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-medium text-primary">
                <Flame className="size-3.5" /> {learningStats.streak} дней подряд
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span>Прогресс курса</span>
                <span className="font-display text-lg font-bold text-foreground">
                  <AnimatedCounter value={learningStats.courseProgress} suffix="%" />
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="bar-fill h-full rounded-full bg-[image:var(--gradient-brand)]"
                  style={{ width: `${fill}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border/60 bg-secondary/35 px-4 py-3"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <s.icon className="size-3.5 text-primary" /> {s.label}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-border/60 bg-secondary/25 p-4">
              <div className="text-xs text-muted-foreground">Активность за неделю</div>
              <div className="-mx-2 mt-1">
                <WeeklyActivityChart height={130} data={data?.weeklyActivity} />
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}