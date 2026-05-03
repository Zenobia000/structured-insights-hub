/**
 * useFadeInOnScroll — IntersectionObserver 包裝。
 * 元素進入 viewport 後切換為「visible」，後續不再翻轉（避免閃爍）。
 *
 * 用法：
 *   const { ref, visible } = useFadeInOnScroll();
 *   <section ref={ref} className={cn(visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3", "transition-all duration-500")}>
 */

import { useEffect, useRef, useState } from "react";

export function useFadeInOnScroll<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    // prefers-reduced-motion：直接顯示，不做動畫觀察
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    // Note: avoid getBoundingClientRect() here — calling it on every mounted
    // section during initial render forces a synchronous layout reflow
    // (Lighthouse flagged ~548ms). IntersectionObserver fires its initial
    // callback asynchronously for elements already in viewport, which is
    // sufficient and reflow-free.
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
          break;
        }
      }
    }, options);
    obs.observe(el);

    // Safety net: if observer hasn't fired within 1.5s (can happen on
    // some headless browsers / iframes / Safari quirks), reveal anyway.
    const fallbackId = window.setTimeout(() => setVisible(true), 1500);

    return () => {
      obs.disconnect();
      window.clearTimeout(fallbackId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible };
}
