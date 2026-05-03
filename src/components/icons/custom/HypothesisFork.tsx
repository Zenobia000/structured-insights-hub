import type { CustomIconProps } from "./_template";

/**
 * HypothesisFork — single line forking into two paths, signals
 * "branching hypothesis / decision point."
 */
export function HypothesisFork({ size = 20, className, ...rest }: CustomIconProps) {
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
      <line x1="12" y1="3" x2="12" y2="11" />
      <path d="M12 11l-5 6" />
      <path d="M12 11l5 6" />
      <circle cx="7" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <circle cx="12" cy="3" r="1.5" />
    </svg>
  );
}
