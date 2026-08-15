import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { BrandMark } from "@/components/hunmaster/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAccount } from "@/services/auth.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — HunMaster Learn" },
      { name: "description", content: "Создайте аккаунт HunMaster Learn: имя, логин и пароль." },
      { property: "og:title", content: "Регистрация — HunMaster Learn" },
      { property: "og:description", content: "Создайте аккаунт и активируйте доступ к курсу." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const register = useServerFn(registerAccount);
  const [form, setForm] = useState({ name: "", username: "", password: "", repeat: "" });
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="aurora grain grid min-h-screen place-items-center px-4 py-32">
      <GlassPanel className="w-full max-w-md p-8 sm:p-10">
        <BrandMark />
        <h1 className="mt-6 font-display text-2xl font-bold">Создать аккаунт</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          После регистрации доступ к курсу активирует команда HunMaster.
        </p>
        <form
          className="mt-7 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (form.password !== form.repeat) {
              toast.error("Пароли не совпадают");
              return;
            }
            setBusy(true);
            try {
              const res = await register({
                data: { name: form.name, username: form.username, password: form.password },
              });
              if (!res.ok) {
                toast.error(res.message);
                return;
              }
              const { error } = await supabase.auth.setSession({
                access_token: res.access_token,
                refresh_token: res.refresh_token,
              });
              if (error) {
                toast.success("Аккаунт создан — войдите с новым логином");
                navigate({ to: "/login" });
                return;
              }
              toast.success("Аккаунт создан");
              navigate({ to: "/" });
            } catch {
              toast.error("Не удалось создать аккаунт. Попробуйте ещё раз.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {[
            { id: "name", label: "Имя", type: "text", autoComplete: "name" },
            { id: "username", label: "Логин", type: "text", autoComplete: "username" },
            { id: "password", label: "Пароль", type: "password", autoComplete: "new-password" },
            { id: "repeat", label: "Повторить пароль", type: "password", autoComplete: "new-password" },
          ].map((f) => (
            <div key={f.id} className="space-y-2">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input
                id={f.id}
                type={f.type}
                autoComplete={f.autoComplete}
                value={form[f.id as keyof typeof form]}
                onChange={set(f.id as keyof typeof form)}
                className="h-12 rounded-2xl"
                required
              />
            </div>
          ))}
          <Button type="submit" disabled={busy} className="glow-edge w-full rounded-full" size="lg">
            {busy ? "Создаём…" : "Создать аккаунт"}
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
