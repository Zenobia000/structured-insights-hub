import type { CustomIconProps } from "./_template";

/**
 * EvidenceStack — three stacked rectangles with a single connecting hairline,
 * signals "accumulated proof / multi-source evidence."
 */
export function EvidenceStack({ size = 20, className, ...rest }: CustomIconProps) {
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
      <rect x="4" y="6" width="16" height="3" rx="0.5" />
      <rect x="4" y="11" width="16" height="3" rx="0.5" opacity="0.7" />
      <rect x="4" y="16" width="16" height="3" rx="0.5" opacity="0.4" />
      <line x1="2" y1="6" x2="2" y2="19" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}
