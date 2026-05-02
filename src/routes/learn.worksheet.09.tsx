import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Sparkles, ShieldOff, Award, Lightbulb, AlertTriangle } from "lucide-react";

import { usePainCardStore } from "@/store/painCard";
import { useDisplayModeStore, type DisplayMode } from "@/store/displayMode";
import {
  REASON_MIN,
  bandHint,
  defaultNextAction,
  evaluateScores,
  judgmentToStatus,
  type DimensionKey,
} from "@/lib/cardNineValidators";
import type { Judgment, NextAction, Score } from "@/types/painCard";
import { ScoresForm } from "@/components/worksheet/card09/ScoresForm";
import { ScoresSummary } from "@/components/worksheet/card09/ScoresSummary";
import { JudgmentForm } from "@/components/worksheet/card09/JudgmentForm";
import { CardNineExitGateFooter } from "@/components/worksheet/card09/CardNineExitGateFooter";
import { InterviewTargetsPrefill } from "@/components/worksheet/card09/InterviewTargetsPrefill";

const searchSchema = z.object({
  mode: z.enum(["teaching", "production"]).optional(),
  id: z.string().optional(),
});

export const Route = createFileRoute("/learn/worksheet/09")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "卡 9 真假痛點的書面判斷 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "走到這裡，你要做的只有一件事：書面回答「這是真痛點還是假痛點？為什麼？」AI 不參與判斷。",
      },
    ],
  }),
  component: CardNinePage,
});

function relativeTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - d) / 1000));
  if (diffSec < 5) return "剛剛";
  if (diffSec < 60) return `${diffSec} 秒前`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分鐘前`;
  return new Date(iso).toLocaleString("zh-TW", { hour: "2-digit", minute: "2-digit" });
}

function CardNinePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/learn/worksheet/09" });
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const commitVerdict = usePainCardStore((s) => s.commitVerdict);

  const mode = useDisplayModeStore((s) => s.mode);
  const setMode = useDisplayModeStore((s) => s.setMode);

  // URL ?mode 同步至 store
  useEffect(() => {
    if (search.mode && search.mode !== mode) {
      setMode(search.mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.mode]);

  function switchMode(next: DisplayMode) {
    setMode(next);
    navigate({
      to: "/learn/worksheet/09",
      search: { ...search, mode: next },
      replace: true,
    });
  }

  const v = card.verdict;

  const scoreValues = useMemo(
    () => ({
      people_specificity: v.scores.people_specificity,
      frequency: v.scores.frequency,
      intensity: v.scores.intensity,
      workaround_dissatisfaction: v.scores.workaround_dissatisfaction,
      evidence_credibility: v.scores.evidence_credibility,
    }),
    [v.scores],
  );

  const scoresEval = useMemo(() => evaluateScores(v), [v]);
  const total = scoresEval.total;
  const hint = bandHint(total);

  // setters
  const setScore = (key: DimensionKey, value: Score) => {
    updateField(`verdict.scores.${key}`, value);
  };
  const setJudgment = (j: Judgment) => {
    updateField("verdict.judgment", j);
    // 自動預選 next_action（若使用者尚未選）
    if (!v.next_action) {
      const def = defaultNextAction(j);
      if (def) updateField("verdict.next_action", def);
    }
  };
  const setReason = (s: string) => updateField("verdict.reason_100w", s);
  const setMost = (s: string) => updateField("verdict.most_confident_evidence", s);
  const setLeast = (s: string) => updateField("verdict.least_confident", s);
  const setNextAction = (n: NextAction) => updateField("verdict.next_action", n);

  // total_score 同步寫入（teaching 與 production 都寫；資料層永遠存）
  useEffect(() => {
    if (scoresEval.allFilled && v.total_score !== total) {
      updateField("verdict.total_score", total);
    }
  }, [scoresEval.allFilled, total, v.total_score, updateField]);

  // Exit gate
  const reasonLen = v.reason_100w.trim().length;
  const reasonPassed = reasonLen >= REASON_MIN;
  const judgmentChosen = v.judgment !== null;
  const nextActionChosen = v.next_action !== null;

  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBlockedMessage(null);
  }, [
    v.scores,
    v.judgment,
    v.reason_100w,
    v.next_action,
  ]);

  function handleAdvance() {
    if (!scoresEval.allFilled) {
      const remain = 5 - scoresEval.filledCount;
      setBlockedMessage(`還有 ${remain} 個維度沒打分（教學模式下打完即可）`);
      return;
    }
    if (!judgmentChosen) {
      setBlockedMessage("請選真 / 假 / 待訪談");
      return;
    }
    if (!reasonPassed) {
      setBlockedMessage(`再多寫 ${REASON_MIN - reasonLen} 字。具體說你看到 / 沒看到什麼`);
      return;
    }
    if (!nextActionChosen) {
      setBlockedMessage("請選下一步行動");
      return;
    }
    setBlockedMessage(null);
    setSubmitting(true);
    try {
      const newStatus = judgmentToStatus(v.judgment);
      // 原子提交：status + current_step 同步更新；任一步失敗會回滾，避免
      // 出現「status 已是 structured 但 current_step 仍停在 9」這種不一致。
      const result = commitVerdict({ status: newStatus, nextStep: 10 });
      if (!result.ok) {
        setBlockedMessage(
          `提交失敗，已自動回復為提交前狀態：${result.error}。請再試一次或重新整理。`,
        );
        return;
      }
      navigate({ to: "/learn/worksheet/result" });
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    navigate({ to: "/learn/worksheet/08" });
  }

  // autosave indicator
  const [savedAgo, setSavedAgo] = useState("");
  useEffect(() => {
    if (!card.updated_at) return;
    setSavedAgo(relativeTime(card.updated_at));
    const t = setInterval(() => setSavedAgo(relativeTime(card.updated_at)), 15_000);
    return () => clearInterval(t);
  }, [card.updated_at]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-7.5rem)] bg-page">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 space-y-8">
        {/* card_intro */}
        <header>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 9 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-destructive/50 bg-destructive/5 px-2 py-1 text-[11px] font-bold text-destructive"
              aria-label="這張卡 AI 完全禁用"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：❌ 完全禁用（鐵律）
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            真假痛點的書面判斷
          </h1>
          <p className="mt-3 text-[16px] leading-[1.65] text-text-secondary">
            走到這裡，你要做的只有一件事：書面回答「這是真痛點還是假痛點？為什麼？」
          </p>

          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/5 p-4"
          >
            <ShieldOff
              className="h-5 w-5 text-destructive shrink-0 mt-0.5"
              aria-hidden
            />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">這張卡片 AI 完全不參與</p>
              <p>
                真假判斷是這套訓練的唯一交付物。AI 可以幫你蒐集證據（卡 6）、整理表（卡 7）、模擬訪談（卡 8），但「真的嗎」「值得嗎」這兩題永遠是你來判。
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4">
            <Award className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">這份填空簿的唯一交付物</p>
              <p>
                你不需要做產品、不需要架網站、不需要收錢。你只需要交出這個書面判斷。
              </p>
            </div>
          </div>
        </header>

        {/* mode_indicator */}
        <div
          className={
            "rounded-lg border px-4 py-3 flex flex-wrap items-center justify-between gap-3 max-w-3xl " +
            (mode === "teaching"
              ? "border-verified/40 bg-verified/10"
              : "border-primary/30 bg-primary/5")
          }
        >
          <div>
            <p className="text-[14px] font-bold text-text-primary">
              {mode === "teaching"
                ? "📖 教學模式（顯示 5 維度反思評分）"
                : "📦 生產模式（只顯示判斷狀態，不顯示分數）"}
            </p>
            <p className="text-[12.5px] text-text-secondary leading-[1.55]">
              {mode === "teaching"
                ? "分數是讓你反思「為什麼給這個維度 X 分？」，不是答案。"
                : "在 PainMap App 內，痛點以狀態分類，不以分數排名。"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => switchMode(mode === "teaching" ? "production" : "teaching")}
            className="text-[13px] text-secondary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded px-1"
          >
            {mode === "teaching" ? "切到生產模式 →" : "切到教學模式 →"}
          </button>
        </div>

        {/* Section 4 / 5: scores */}
        {mode === "teaching" ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-[20px] font-bold text-text-primary">
                第一步：5 維度反思評分
              </h2>
              <p className="text-[14px] text-text-secondary leading-[1.6] mt-1">
                這 5 個維度幫你檢視卡 1-8 的證據強度。每個維度問自己：「我為什麼給這個分數？」
              </p>
            </div>

            <ScoresForm values={scoreValues} onChange={setScore} />

            {/* total_score_display */}
            <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold text-text-primary">
                  總分
                </span>
                <span className="font-mono text-[20px] font-bold text-text-primary">
                  {total ?? "—"} <span className="text-[14px] text-text-muted">/ 25</span>
                </span>
              </div>
              {hint && (
                <div className="flex items-start gap-2 text-[13px] text-text-secondary leading-[1.55]">
                  <Lightbulb
                    className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span>下一步建議：{hint}</span>
                </div>
              )}
            </div>

            {/* teaching_warning */}
            <div className="flex items-start gap-3 rounded-lg border-2 border-caution/40 bg-caution/5 p-4">
              <AlertTriangle
                className="h-5 w-5 text-caution shrink-0 mt-0.5"
                aria-hidden
              />
              <div className="text-[14px] leading-[1.6] text-text-primary space-y-1">
                <p className="font-semibold">為什麼分數只是工具，不是答案？</p>
                <ul className="list-disc pl-5 space-y-0.5 text-text-secondary">
                  <li>24 分的痛點，仍可能是假痛點（你還沒真人訪談）</li>
                  <li>14 分的抱怨，仍可能是真痛點（你還沒挖深）</li>
                  <li>分數只訓練判斷力，不是給你答案。</li>
                  <li>答案永遠來自真人訪談（卡 8）。</li>
                </ul>
              </div>
            </div>
          </section>
        ) : (
          <ScoresSummary
            filled={scoresEval.filled}
            allFilled={scoresEval.allFilled}
            onSwitchToTeaching={() => switchMode("teaching")}
          />
        )}

        {/* Section 6: judgment_form */}
        <JudgmentForm
          judgment={v.judgment}
          onJudgmentChange={setJudgment}
          reason={v.reason_100w}
          onReasonChange={setReason}
          mostConfident={v.most_confident_evidence}
          onMostConfidentChange={setMost}
          leastConfident={v.least_confident}
          onLeastConfidentChange={setLeast}
          nextAction={v.next_action}
          onNextActionChange={setNextAction}
        />

        {/* 訪談目標自動預填：依 judgment + next_action 動態調整顯示 */}
        <InterviewTargetsPrefill
          targets={card.interview_plan.targets}
          judgment={v.judgment}
          nextAction={v.next_action}
        />

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo
            ? `已自動儲存到瀏覽器 · ${savedAgo}`
            : "尚未開始輸入"}
        </p>
      </main>

      <CardNineExitGateFooter
        scoresAllFilled={scoresEval.allFilled}
        judgmentChosen={judgmentChosen}
        reasonPassed={reasonPassed}
        nextActionChosen={nextActionChosen}
        reasonLen={reasonLen}
        reasonMin={REASON_MIN}
        judgment={v.judgment}
        blockedMessage={blockedMessage}
        submitting={submitting}
        onAdvance={handleAdvance}
        onBack={handleBack}
      />
    </div>
  );
}
