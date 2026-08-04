import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { navItems, platform } from "@/data/platform";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-[1.75rem] px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] font-display text-sm font-bold text-primary-foreground">
            M
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            {platform.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary/70" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Переключить тему"
            className="grid size-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Button
            variant="ghost"
            className="hidden rounded-full sm:inline-flex"
            onClick={() => toast("Вход появится позже", { description: "Демонстрационный режим" })}
          >
            Войти
          </Button>
          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link to="/courses">Начать обучение</Link>
          </Button>
          <button
            className="grid size-9 place-items-center rounded-full border border-border/70 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-7xl rounded-3xl p-3 lg:hidden">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2 rounded-2xl">
              <Link to="/courses" onClick={() => setOpen(false)}>
                Начать обучение
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}