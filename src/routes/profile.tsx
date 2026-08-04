import { createFileRoute } from "@tanstack/react-router";
import { Bell, Moon, Pencil, Sun, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoUser } from "@/data/platform";
import { Section } from "@/components/magyar/section";
import { Reveal } from "@/components/magyar/reveal";
import { useTheme } from "@/components/magyar/theme-provider";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Личный кабинет — MagyarFlow" },
      {
        name: "description",
        content: "Профиль ученика: ежедневная цель, напоминания, тема оформления и уведомления.",
      },
      { property: "og:title", content: "Личный кабинет — MagyarFlow" },
      { property: "og:description", content: "Настройки профиля и обучения в MagyarFlow." },
    ],
  }),
  component: ProfilePage,
});

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-5 py-4">
      <div>
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
      <div className="min-w-[180px] shrink-0">{children}</div>
    </div>
  );
}

function ProfilePage() {
  const { theme, toggle } = useTheme();
  const [goal, setGoal] = useState([20]);
  const [sound, setSound] = useState(true);
  const [notify, setNotify] = useState(true);

  return (
    <div className="aurora pt-28 sm:pt-36">
      <Section eyebrow="Профиль" title="Личный кабинет">
        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <Reveal>
            <div className="glass h-full rounded-[2rem] p-7 text-center">
              <div className="mx-auto grid size-24 place-items-center rounded-full bg-[image:var(--gradient-brand)] font-display text-3xl font-bold text-primary-foreground">
                А
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">{demoUser.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Уровень {demoUser.level}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Обучение начато {demoUser.startedAt}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { v: demoUser.streak, l: "серия" },
                  { v: demoUser.wordsLearned, l: "слов" },
                  { v: demoUser.lessonsDone, l: "уроков" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-border/60 bg-secondary/30 p-3">
                    <div className="font-display text-lg font-bold">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-full"
                onClick={() => toast("Редактирование появится позже")}
              >
                <Pencil className="mr-1 size-4" /> Изменить профиль
              </Button>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="glass h-full rounded-[2rem] p-7">
              <h3 className="font-display text-lg font-semibold">Настройки обучения</h3>
              <div className="mt-5 grid gap-3">
                <Row title="Ежедневная цель" description={`${goal[0]} минут в день`}>
                  <Slider value={goal} onValueChange={setGoal} min={5} max={60} step={5} />
                </Row>
                <Row title="Время напоминаний" description="Когда присылать уведомление">
                  <Select defaultValue="19">
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["08", "12", "15", "19", "21"].map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Row>
                <Row title="Тема оформления" description="Светлая или тёмная">
                  <div className="flex items-center justify-end gap-3">
                    <Sun className="size-4 text-muted-foreground" />
                    <Switch checked={theme === "dark"} onCheckedChange={toggle} />
                    <Moon className="size-4 text-muted-foreground" />
                  </div>
                </Row>
                <Row title="Звуки в уроках" description="Произношение и эффекты">
                  <div className="flex items-center justify-end gap-3">
                    <Volume2 className="size-4 text-muted-foreground" />
                    <Switch checked={sound} onCheckedChange={setSound} />
                  </div>
                </Row>
                <Row title="Уведомления" description="Напоминания о занятиях">
                  <div className="flex items-center justify-end gap-3">
                    <Bell className="size-4 text-muted-foreground" />
                    <Switch checked={notify} onCheckedChange={setNotify} />
                  </div>
                </Row>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                Настройки сохраняются только визуально — это демонстрационная версия.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}