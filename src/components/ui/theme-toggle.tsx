/**
 * ThemeToggle — Sun / Moon / Monitor cycle button
 *
 * Click 一次 cycle: light → dark → system → light
 * 使用 hover tooltip 顯示當前 mode + 下個 mode。
 */
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme, type ThemeChoice } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const labelMap: Record<ThemeChoice, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System",
};

const nextLabelMap: Record<ThemeChoice, string> = {
  light: "Switch to Dark",
  dark: "Switch to System",
  system: "Switch to Light",
};

type Props = {
  className?: string;
  /** 'icon' = 32×32 圓 button；'compact' = 含當前 mode 文字 */
  variant?: "icon" | "compact";
};

export function ThemeToggle({ className, variant = "icon" }: Props) {
  const { choice, cycle } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 SSR / hydration mismatch — toggle 文字依賴 client-side state
  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon = choice === "light" ? Sun : choice === "dark" ? Moon : Monitor;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={cycle}
        aria-label={mounted ? nextLabelMap[choice] : "Toggle theme"}
        className={cn(
          "group inline-flex h-9 items-center gap-2 rounded-md border border-border-hairline bg-canvas-raised/60 px-3 text-text-secondary transition-all hover:bg-surface-hover hover:border-border-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base",
          className,
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
          {mounted ? labelMap[choice] : "Theme"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={mounted ? nextLabelMap[choice] : "Toggle theme"}
      title={mounted ? `${labelMap[choice]} · click to ${nextLabelMap[choice].toLowerCase()}` : "Theme"}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-hairline bg-canvas-raised/60 text-text-secondary transition-all hover:bg-surface-hover hover:border-border-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base",
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      {choice === "system" && (
        <span
          aria-hidden
          className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent-electric shadow-[0_0_6px_var(--accent-glow-strong)]"
        />
      )}
    </button>
  );
}
