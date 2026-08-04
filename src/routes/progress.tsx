import { createFileRoute } from "@tanstack/react-router";
import { Analytics } from "@/components/magyar/analytics";
import { Achievements } from "@/components/magyar/achievements";
import { DashboardDemo } from "@/components/magyar/dashboard-demo";
import { Section } from "@/components/magyar/section";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Прогресс и аналитика обучения — MagyarFlow" },
      {
        name: "description",
        content: "Активность, точность упражнений, словарный запас и достижения ученика.",
      },
      { property: "og:title", content: "Прогресс и аналитика обучения — MagyarFlow" },
      { property: "og:description", content: "Наглядная статистика изучения венгерского языка." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <div className="aurora pt-28 sm:pt-36">
      <DashboardDemo />
      <Section eyebrow="Аналитика" title="Детальная статистика">
        <Analytics />
      </Section>
      <Section eyebrow="Достижения" title="Ваши награды">
        <Achievements />
      </Section>
    </div>
  );
}