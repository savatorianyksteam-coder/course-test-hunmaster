import { Link } from "@tanstack/react-router";
import { Instagram, Send, Youtube } from "lucide-react";
import { platform } from "@/data/platform";

const columns = [
  {
    title: "Обучение",
    links: [
      { label: "Курсы", to: "/courses" },
      { label: "Практика", to: "/practice" },
      { label: "Прогресс", to: "/progress" },
    ],
  },
  {
    title: "Платформа",
    links: [
      { label: "О платформе", to: "/" },
      { label: "Тарифы", to: "/pricing" },
      { label: "Поддержка", to: "/profile" },
    ],
  },
  {
    title: "Документы",
    links: [
      { label: "Политика конфиденциальности", to: "/" },
      { label: "Пользовательское соглашение", to: "/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] font-display text-sm font-bold text-primary-foreground">
              M
            </span>
            <span className="font-display text-base font-semibold">{platform.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {platform.tagline}. Интерактивная платформа с уроками, практикой и понятной
            аналитикой прогресса.
          </p>
          <div className="mt-5 flex gap-2">
            {[Send, Instagram, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-muted-foreground">
        © 2026 {platform.name}. Демонстрационная версия платформы.
      </p>
    </footer>
  );
}