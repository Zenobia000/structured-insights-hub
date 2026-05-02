/**
 * useTheme — light / dark / system 三態主題切換
 *
 * 行為：
 * - 'system' (default)：跟隨 OS prefers-color-scheme，OS 改動會即時反應
 * - 'light' / 'dark'：使用者明確選擇，寫入 localStorage
 *
 * 核心：所有切換都透過修改 <html> 的 className（'light' / 'dark'），
 * styles.css 內 :root / .dark / .light 的 CSS variables 會自動生效。
 *
 * SSR 安全：初始 read 用 lazy initializer，避免 hydration mismatch。
 * FOUC 防止：__root.tsx 內注入 inline script，在 React 接手前先設好 class。
 */
import { useCallback, useEffect, useState } from "react";

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "painmap.theme";

function readStoredChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(resolved);
  // color-scheme is also handled by CSS but set here for native form controls
  html.style.colorScheme = resolved;
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(() => readStoredChoice());
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    readStoredChoice() === "system" ? resolveSystemTheme() : (readStoredChoice() as ResolvedTheme),
  );

  // Apply on choice change
  useEffect(() => {
    const next: ResolvedTheme = choice === "system" ? resolveSystemTheme() : choice;
    setResolved(next);
    applyTheme(next);
    if (choice === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, choice);
    }
  }, [choice]);

  // Listen to OS changes when in 'system' mode
  useEffect(() => {
    if (choice !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      const next: ResolvedTheme = e.matches ? "light" : "dark";
      setResolved(next);
      applyTheme(next);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [choice]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setChoice(readStoredChoice());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /** Cycle: light → dark → system → light ... */
  const cycle = useCallback(() => {
    setChoice((prev) => (prev === "light" ? "dark" : prev === "dark" ? "system" : "light"));
  }, []);

  return { choice, resolved, setChoice, cycle };
}
