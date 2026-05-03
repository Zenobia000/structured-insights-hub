import type { CustomIconProps } from "./_template";

/**
 * ValidationCheckDouble — two stacked checkmarks, signals "verified twice
 * (claim + evidence)."
 */
export function ValidationCheckDouble({ size = 20, className, ...rest }: CustomIconProps) {
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
      <path d="M2 12l5 5L17 7" />
      <path d="M9 14l3 3L22 7" opacity="0.5" />
    </svg>
  );
}
