import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("px-4 py-16 sm:px-6 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </span>
            )}
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
            {description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        </Reveal>
        <div className="mt-10 lg:mt-14">{children}</div>
      </div>
    </section>
  );
}