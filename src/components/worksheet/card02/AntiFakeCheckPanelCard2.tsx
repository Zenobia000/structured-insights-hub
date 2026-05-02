/**
 * AntiFakeCheckPanelCard2 — 卡 2 即時檢核面板。
 *
 * 3 項 check + 1 個自我承諾 checkbox（與 exit gate 連動）。
 */
import { Check, AlertTriangle, Circle } from "lucide-react";

import type { CardTwoChecks } from "@/lib/cardTwoValidators";
import type { CheckStatus } from "@/lib/cardOneValidators";
import { cn } from "@/lib/utils";

function statusIcon(status: CheckStatus) {
  if (status === "pass") return <Check className="h-4 w-4 text-verified" aria-label="通過" />;
  if (status === "warning")
    return <AlertTriangle className="h-4 w-4 text-caution" aria-label="需要修正" />;
  return <Circle className="h-4 w-4 text-text-muted" aria-label="尚未開始" />;
}

type Item = { label: string; hint: string; status: CheckStatus };

export function AntiFakeCheckPanelCard2({
  checks,
  commitment,
  onCommitmentChange,
  backgroundStatus,
  backgroundHint,
  backgroundAnalyzing,
}: {
  checks: CardTwoChecks;
  commitment: boolean;
  onCommitmentChange: (v: boolean) => void;
  /** 背景具體性的「對外狀態」— 由 page 端決定（LLM > hardcoded fallback） */
  backgroundStatus?: CheckStatus;
  /** 背景具體性顯示的提示文字（LLM reason 或 hardcoded fallback） */
  backgroundHint?: string;
  /** LLM 正在分析中 */
  backgroundAnalyzing?: boolean;
}) {
  const bgStatus: CheckStatus = backgroundStatus ?? checks.specificBackground;
  const bgHint =
    backgroundHint ??
    "「年輕人」「上班族」太寬。請至少寫 2 個具體屬性（例：30-50 歲、補習班數學老師、台灣）。";

  const items: Item[] = [
    {
      label: "3 個都是真名（不是「老師 A / 同學 B」）",
      hint: "「老師 A」這種代稱代表你還不認識這個人。請填具體姓名（可化名但要是真人）。",
      status: checks.realNames,
    },
    {
      label: "你今天就能聯絡到至少 1 位",
      hint: "至少 1 個聯絡方式要寫 LINE / 電話 / Email / Messenger 等可立即傳訊的管道。",
      status: checks.contactableExists,
    },
    {
      label: backgroundAnalyzing
        ? "背景描述夠具體（AI 分析中…）"
        : "背景描述夠具體（涵蓋 ≥ 2 個具體屬性）",
      hint: bgHint,
      status: bgStatus,
    },
  ];

  return (
    <aside
      aria-labelledby="anti-fake-title-card2"
      className="rounded-xl border border-border bg-surface p-5"
    >
      <h2
        id="anti-fake-title-card2"
        className="text-[18px] font-semibold text-text-primary leading-[1.4]"
      >
        即時檢核
      </h2>
      <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">這是品質提示,不是評分。</p>

      <ul aria-live="polite" className="mt-4 space-y-3.5">
        {items.map((it, i) => (
          <li key={i}>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0">{statusIcon(it.status)}</span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[14px] leading-[1.5]",
                    it.status === "pass" && "text-text-primary",
                    it.status === "warning" && "text-caution font-medium",
                    it.status === "pending" && "text-text-secondary",
                  )}
                >
                  {it.label}
                </p>
                {it.status === "warning" && (
                  <p className="mt-1 text-[12.5px] leading-[1.55] text-text-secondary">{it.hint}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 自我承諾 checkbox */}
      <label className="mt-5 flex items-start gap-2.5 rounded-md border border-border bg-page p-3 cursor-pointer hover:bg-muted/40 transition-colors">
        <input
          type="checkbox"
          checked={commitment}
          onChange={(e) => onCommitmentChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border accent-secondary cursor-pointer"
          aria-describedby="commitment-helper"
        />
        <span className="text-[13.5px] leading-[1.55] text-text-primary">
          <span className="font-semibold">我確認</span>今天就能聯絡到至少 1 位
          <span id="commitment-helper" className="block text-[12px] text-text-muted mt-0.5">
            這是自我承諾，沒人會檢查 — 但下一張卡會請你真的去聯絡。
          </span>
        </span>
      </label>
    </aside>
  );
}
