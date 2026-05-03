/**
 * View Transitions API wrapper — Grok v1.2 §10 amendment.
 *
 * Wraps a state update / navigation callback in document.startViewTransition()
 * when supported (Chromium-based browsers as of 2026). Safari and Firefox
 * fall back to plain immediate execution — visually equivalent to "no
 * transition," which matches v1.2's "snappy/technical" baseline.
 *
 * Usage:
 *   const navigate = useNavigate();
 *   const go = (to: string) => withViewTransition(() => navigate({ to }));
 *
 * Cross-fade timing is governed by the global CSS rule below (added to
 * styles.css if/when needed). No JS-side timing knobs to keep behavior
 * predictable across pages.
 */

type StartViewTransition = (cb: () => void | Promise<void>) => {
  finished: Promise<void>;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: StartViewTransition;
};

/**
 * Run `update` inside a View Transition if the browser supports it.
 * Falls back to direct invocation otherwise.
 */
export function withViewTransition(update: () => void | Promise<void>): void {
  if (typeof document === "undefined") {
    void update();
    return;
  }
  const doc = document as DocumentWithViewTransition;
  if (typeof doc.startViewTransition !== "function") {
    void update();
    return;
  }
  doc.startViewTransition(update);
}

/**
 * Detect support without invoking. Useful for conditionally rendering
 * fallback animations.
 */
export function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") return false;
  return typeof (document as DocumentWithViewTransition).startViewTransition === "function";
}
