import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/magyar/hero";
import { Features } from "@/components/magyar/features";
import { DashboardDemo } from "@/components/magyar/dashboard-demo";
import { ContinueLearning } from "@/components/magyar/continue-learning";
import { Analytics } from "@/components/magyar/analytics";
import { DailyGoal } from "@/components/magyar/daily-goal";
import { Achievements } from "@/components/magyar/achievements";
import { PricingSection } from "@/components/magyar/pricing-section";
import { Section } from "@/components/magyar/section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MagyarFlow — заговори на венгерском уверенно" },
      {
        name: "description",
        content:
          "Интерактивный онлайн-курс венгерского языка: короткие уроки, практика произношения и наглядный прогресс.",
      },
      { property: "og:title", content: "MagyarFlow — заговори на венгерском уверенно" },
      {
        property: "og:description",
        content: "Интерактивный онлайн-курс венгерского языка: короткие уроки, практика произношения и наглядный прогресс.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Features />
      <DashboardDemo />
      <ContinueLearning />
      <Section
        eyebrow="Аналитика"
        title="Прогресс, который видно в цифрах"
        description="Активность, точность, словарный запас и время обучения — всё в одном разделе."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <Analytics />
          <DailyGoal />
        </div>
      </Section>
      <Section
        eyebrow="Достижения"
        title="Награды за настойчивость"
        description="Открывайте новые награды по мере обучения — от первого урока до месяца практики."
      >
        <Achievements />
      </Section>
      <Section
        eyebrow="Тарифы"
        title="Начните бесплатно"
        description="Оплата пока не подключена — это демонстрационная версия платформы."
      >
        <PricingSection />
      </Section>
    </>
  );
}
