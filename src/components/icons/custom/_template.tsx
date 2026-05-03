/**
 * Custom icon baseline — Grok v1.2 stroke icon spec.
 *
 * Mirror this template for every custom icon under src/components/icons/custom/.
 *
 * Spec rules (v1.2 §icon-system):
 * - Stroke width: 1.5px
 * - Box: 24x24 viewBox (Lucide-compatible). Component accepts size prop
 *   to render at 16/20/24 — stroke scales naturally.
 * - Color: stroke="currentColor" — inherits text color by default.
 * - No fills (stroke-only). Exception: solid 1px shape for symbol mass.
 * - All paths rounded line-cap and line-join.
 */
import type { SVGProps } from "react";

export type CustomIconProps = {
  size?: 16 | 20 | 24;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "size" | "width" | "height">;

export function _Template({ size = 20, className, ...rest }: CustomIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {/* Replace with icon-specific paths */}
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
