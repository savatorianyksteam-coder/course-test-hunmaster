import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { BrandMark } from "@/components/hunmaster/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/mock-auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — HunMaster Learn" },
      { name: "description", content: "Демонстрационная регистрация в платформе HunMaster Learn." },
      { property: "og:title", content: "Регистрация — HunMaster Learn" },
      { property: "og:description", content: "Создайте демо-аккаунт и начните обучение." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "Александр",
    email: "alexander@example.com",
    telegram: "@alexander",
    password: "",
    repeat: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="aurora grain grid min-h-screen place-items-center px-4 py-32">
      <GlassPanel className="w-full max-w-md p-8 sm:p-10">
        <BrandMark />
        <h1 className="mt-6 font-display text-2xl font-bold">Создать аккаунт</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Демо-режим: данные никуда не отправляются.
        </p>
        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (form.password !== form.repeat) {
              toast.error("Пароли не совпадают");
              return;
            }
            signIn({ name: form.name, email: form.email, telegram: form.telegram });
            toast.success("Демо-аккаунт создан");
            navigate({ to: "/" });
          }}
        >
          {[
            { id: "name", label: "Имя", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "telegram", label: "Telegram", type: "text" },
            { id: "password", label: "Пароль", type: "password" },
            { id: "repeat", label: "Повторить пароль", type: "password" },
          ].map((f) => (
            <div key={f.id} className="space-y-2">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                type={f.type}
                value={form[f.id as keyof typeof form]}
                onChange={set(f.id as keyof typeof form)}
                className="h-12 rounded-2xl"
                required
              />
            </div>
          ))}
          <Button type="submit" className="glow-edge w-full rounded-full" size="lg">
            Создать аккаунт
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            Войти
          </Link>
        </p>
      </GlassPanel>
    </div>
  );
}