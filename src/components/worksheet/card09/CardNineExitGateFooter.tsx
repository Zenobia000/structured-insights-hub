import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Judgment } from "@/types/painCard";

type Props = {
  judgmentChosen: boolean;
  reasonPassed: boolean;
  nextActionChosen: boolean;
  reasonLen: number;
  reasonMin: number;
  judgment: Judgment | null;
  blockedMessage: string | null;
  submitting: boolean;
  onAdvance: () => void;
  onBack: () => void;
};

const STATUS_LABEL: Record<string, string> = {
  true_pain: "structured（已結構化）",
  pending_interview: "pending_interview（待訪談）",
  fake_pain: "archived_fake（封存為假痛點）",
};

export function CardNineExitGateFooter({
  judgmentChosen,
  reasonPassed,
  nextActionChosen,
  reasonLen,
  reasonMin,
  judgment,
  blockedMessage,
  submitting,
  onAdvance,
  onBack,
}: Props) {
  const hints = [
    { label: "想想看你選了哪一種判斷（真 / 假 / 待訪談）", done: judgmentChosen },
    {
      label: `想想看你的書面理由有沒有寫到 ${reasonMin} 字（目前 ${reasonLen}）`,
      done: reasonPassed,
    },
    { label: "想想看你之後最想做哪一件事", done: nextActionChosen },
  ];
  const allDone = hints.every((h) => h.done);
  const remaining = hints.filter((h) => !h.done).length;
  const statusPreview = judgment ? STATUS_LABEL[judgment] : null;

  // 預設摺疊,避免提示遮擋主畫面;有 blockedMessage 時自動展開
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (blockedMessage) setExpanded(true);
  }, [blockedMessage]);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.08)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">
        {/* 摺疊 header */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="card9-reflection-panel"
          className="flex w-full items-center justify-between gap-3 rounded-md px-1 py-1 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary shrink-0">想想看</h3>
            {allDone ? (
              <span className="text-[12px] text-verified inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> 三個都想清楚了
              </span>
            ) : (
              <span className="text-[12px] text-text-secondary truncate">
                還有 <span className="font-semibold text-secondary">{remaining}</span> 件沒想清楚
                {!expanded && <span className="text-text-muted">,點開看細節</span>}
              </span>
            )}
          </div>
          <span className="shrink-0 text-text-muted">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </span>
        </button>

        {/* 反思內容 — 摺疊區,加上 max-h + overflow-auto 避免吃掉主畫面 */}
        {expanded && (
          <div
            id="card9-reflection-panel"
            className="max-h-[40vh] overflow-y-auto pr-1 -mr-1 space-y-3"
          >
            <ul className="space-y-1.5">
              {hints.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-secondary leading-[1.55]"
                >
                  <span
                    aria-hidden
                    className={
                      h.done
                        ? "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[12px] leading-none text-verified"
                        : "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[12px] leading-none text-text-muted"
                    }
                  >
                    {h.done ? "✓" : "○"}
                  </span>
                  <span className={h.done ? "text-text-primary" : ""}>{h.label}</span>
                </li>
              ))}
            </ul>

            {statusPreview && allDone && (
              <p className="text-[12.5px] text-text-secondary">
                <span className="text-text-primary font-medium">送出後 status 將寫入：</span>{" "}
                {statusPreview}
              </p>
            )}
          </div>
        )}

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還缺什麼：</span> {blockedMessage}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary"
          >
            ← 回去把卡 8 想清楚再來
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allDone || submitting}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "查看你的痛點身份證 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
