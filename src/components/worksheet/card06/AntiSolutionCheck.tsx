/**
 * AntiSolutionCheck — 偵測 raw_response 是否進入「設計產品」模式
 *
 * 命中觸發詞 → 顯示 fallback prompt 重跑提示
 * 提供手動覆寫（留 audit log）
 */
import { useState } from "react";
import { AlertTriangle, ShieldCheck, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  hits: string[];
  manualOverride: boolean;
  onManualOverrideChange: (v: boolean) => void;
};

const FALLBACK_PROMPT = `上面的回覆裡有提到產品建議 / App / 商業模式 / SaaS / 市場機會。
請忽略所有解法相關內容，重新回答上面 8 題。
只做：痛點探索、人群描述、現有解法觀察、公開證據蒐集。
不要：推薦工具、建議產品、提商業模式、給定價建議、做 MVP 規劃。`;

export function AntiSolutionCheck({ hits, manualOverride, onManualOverrideChange }: Props) {
  const [copied, setCopied] = useState(false);
  const triggered = hits.length > 0;

  const passed = !triggered || manualOverride;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FALLBACK_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  if (!triggered) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-verified/40 bg-verified/5 px-3 py-2 text-[13.5px] text-text-primary">
        <ShieldCheck className="h-4 w-4 text-verified" aria-hidden />
        <span>
          <span className="font-semibold text-verified">✓ AI 沒有推銷解法</span> —
          可以放心進入下一卡。
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 space-y-3",
        passed ? "border-verified/40 bg-verified/5" : "border-caution/60 bg-caution/10",
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-caution shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-text-primary leading-[1.4]">
            AI 開始推銷解法了 → 用這段補強 prompt 重跑
          </h3>
          <p className="mt-1.5 text-[13px] text-text-secondary leading-[1.55]">
            偵測到觸發詞：
            {hits.map((h, i) => (
              <span
                key={i}
                className="inline-block font-mono mx-0.5 px-1.5 py-0.5 rounded bg-caution/15 text-caution text-[12px]"
              >
                {h}
              </span>
            ))}
          </p>
        </div>
      </div>

      <pre className="font-mono text-[12.5px] leading-[1.55] bg-muted-bg rounded-md p-3 max-h-60 overflow-auto whitespace-pre-wrap text-text-primary">
        {FALLBACK_PROMPT}
      </pre>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-[13px] font-semibold text-text-primary hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> 已複製
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> 複製補強 prompt
            </>
          )}
        </button>

        <label className="inline-flex items-start gap-2 ml-auto text-[13px] text-text-primary cursor-pointer">
          <input
            type="checkbox"
            checked={manualOverride}
            onChange={(e) => onManualOverrideChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-secondary"
          />
          <span>我已確認 AI 回覆沒有推銷解法（手動覆寫）</span>
        </label>
      </div>
    </div>
  );
}
