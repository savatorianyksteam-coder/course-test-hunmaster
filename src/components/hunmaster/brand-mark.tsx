import { Link } from "@tanstack/react-router";
import { brand } from "@/data/hunmaster";
import { cn } from "@/lib/utils";

/**
 * Temporary minimalist wordmark. Replace `logoSrc` with the official HunMaster
 * logo asset when it is available — the layout slot stays identical.
 */
export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link to="/" className={cn("group flex items-baseline gap-2", className)}>
      <span className="font-display text-base font-extrabold tracking-tight">
        Hun<span className="text-gradient">Master</span>
      </span>
      {!compact && (
        <span className="text-[0.65rem] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
          Learn
        </span>
      )}
      <span className="sr-only">{brand.product}</span>
    </Link>
  );
}