/**
 * CardHero — full-width editorial hero strip for worksheet cards.
 *
 * Replaces the per-card 80–96px corner kicker illustration with a 21:9 strip
 * spanning the card's content container. Pairs the illustration with a
 * numbered Eyebrow so each card reads as its own chapter, mirroring the
 * editorial rhythm established on the landing page.
 *
 * Usage: render as the FIRST child inside <main> of each card route, before
 * the existing header. The card's old inline <Illustration> in its header
 * should be removed when this is added (avoid duplication).
 */
import type { ComponentProps } from "react";
import { Illustration } from "@/components/Illustration";
import { cn } from "@/lib/utils";

type IllustrationName = ComponentProps<typeof Illustration>["name"];

type Props = {
  illustration: IllustrationName;
  alt: string;
  className?: string;
};

export function CardHero({ illustration, alt, className }: Props) {
  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      <Illustration
        name={illustration}
        alt={alt}
        aspect="4/3"
        priority
        sizes="(min-width: 1024px) 80vw, 100vw"
        className="aspect-[16/6] sm:aspect-[32/7] border-0 bg-transparent"
      />
    </div>
  );
}
