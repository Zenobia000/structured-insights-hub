/**
 * AntiFakeCheckPanel — 卡 1 即時檢核面板 (Grok dark)。
 *
 * 設計：
 * - 不是評分，是「品質提示」。pending（灰）/ pass（accent electric）/ warning（caution amber）
 * - aria-live="polite" 讓螢幕閱讀器讀出狀態變化
 */
import { Check, AlertTriangle, Circle } from "lucide-react";
import type { CardOneChecks, CheckStatus } from "@/lib/cardOneValidators";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  hint: string;
  status: CheckStatus;
};

function statusIcon(status: CheckStatus) {
  if (status === "pass")
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-success-bg text-status-success">
        <Check className="h-3 w-3" strokeWidth={2.5} aria-label="通過" />
      </span>
    );
  if (status === "warning")
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-warning-bg text-status-warning">
        <AlertTriangle className="h-3 w-3" aria-label="需要修正" />
      </span>
    );
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-text-tertiary">
      <Circle className="h-3 w-3" aria-label="尚未開始" />
    </span>
  );
}

function statusText(status: CheckStatus) {
  if (status === "pass") return "通過";
  if (status === "warning") return "需要修正";
  return "尚未開始";
}

export function AntiFakeCheckPanel({ checks }: { checks: CardOneChecks }) {
  const items: Item[] = [
    {
      label: "原句不含「我覺得 / 應該需要 / 可能」等分析詞",
      hint: "如果你寫的是「我覺得他需要 X」，這是你的解釋，不是原句。",
      status: checks.noAnalysisWords,
    },
    {
      label: "來源是有具體姓名的真人",
      hint: "「現代人」「上班族」不是一個你能找到的人。請填具體姓名。",
      status: checks.realPerson,
    },
    {
      label: "場景可被觀察（有時間 + 動作）",
      hint: "場景越具體越好（例：「他從 21:00 寫到 02:30」勝過「他在工作」）。",
      status: checks.observableScene,
    },
  ];

  return (
    <aside
      aria-labelledby="anti-fake-title"
      className="rounded-lg border border-border-hairline bg-canvas-raised p-5"
    >
      <Eyebrow variant="dotted" className="mb-3">
        Quality check
      </Eyebrow>
      <h2
        id="anti-fake-title"
        className="text-base font-semibold tracking-[-0.01em] text-text-primary"
      >
        即時檢核
      </h2>
      <p className="mt-1 text-[12.5px] leading-[1.55] text-text-tertiary">
        這是品質提示，不是評分。
      </p>

      <ul aria-live="polite" className="mt-5 space-y-4">
        {items.map((it, i) => (
          <li key={i}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5">{statusIcon(it.status)}</span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[13.5px] leading-[1.55]",
                    it.status === "pass" && "text-text-primary",
                    it.status === "warning" && "text-status-warning font-medium",
                    it.status === "pending" && "text-text-secondary",
                  )}
                >
                  {it.label}
                </p>
                <span className="sr-only">狀態：{statusText(it.status)}</span>
                {it.status === "warning" && (
                  <p className="mt-1.5 text-[12px] leading-[1.6] text-text-tertiary">
                    {it.hint}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
