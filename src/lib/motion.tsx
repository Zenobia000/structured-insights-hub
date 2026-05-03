/**
 * Motion configuration — Grok v1.2 §9 compliant.
 *
 * All component animations route through this <MotionConfig> default:
 * - Easing: ease.standard (cubic-bezier(0.2, 0, 0.13, 1))
 * - Duration: 180ms (motion.duration.default)
 * - Spring: forbidden in UI elements (ESLint rule + spec §9.2)
 *
 * Wrap the app once at root. Children use motion components directly;
 * any prop overriding ease must use a v1.2-approved cubic-bezier value.
 */
import { MotionConfig } from "motion/react";
import type { Transition } from "motion/react";
import type { ReactNode } from "react";

/**
 * v1.2 ease set — keep in sync with src/styles.css --ease-* CSS vars
 * and docs/design-system-specs/grok/00_foundations_spec.md §9.2.
 */
export const grokEase = {
  standard: [0.2, 0, 0.13, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  snappy: [0.5, 0, 0, 1] as const,
  linear: [0, 0, 1, 1] as const,
} as const;

/**
 * v1.2 duration set (in seconds — motion uses seconds, CSS vars use ms).
 */
export const grokDuration = {
  instant: 0.05,
  fast: 0.12,
  default: 0.18,
  slow: 0.28,
  crawl: 0.48,
} as const;

const defaultTransition: Transition = {
  duration: grokDuration.default,
  ease: grokEase.standard,
};

export function GrokMotionConfig({ children }: { children: ReactNode }) {
  return <MotionConfig transition={defaultTransition}>{children}</MotionConfig>;
}
