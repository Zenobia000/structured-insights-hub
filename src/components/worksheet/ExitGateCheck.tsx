/**
 * ExitGateCheck — 卡片底部「下一步」過關檢查區
 *
 * 責任：呈現 checklist + 控制「下一張」按鈕的 enabled/disabled。
 * 不負責：檢查邏輯本身（由各頁面或 exit_gates_matrix 計算後傳入）。
 *
 * 設計原則：
 * - 失敗訊息用 Teal 邊框（非紅色），避免製造焦慮
 * - 「先存檔離開」永遠可用，給使用者退路
 */

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GateCheck = {
  label: string;
  passed: boolean;
};

type Props = {
  checks: GateCheck[];
  /** 還缺什麼的友善建議文字（未通過時顯示） */
  hint?: string;
  /** 下一張卡片的標籤，預設「下一張卡片」 */
  nextLabel?: string;
  onAdvance?: () => void;
  onSaveAndExit?: () => void;
};

export function ExitGateCheck({
  checks,
  hint,
  nextLabel = "下一張卡片",
  onAdvance,
  onSaveAndExit,
}: Props) {
  const allPassed = checks.length > 0 && checks.every((c) => c.passed);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">過關檢查</h3>
          {allPassed && (
            <span className="text-xs font-medium text-verified inline-flex items-center gap-1">
              <Check className="h-3 w-3" /> 全部通過
            </span>
          )}
        </div>

        {checks.length === 0 ? (
          <p className="text-sm text-text-muted italic">
            （此頁尚未實作檢查條件）
          </p>
        ) : (
          <ul className="space-y-1.5">
            {checks.map((c, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-2 text-sm",
                  c.passed ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {c.passed ? (
                  <Check
                    className="h-4 w-4 mt-0.5 text-verified shrink-0"
                    aria-hidden
                  />
                ) : (
                  <X
                    className="h-4 w-4 mt-0.5 text-text-muted shrink-0"
                    aria-hidden
                  />
                )}
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        )}

        {!allPassed && hint && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還缺什麼：</span>{" "}
            {hint}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={onSaveAndExit}
            className="text-text-secondary hover:text-text-primary"
          >
            先存檔離開
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allPassed}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {nextLabel} →
          </Button>
        </div>
      </div>
    </div>
  );
}
