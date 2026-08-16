import { createFileRoute } from "@tanstack/react-router";
import { Search, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AccessGate } from "@/components/hunmaster/access-gate";
import { GlassPanel } from "@/components/hunmaster/glass-panel";
import { PageShell, Stagger, StaggerItem } from "@/components/hunmaster/page-shell";
import { Input } from "@/components/ui/input";
import { dictionary, dictionaryCategories } from "@/data/hunmaster";

export const Route = createFileRoute("/_authenticated/dictionary")({
  head: () => ({
    meta: [
      { title: "Словарь венгерских слов — HunMaster Learn" },
      {
        name: "description",
        content: "Личный словарь: венгерские слова с переводом, транскрипцией и статусом изучения.",
      },
      { property: "og:title", content: "Словарь венгерских слов — HunMaster Learn" },
      { property: "og:description", content: "Поиск, фильтры и статус изучения каждого слова." },
    ],
  }),
  component: DictionaryPage,
});

const statusLabel = {
  learned: { text: "Изучено", cls: "bg-accent/12 text-accent" },
  learning: { text: "В процессе", cls: "bg-primary/12 text-primary" },
  new: { text: "Новое", cls: "bg-secondary text-muted-foreground" },
};

function DictionaryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Все");

  const items = useMemo(
    () =>
      dictionary.filter(
        (d) =>
          (cat === "Все" || d.category === cat) &&
          (d.hu.toLowerCase().includes(q.toLowerCase()) ||
            d.ru.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <PageShell
      eyebrow="Лексика"
      title="Словарь"
      description="Слова, которые встречались в уроках, с переводом и статусом изучения."
    >
      <AccessGate>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск слова"
              className="h-12 rounded-2xl pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {dictionaryCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  cat === c
                    ? "border-primary/50 bg-primary/12 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Stagger className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <StaggerItem key={d.hu}>
              <GlassPanel className="flex h-full items-start justify-between gap-3 p-5">
                <div>
                  <div className="font-display text-lg font-bold">{d.hu}</div>
                  <div className="text-xs text-muted-foreground">{d.transcription}</div>
                  <div className="mt-2 text-sm">{d.ru}</div>
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-[0.7rem] font-medium ${statusLabel[d.status].cls}`}
                  >
                    {statusLabel[d.status].text}
                  </span>
                </div>
                <button
                  aria-label={`Прослушать ${d.hu}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Volume2 className="size-4" />
                </button>
              </GlassPanel>
            </StaggerItem>
          ))}
        </Stagger>
        {items.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">Ничего не найдено.</p>
        )}
      </AccessGate>
    </PageShell>
  );
}
