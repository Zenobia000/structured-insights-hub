import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Sparkles, ShieldOff, Award, MessageCircleQuestion } from "lucide-react";

import { useSavedAgo } from "@/hooks/useSavedAgo";
import { usePainCardStore } from "@/store/painCard";
import {
  REASON_MIN,
  defaultNextAction,
  judgmentToStatus,
} from "@/lib/cardNineValidators";
import type { Judgment, NextAction } from "@/types/painCard";
import { JudgmentForm } from "@/components/worksheet/card09/JudgmentForm";
import { CardNineExitGateFooter } from "@/components/worksheet/card09/CardNineExitGateFooter";
import { InterviewTargetsPrefill } from "@/components/worksheet/card09/InterviewTargetsPrefill";

const searchSchema = z.object({
  id: z.string().optional(),
});

const SOCRATIC_PROMPTS: string[] = [
  "你能不能說出 3 個有名字的人，他們各自怎麼遇到這個問題？",
  "你看到這事每週發生幾次？是你猜的，還是有人具體告訴你？",
  "他為這個問題付出了什麼（時間、錢、心力、關係）？最多的那個是什麼？",
  "他現在的解法，最讓他不爽的一個點是什麼？用他的話寫。",
  "你最有把握的證據是什麼？最薄弱的環節是什麼？",
];

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

function CardNinePage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const commitVerdict = usePainCardStore((s) => s.commitVerdict);

  const v = card.verdict;

  // setters
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

  // Exit gate
  const reasonLen = v.reason_100w.trim().length;
  const reasonPassed = reasonLen >= REASON_MIN;
  const judgmentChosen = v.judgment !== null;
  const nextActionChosen = v.next_action !== null;

  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBlockedMessage(null);
  }, [v.judgment, v.reason_100w, v.next_action]);

  function handleAdvance() {
    if (!judgmentChosen) {
      setBlockedMessage("想想看你選了哪一種判斷（真 / 假 / 待訪談）");
      return;
    }
    if (!reasonPassed) {
      setBlockedMessage(`再多寫 ${REASON_MIN - reasonLen} 字。具體說你看到 / 沒看到什麼`);
      return;
    }
    if (!nextActionChosen) {
      setBlockedMessage("想想看你之後最想做哪一件事");
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
  const savedAgo = useSavedAgo(card.updated_at);

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
            <ShieldOff className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">這張卡片 AI 完全不參與</p>
              <p>
                真假判斷是這套訓練的唯一交付物。AI 可以幫你蒐集證據（卡 6）、整理表（卡
                7）、模擬訪談（卡 8），但「真的嗎」「值得嗎」這兩題永遠是你來判。
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4">
            <Award className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">這份填空簿的唯一交付物</p>
              <p>你不需要做產品、不需要架網站、不需要收錢。你只需要交出這個書面判斷。</p>
            </div>
          </div>
        </header>

        {/* Socratic prompts — 純文字提示，不存欄位 */}
        <section
          aria-label="動筆前先想想這 5 件事"
          className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-3"
        >
          <div className="flex items-center gap-2">
            <MessageCircleQuestion className="h-5 w-5 text-secondary shrink-0" aria-hidden />
            <h2 className="text-[18px] font-bold text-text-primary">動筆前先想想這 5 件事</h2>
          </div>
          <p className="text-[13.5px] text-text-secondary leading-[1.6]">
            這幾題不用回答，先在腦袋裡走一遍。想清楚了，下面的書面判斷就會比較好下筆。
          </p>
          <ol className="space-y-2 list-decimal pl-5 text-[14.5px] text-text-primary leading-[1.7]">
            {SOCRATIC_PROMPTS.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </section>

        {/* judgment_form */}
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
          {hydrated && savedAgo ? `已自動儲存到瀏覽器 · ${savedAgo}` : "尚未開始輸入"}
        </p>
      </main>

      <CardNineExitGateFooter
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
