import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { brand, navItems } from "@/data/hunmaster";
import { BrandMark } from "./brand-mark";

export function AppFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div>
          <BrandMark />
          <p className="mt-2 max-w-sm text-xs text-muted-foreground">
            Закрытая платформа для изучения венгерского языка. Демонстрационная версия — данные
            учебные.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} className="transition-colors hover:text-foreground">
              {n.label}
            </Link>
          ))}
          <a
            href={brand.telegram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Send className="size-3.5" /> Поддержка
          </a>
        </div>
      </div>
    </footer>
  );
}
