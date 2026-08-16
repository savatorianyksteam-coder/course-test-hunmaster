import { cn } from "@/lib/utils";

/** Hungarian tricolour emblem rendered as SVG (no emoji). */
export function CourseEmblem({ code, className }: { code: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border/60",
        className,
      )}
    >
      <svg viewBox="0 0 60 60" className="absolute inset-0 size-full" aria-hidden="true">
        <rect width="60" height="20" fill="var(--brand-red)" opacity="0.85" />
        <rect y="20" width="60" height="20" fill="var(--card)" />
        <rect y="40" width="60" height="20" fill="var(--brand-green)" opacity="0.85" />
      </svg>
      <span className="relative font-display text-sm font-extrabold text-foreground drop-shadow-sm">
        {code}
      </span>
    </div>
  );
}
