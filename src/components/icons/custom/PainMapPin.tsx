import type { CustomIconProps } from "./_template";

/**
 * PainMapPin — geographic pin on a topographic dot, signals locating a pain.
 */
export function PainMapPin({ size = 20, className, ...rest }: CustomIconProps) {
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
      <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
      <line x1="3" y1="20" x2="21" y2="20" strokeDasharray="2 3" opacity="0.5" />
    </svg>
  );
}
