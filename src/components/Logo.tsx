/**
 * Logo — PainMap continuous-line brand mark.
 *
 * The asset (`/logo.png`) is white-line-on-black-background continuous
 * line art evolving knot → map-pin, with "PainMap" wordmark baked in
 * the bottom 30%.
 *
 * Variants:
 * - "mark" (default): square icon, crops bottom text via object-position.
 *   Use in compact headers / nav. Wordmark NOT visible at this scale.
 * - "full": square image with mark + wordmark visible. Use in 404,
 *   loading screens, or when ≥80px height.
 *
 * Light mode: PNG is white-on-black; `.light :is(.logo-asset)` flips
 * via `filter: invert(1)` so it reads as black-on-white. The asset's
 * own black background becomes white in light mode — we crop with a
 * transparent background-color so the canvas surface shows through.
 */
import { cn } from "@/lib/utils";

type Props = {
  variant?: "mark" | "full";
  /** Size in px. Square. Default 36. */
  size?: number;
  className?: string;
};

export function Logo({ variant = "mark", size = 36, className }: Props) {
  if (variant === "full") {
    return (
      <img
        src="/logo.webp"
        alt="PainMap"
        width={size}
        height={size}
        className={cn(
          "logo-asset object-contain shrink-0",
          // Logo asset has a black background painted in. We want it
          // transparent over our canvas. Use mix-blend-mode: screen
          // (additive blend — black becomes transparent against any
          // dark canvas; white stays white). For light mode the
          // .light filter inverts it first.
          "[mix-blend-mode:screen] [.light_&]:[mix-blend-mode:multiply] [.light_&]:invert",
          className,
        )}
      />
    );
  }
  // mark variant: crop the bottom wordmark. Logo asset is ~600x600 with
  // the line drawing occupying roughly the top 60%. Render at requested
  // size as a square, with object-position: top to anchor the mark.
  return (
    <span
      aria-label="PainMap"
      className={cn(
        "inline-block overflow-hidden shrink-0 align-middle",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.webp"
        alt=""
        aria-hidden
        className={cn(
          "logo-asset object-cover w-full",
          "[mix-blend-mode:screen] [.light_&]:[mix-blend-mode:multiply] [.light_&]:invert",
        )}
        style={{
          // height bigger than container so we show only the top portion
          height: size / 0.62,
          objectPosition: "top",
        }}
      />
    </span>
  );
}
