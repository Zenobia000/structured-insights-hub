/**
 * VerdictAuditDialog — Card 9 紅隊 audit 窄門
 *
 * 鐵律例外設計：
 *   Card 9 的判斷層欄位一律 AI 禁用 — 但這個 Dialog 是「使用者主動觸發」
 *   的紅隊檢查，輸出純參考、不能阻擋 ExitGate、不寫回 verdict 任何欄位。
 *
 * UX 約束：
 *   - 入口按鈕用低調 outline 風格（不誘導使用，不像 primary CTA）
 *   - Dialog 標題 / 內容反覆強調「這是參考意見，最終判斷仍由你」
 *   - 顯示 verdict.reason → 旁邊 LLM verdict + reason
 *   - 任何錯誤 / fallback → 顯示「這次 AI 無法給意見，你的判斷照舊」
 */
import { useState } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { judge } from "@/lib/llmJudge";
import { usePainCardStore } from "@/store/painCard";
import type { PainCard } from "@/types/painCard";

type AuditState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready"; verdict: "pass" | "warn"; reason: string; source: "llm" | "cache" }
  | { phase: "error"; message: string };

/**
 * Build a compact context string from cards 1-8 so the LLM can spot
 * "你寫了 X 但前面卡找不到 X 的證據" type misalignments.
 *
 * Constrained to ≤ 2000 chars (the JudgeRequest schema cap on `context`).
 */
function buildContext(card: PainCard): string {
  const c = card;
  const lines: string[] = [];

  if (c.complaint.verbatim) {
    lines.push(`[卡1 抱怨原句] ${c.complaint.verbatim.slice(0, 200)}`);
  }
  if (c.people.list.length > 0) {
    const names = c.people.list
      .filter((p) => p.name)
      .map((p) => `${p.name}(${p.relation})`)
      .join("、");
    if (names) lines.push(`[卡2 真人] ${names}`);
  }
  if (c.stuck_formula.ai_polished) {
    lines.push(`[卡3 卡關公式] ${c.stuck_formula.ai_polished.slice(0, 150)}`);
  }
  if (c.workaround.tool_name) {
    lines.push(`[卡4 現行解法] ${c.workaround.tool_name}`);
    if (c.workaround.user_dissatisfactions.length) {
      lines.push(
        `  不滿×${c.workaround.user_dissatisfactions.length}: ${c.workaround.user_dissatisfactions.slice(0, 3).join("｜")}`,
      );
    }
  }
  if (c.contradiction.side_a || c.contradiction.side_b) {
    lines.push(
      `[卡5 矛盾] ${c.contradiction.side_a} ⇄ ${c.contradiction.side_b}（犧牲 ${c.contradiction.sacrificed ?? "?"}）`,
    );
  }
  if (c.ai_evidence.ai_tool) {
    lines.push(`[卡6 AI證據] 工具=${c.ai_evidence.ai_tool}`);
    const e8 = c.ai_evidence.eight_answers;
    if (e8?.q1_specific_groups) {
      lines.push(`  人群: ${e8.q1_specific_groups.slice(0, 100)}`);
    }
    if (e8?.q5_public_evidence) {
      lines.push(`  證據: ${e8.q5_public_evidence.slice(0, 100)}`);
    }
  }
  if (c.self_guess.deltas.biggest_diff) {
    lines.push(`[卡7 我vs AI最大差異] ${c.self_guess.deltas.biggest_diff.slice(0, 120)}`);
  }
  if (c.interview_plan.targets.length > 0) {
    const t = c.interview_plan.targets[0];
    lines.push(`[卡8 訪談對象] ${t.persona}（${t.contact_info || "無聯絡"}）`);
  }
  // verdict 自己的 most/least 也丟進去 — LLM 會比對 reason 與這兩個欄位是否一致
  if (c.verdict.most_confident_evidence) {
    lines.push(`[卡9 最有把握] ${c.verdict.most_confident_evidence.slice(0, 120)}`);
  }
  if (c.verdict.least_confident) {
    lines.push(`[卡9 最沒把握] ${c.verdict.least_confident.slice(0, 120)}`);
  }

  let ctx = lines.join("\n");
  if (ctx.length > 1900) ctx = ctx.slice(0, 1897) + "...";
  return ctx;
}

export function VerdictAuditDialog() {
  const card = usePainCardStore((s) => s.card);
  const reason = card.verdict.reason_100w;
  const reasonReady = reason.trim().length >= 100;

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AuditState>({ phase: "idle" });

  async function runAudit() {
    setState({ phase: "loading" });
    try {
      const ctx = buildContext(card);
      const outcome = await judge("card9.verdict_audit", reason, ctx, card.llm_cache);
      if (outcome.source === "fallback") {
        setState({
          phase: "error",
          message: `這次 AI 無法給意見（${outcome.reason}）。你的判斷照舊 — 紅隊功能只是工具，缺它不影響你前進。`,
        });
        return;
      }
      setState({
        phase: "ready",
        verdict: outcome.verdict,
        reason: outcome.reason,
        source: outcome.source,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      setState({ phase: "error", message: `這次 AI 無法給意見（${msg}）。你的判斷照舊。` });
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setState({ phase: "idle" }); // reset for next open
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!reasonReady}
          aria-label="請 AI 紅隊檢查我的判斷（參考用，不影響繼續）"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border-default bg-transparent px-3 text-[12.5px] text-text-secondary hover:bg-surface-hover hover:border-border-strong hover:text-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
        >
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
          <span>請 AI 紅隊檢查（參考用）</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-canvas-overlay border-border-default">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-[-0.01em]">
            紅隊檢查 · 參考意見
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            這只是一個參考工具。AI 會看你的書面理由與前面 8 卡的證據是否對齊，但
            <strong className="text-text-primary"> 最終判斷仍是你的</strong> —
            看完關掉，照原本的判斷繼續即可。
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Show user's reason for context */}
          <div className="rounded-md border border-border-hairline bg-canvas-raised p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary mb-1.5">
              你寫的判斷理由
            </p>
            <p className="text-[13px] leading-[1.65] text-text-primary whitespace-pre-wrap">
              {reason}
            </p>
          </div>

          {/* Result panel */}
          {state.phase === "idle" && (
            <button
              type="button"
              onClick={runAudit}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent-electric px-4 text-[13.5px] font-medium text-text-primary hover:bg-accent-electric-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-overlay"
            >
              開始檢查
            </button>
          )}

          {state.phase === "loading" && (
            <div className="flex items-center justify-center gap-2 py-6 text-text-secondary text-[13px]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>AI 正在比對你的理由與前面 8 卡的證據…</span>
            </div>
          )}

          {state.phase === "ready" && (
            <div
              className={
                state.verdict === "pass"
                  ? "rounded-md border border-status-success/40 bg-status-success-bg/40 p-4"
                  : "rounded-md border border-status-warning/40 bg-status-warning-bg/40 p-4"
              }
            >
              <div className="flex items-start gap-2">
                {state.verdict === "pass" ? (
                  <CheckCircle2
                    className="h-4 w-4 text-status-success shrink-0 mt-0.5"
                    aria-hidden
                  />
                ) : (
                  <AlertTriangle
                    className="h-4 w-4 text-status-warning shrink-0 mt-0.5"
                    aria-hidden
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary mb-1.5">
                    {state.verdict === "pass" ? "對齊良好" : "可再對齊一下"}
                    {state.source === "cache" && " · 引用上次結果"}
                  </p>
                  <p className="text-[13.5px] leading-[1.65] text-text-primary">
                    {state.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {state.phase === "error" && (
            <div className="rounded-md border border-border-hairline bg-canvas-raised p-3.5 text-[12.5px] text-text-secondary leading-[1.65]">
              {state.message}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <p className="text-[11px] text-text-tertiary leading-[1.6] flex-1">
            這份檢查不會寫回任何欄位、不會擋你前進到痛點身份證頁。
          </p>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border-default bg-transparent px-4 text-[13px] text-text-primary hover:bg-surface-hover hover:border-border-strong transition-colors"
          >
            關閉
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
