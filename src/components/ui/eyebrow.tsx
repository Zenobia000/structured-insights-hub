/**
 * Eyebrow — Grok signature uppercase mono marker
 *
 * Usage:
 *   <Eyebrow>Foundations / Color</Eyebrow>
 *   <Eyebrow variant="numbered" index={1}>Hero</Eyebrow>
 *   <Eyebrow variant="dotted">New</Eyebrow>
 *   <Eyebrow variant="with-line">Trusted by</Eyebrow>
 */
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EyebrowVariant = "plain" | "numbered" | "dotted" | "with-line";

type EyebrowProps = {
  children: ReactNode;
  variant?: EyebrowVariant;
  index?: number;
  className?: string;
  as?: "p" | "span" | "div";
};

export function Eyebrow({
  children,
  variant = "plain",
  index,
  className,
  as: Tag = "p",
}: EyebrowProps) {
  const padded = typeof index === "number" ? String(index).padStart(2, "0") : null;

  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase leading-[14px] text-text-tertiary",
        "tracking-[0.08em]",
        variant === "with-line" && "w-full gap-3",
        className,
      )}
    >
      {variant === "dotted" && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-accent-electric shadow-[0_0_8px_rgba(91,141,239,0.6)]"
        />
      )}
      {variant === "numbered" && padded && <span className="text-text-secondary">{padded}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {variant === "with-line" && <span aria-hidden className="h-px flex-1 bg-border-hairline" />}
    </Tag>
  );
}
