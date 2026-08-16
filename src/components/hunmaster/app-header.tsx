import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Moon, Settings, Sun, User, X } from "lucide-react";
import { useState } from "react";
import { navItems, notifications } from "@/data/hunmaster";
import { useAuth } from "@/hooks/useAuth";
import { useSignOut } from "@/hooks/useSignOut";
import { useTheme } from "@/components/hunmaster/theme-provider";
import { BrandMark } from "./brand-mark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { theme, toggle } = useTheme();
  const { profile, isAuthenticated } = useAuth();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav className="liquid-glass mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <BrandMark />

        {isAuthenticated && (
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
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Переключить тему"
            className="grid size-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Уведомления"
                    className="relative grid size-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Bell className="size-4" />
                    <span className="absolute top-1.5 right-2 size-2 rounded-full bg-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-2xl">
                  <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((n) => (
                    <div key={n.title} className="px-2 py-2">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold">{n.title}</span>
                        <span className="text-[0.7rem] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.text}</p>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Профиль"
                    className="flex items-center gap-2 rounded-full border border-border/70 py-1 pr-3 pl-1 transition-colors hover:bg-secondary/60"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-[image:var(--gradient-brand)] font-display text-xs font-bold text-primary-foreground">
                      {(profile?.full_name ?? profile?.email ?? "?").slice(0, 1)}
                    </span>
                    <span className="hidden text-sm font-medium sm:inline">
                      {profile?.full_name ?? profile?.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {profile ? `@${profile.username}` : ""}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                    <User className="mr-2 size-4" /> Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                    <Settings className="mr-2 size-4" /> Настройки
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void signOut()}>
                    <LogOut className="mr-2 size-4" /> Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className="grid size-9 place-items-center rounded-full border border-border/70 lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Меню"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </>
          ) : (
            <Button asChild className="rounded-full">
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </div>
      </nav>

      {open && isAuthenticated && (
        <div className="liquid-glass mx-auto mt-2 max-w-7xl p-3 lg:hidden">
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
          </div>
        </div>
      )}
    </header>
  );
}
