/**
 * WorksheetCardHeader — 9 卡頁面共用標題區 (Grok dark)。
 *
 * 結構：
 * - Eyebrow: Card NN / 09
 * - AI 介入標籤（disabled / enabled / required）
 * - h1 主標題
 * - intro callout（規則）
 * - intro paragraph
 */
import type { ReactNode } from "react";
import { Info, ShieldOff, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type AiStatus = "disabled" | "enabled" | "required";

type Props = {
  cardNumber: number;
  totalCards?: number;
  aiStatus?: AiStatus;
  title: ReactNode;
  /** 黃底框內顯示「規則」 */
  rule?: ReactNode;
  /** 標題下方說明段（regular paragraph） */
  intro?: ReactNode;
  className?: string;
};

const aiBadgeMap: Record<AiStatus, { label: string; cls: string; Icon: typeof ShieldOff }> = {
  disabled: {
    label: "AI 禁用",
    cls: "border-status-warning/40 bg-status-warning-bg text-status-warning",
    Icon: ShieldOff,
  },
  enabled: {
    label: "AI 可選用",
    cls: "border-accent-electric/40 bg-accent-electric-subtle text-accent-electric",
    Icon: Sparkles,
  },
  required: {
    label: "AI 必須使用",
    cls: "border-accent-electric/40 bg-accent-electric-subtle text-accent-electric",
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
  className,
}: Props) {
  const ai = aiStatus ? aiBadgeMap[aiStatus] : null;
  return (
    <header className={cn("mb-10", className)}>
      <div className="flex items-center justify-between gap-4 mb-5">
        <Eyebrow variant="numbered" index={cardNumber}>
          Card {String(cardNumber).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
        </Eyebrow>
        {ai && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em]",
              ai.cls,
            )}
            aria-label={ai.label}
          >
            <ai.Icon className="h-3 w-3" aria-hidden />
            {ai.label}
          </span>
        )}
      </div>

      <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-text-primary">
        {title}
      </h1>

      {rule && (
        <div className="mt-7 flex items-start gap-3 rounded-md border border-accent-electric/30 bg-accent-electric-subtle/40 p-4">
          <Info className="h-4 w-4 text-accent-electric shrink-0 mt-0.5" aria-hidden />
          <div className="text-[14.5px] leading-[1.65] text-text-primary">{rule}</div>
        </div>
      )}

      {intro && (
        <p className="mt-5 text-[15px] leading-[1.7] text-text-secondary max-w-3xl">{intro}</p>
      )}
    </header>
  );
}
