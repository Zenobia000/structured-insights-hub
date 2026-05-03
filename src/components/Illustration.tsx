/**
 * Illustration — wrapper for AI-generated monochrome illustrations.
 *
 * Per docs/design-system-specs/grok v1.2 §10:
 * - Illustrations live in /public/illustrations/{name}.{webp|svg}
 * - All must be pure black/white/gray (no neon, no risograph color)
 * - Style anchors: ink-line / etching / halftone / wireframe / topo /
 *   blueprint / wood-engraving / brutalist-symbol
 *
 * Loading fallback: hairline glyph placeholder until file present.
 * Aspect ratio defaults to 4:3 to match Midjourney --ar 4:3 output.
 */
import { cn } from "@/lib/utils";

type IllustrationName =
  // Core 8 — original prompts
  | "e1-knot-unraveling"
  | "e2-fake-pain-anatomy"
  | "e3-personas-halftone"
  | "e4-validation-funnel"
  | "e5-emotional-topo"
  | "e6-magnifier-question"
  | "e9-pain-blueprint"
  | "e10-interviewer-portrait"
  // Extended 8 — see docs/illustrations-prompt-library.md
  | "e11-listening-vessel"
  | "e12-three-named-people"
  | "e13-stuck-loop"
  | "e14-contradiction-scale"
  | "e15-evidence-stack"
  | "e16-verdict-gavel"
  | "e17-capstone-certificate"
  | "e18-stage-two-horizon";

type Props = {
  name: IllustrationName;
  alt: string;
  /** "4/3" (default) or "1/1" for E6 */
  aspect?: "4/3" | "1/1";
  className?: string;
  /** Eager-load above-the-fold illustrations (Hero/Card01). Default lazy. */
  loading?: "lazy" | "eager";
};

export function Illustration({ name, alt, aspect = "4/3", className, loading = "lazy" }: Props) {
  const aspectClass = aspect === "1/1" ? "aspect-square" : "aspect-[4/3]";
  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden rounded-md border border-border-hairline bg-canvas-sunken",
        aspectClass,
        className,
      )}
    >
      <img
        src={`/illustrations/${name}.webp`}
        alt={alt}
        loading={loading}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          // Graceful fallback: hide broken image, show placeholder pattern
          e.currentTarget.style.display = "none";
        }}
      />
      {/* Placeholder pattern shown when img fails or loading */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-dim opacity-40" />
    </figure>
  );
}
