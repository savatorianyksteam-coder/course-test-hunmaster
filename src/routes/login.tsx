import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { BrandMark } from "@/components/hunmaster/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/mock-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — HunMaster Learn" },
      { name: "description", content: "Демонстрационный вход в закрытую платформу HunMaster Learn." },
      { property: "og:title", content: "Вход — HunMaster Learn" },
      { property: "og:description", content: "Войдите, чтобы продолжить обучение венгерскому." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("alexander@example.com");
  const [password, setPassword] = useState("demo1234");

  return (
    <div className="aurora grain grid min-h-screen place-items-center px-4 py-32">
      <GlassPanel className="w-full max-w-md p-8 sm:p-10">
        <BrandMark />
        <h1 className="mt-6 font-display text-2xl font-bold">Вход</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Демо-режим: настоящая авторизация пока не подключена.
        </p>
        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            signIn({ email });
            toast.success("Демо-вход выполнен");
            navigate({ to: "/" });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-2xl" required />
          </div>
          <Button type="submit" className="glow-edge w-full rounded-full" size="lg">
            Войти
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-primary underline-offset-4 hover:underline">
            Создать
          </Link>
        </p>
      </GlassPanel>
    </div>
  );
}