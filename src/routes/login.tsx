import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { BrandMark } from "@/components/hunmaster/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithUsername } from "@/services/auth.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — HunMaster Learn" },
      { name: "description", content: "Вход в закрытую учебную платформу HunMaster Learn по логину и паролю." },
      { property: "og:title", content: "Вход — HunMaster Learn" },
      { property: "og:description", content: "Войдите, чтобы продолжить обучение венгерскому." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useServerFn(loginWithUsername);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="aurora grain grid min-h-screen place-items-center px-4 py-32">
      <GlassPanel className="w-full max-w-md p-8 sm:p-10">
        <BrandMark />
        <h1 className="mt-6 font-display text-2xl font-bold">Вход</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Войдите по логину и паролю, чтобы продолжить обучение.
        </p>
        <form
          className="mt-7 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const res = await login({ data: { username, password } });
              if (!res.ok) {
                toast.error(res.message);
                return;
              }
              const { error } = await supabase.auth.setSession({
                access_token: res.access_token,
                refresh_token: res.refresh_token,
              });
              if (error) {
                toast.error("Не удалось открыть сессию");
                return;
              }
              toast.success("С возвращением!");
              navigate({ to: "/" });
            } catch {
              toast.error("Не удалось войти. Попробуйте ещё раз.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 rounded-2xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl"
              required
            />
          </div>
          <Button type="submit" disabled={busy} className="glow-edge w-full rounded-full" size="lg">
            {busy ? "Входим…" : "Войти"}
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
