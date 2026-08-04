import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/magyar/pricing-section";
import { Section } from "@/components/magyar/section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Тарифы — MagyarFlow" },
      {
        name: "description",
        content: "Бесплатный доступ к вводным урокам и полный курс венгерского языка.",
      },
      { property: "og:title", content: "Тарифы — MagyarFlow" },
      { property: "og:description", content: "Прозрачные тарифы платформы MagyarFlow." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="aurora pt-28 sm:pt-36">
      <Section
        eyebrow="Тарифы"
        title="Выберите формат обучения"
        description="Оплата пока не подключена — платформа работает в демонстрационном режиме."
      >
        <PricingSection />
      </Section>
    </div>
  );
}