/**
 * WorksheetCardHeader — Card header with OS-window chrome (Grok v1.2 §03.6 / C3).
 *
 * Structure:
 * - 28px chrome strip: card index (left) · AI mode badge (right), hairline below
 * - Content area: h1 title (+ optional kicker illustration on right) ·
 *   optional rule callout · optional intro paragraph
 *
 * The chrome treats each card as a "panel" without committing the surrounding
 * page to a console split — keeps shell minimal while giving each card a
 * window-frame visual identity.
 *
 * Optional `illustration` prop: when set, renders the named monochrome
 * illustration as a kicker accent at top-right of the content area
 * (sm+ only — collapses on mobile to keep title legible).
 */
import type { ReactNode, ComponentProps } from "react";
import { Info, ShieldOff, Sparkles } from "lucide-react";
import { Illustration } from "@/components/Illustration";
import { cn } from "@/lib/utils";

type AiStatus = "disabled" | "enabled" | "required";
type IllustrationName = ComponentProps<typeof Illustration>["name"];

type Props = {
  cardNumber: number;
  totalCards?: number;
  aiStatus?: AiStatus;
  title: ReactNode;
  /** Boxed callout for cards rule */
  rule?: ReactNode;
  /** Body paragraph below the title */
  intro?: ReactNode;
  /** Optional illustration name from the prompt library — renders top-right */
  illustration?: IllustrationName;
  /** Alt text for the illustration */
  illustrationAlt?: string;
  className?: string;
};

const aiBadgeMap: Record<AiStatus, { label: string; cls: string; Icon: typeof ShieldOff }> = {
  disabled: {
    label: "AI 禁用",
    cls: "border-status-warning/40 text-status-warning",
    Icon: ShieldOff,
  },
  enabled: {
    label: "AI 可選用",
    cls: "border-text-primary/40 bg-surface-active text-text-primary",
    Icon: Sparkles,
  },
  required: {
    label: "AI 必須使用",
    cls: "border-text-primary/40 bg-surface-active text-text-primary",
    Icon: Sparkles,
  },
};

export function WorksheetCardHeader({
  cardNumber,
  totalCards = 9,
  aiStatus,
  title,
  rule,
  intro,
  illustration,
  illustrationAlt,
  className,
}: Props) {
  const ai = aiStatus ? aiBadgeMap[aiStatus] : null;
  const idx = String(cardNumber).padStart(2, "0");
  const total = String(totalCards).padStart(2, "0");

  return (
    <header className={cn("mb-12", className)}>
      {/* Chrome strip — OS-window title bar */}
      <div className="flex items-center justify-between border border-border-hairline bg-canvas-raised px-4 sm:px-5 h-9 rounded-t-md">
        <div className="flex items-center gap-3 min-w-0">
          {/* Three-dot tab marker (single-color, no neon) */}
          <div className="hidden sm:flex items-center gap-1.5" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-border-default" />
            <span className="h-1.5 w-1.5 rounded-full bg-border-default" />
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-tertiary truncate">
            <span className="text-text-secondary">card</span>
            <span className="mx-1.5 text-text-primary tabular-nums">{idx}</span>
            <span className="text-border-strong">/</span>
            <span className="ml-1.5 tabular-nums">{total}</span>
          </span>
        </div>
        {ai && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em]",
              ai.cls,
            )}
            aria-label={ai.label}
          >
            <ai.Icon className="h-2.5 w-2.5" aria-hidden />
            <span className="hidden sm:inline">{ai.label}</span>
          </span>
        )}
      </div>

      {/* Content area — sits flush against chrome strip via shared border */}
      <div className="border-x border-b border-border-hairline rounded-b-md bg-canvas-base px-5 sm:px-7 py-7 sm:py-9">
        <div
          className={cn(
            "grid gap-6",
            illustration ? "sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8" : "",
          )}
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-text-primary">
            {title}
          </h1>
          {illustration && (
            <Illustration
              name={illustration}
              alt={illustrationAlt ?? ""}
              aspect="1/1"
              className="hidden sm:block w-24 lg:w-28 border-0 bg-transparent self-start"
            />
          )}
        </div>

        {rule && (
          <div className="mt-7 flex items-start gap-3 rounded-md border border-text-primary/30 bg-surface-active/40 p-4">
            <Info className="h-4 w-4 text-text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.65] text-text-primary">{rule}</div>
          </div>
        )}

        {intro && (
          <p className="mt-5 text-[15px] leading-[1.7] text-text-secondary max-w-3xl">{intro}</p>
        )}
      </div>
    </header>
  );
}
