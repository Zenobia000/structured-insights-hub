/**
 * AntiFakeCheckPanel — 卡 1 即時檢核面板（Desktop 右側 sticky / Mobile 表單下方）。
 *
 * 設計：
 * - 不是評分，是「品質提示」。pending（灰）/ pass（verified green）/ warning（caution amber）
 * - aria-live="polite" 讓螢幕閱讀器讀出狀態變化
 */
import { Check, AlertTriangle, Circle } from "lucide-react";
import type { CardOneChecks, CheckStatus } from "@/lib/cardOneValidators";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  hint: string;
  status: CheckStatus;
};

function statusIcon(status: CheckStatus) {
  if (status === "pass")
    return <Check className="h-4 w-4 text-verified" aria-label="通過" />;
  if (status === "warning")
    return (
      <AlertTriangle className="h-4 w-4 text-caution" aria-label="需要修正" />
    );
  return <Circle className="h-4 w-4 text-text-muted" aria-label="尚未開始" />;
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
      className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_3px_rgba(30,58,95,0.06)]"
    >
      <h2
        id="anti-fake-title"
        className="text-[18px] font-semibold text-text-primary leading-[1.4]"
      >
        即時檢核
      </h2>
      <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">
        這是品質提示,不是評分。
      </p>

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
                <span className="sr-only">狀態：{statusText(it.status)}</span>
                {it.status === "warning" && (
                  <p className="mt-1 text-[12.5px] leading-[1.55] text-text-secondary">
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
