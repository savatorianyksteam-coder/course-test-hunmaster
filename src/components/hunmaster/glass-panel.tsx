import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Liquid-glass surface: backdrop blur + inner highlight + cursor-reactive
 * reflection and a very light 3D tilt.
 */
export function GlassPanel({
  children,
  className,
  tilt = true,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<Record<string, string>>({});

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = tilt ? ((y / r.height - 0.5) * -3).toFixed(2) : "0";
    const ry = tilt ? ((x / r.width - 0.5) * 3).toFixed(2) : "0";
    setStyle({
      "--mx": `${x}px`,
      "--my": `${y}px`,
      "--glare": "1",
      transform: `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`,
    });
  };

  const onLeave = () => setStyle({ "--glare": "0", transform: "none" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style as React.CSSProperties}
      className={cn("liquid-glass", className)}
    >
      {children}
    </div>
  );
}
