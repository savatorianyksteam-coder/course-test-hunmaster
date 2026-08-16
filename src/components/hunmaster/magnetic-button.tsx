import { useRef, useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";

export function MagneticButton({ children, ...props }: ComponentProps<typeof Button>) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setT({
          x: (e.clientX - (r.left + r.width / 2)) * 0.18,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
        });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{
        transform: `translate(${t.x}px, ${t.y}px)`,
        transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <Button {...props}>{children}</Button>
    </div>
  );
}
