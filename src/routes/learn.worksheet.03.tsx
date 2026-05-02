import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Edit, Sparkles } from "lucide-react";

import { UserDraftInput } from "@/components/worksheet/card03/UserDraftInput";
import { AiPromptBlock } from "@/components/worksheet/card03/AiPromptBlock";
import { AiResponseInput } from "@/components/worksheet/card03/AiResponseInput";
import { ConfirmationCheck } from "@/components/worksheet/card03/ConfirmationCheck";
import { ExampleReferenceCard3 } from "@/components/worksheet/card03/ExampleReferenceCard3";
import { CardThreeExitGateFooter } from "@/components/worksheet/card03/CardThreeExitGateFooter";
import {
  evaluateCardThree,
  interpolatePrompt,
} from "@/lib/cardThreeValidators";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/03")({
  head: () => ({
    meta: [
      { title: "卡 3 卡關公式 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "用「我每次要 X，都會卡在 Y」把抱怨變成卡關公式：你先寫初版，再讓 AI 校對並列出需要再問清楚的問題。",
      },
    ],
  }),
  component: CardThreePage,
});

function relativeTime(iso: string): string {
  if (!iso) return "";
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 5) return "剛剛";
  if (diffSec < 60) return `${diffSec} 秒前`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分鐘前`;
  return new Date(iso).toLocaleString("zh-TW", { hour: "2-digit", minute: "2-digit" });
}

function CardThreePage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const stuck = card.stuck_formula;

  const checks = useMemo(() => evaluateCardThree(card), [card]);

  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const prompt = useMemo(
    () => interpolatePrompt(card.complaint.verbatim, card.people.background),
    [card.complaint.verbatim, card.people.background],
  );

  const [savedAgo, setSavedAgo] = useState("");
  useEffect(() => {
    if (!card.updated_at) return;
    setSavedAgo(relativeTime(card.updated_at));
    const t = setInterval(() => setSavedAgo(relativeTime(card.updated_at)), 15_000);
    return () => clearInterval(t);
  }, [card.updated_at]);

  // 任意輸入變更後清除 blocked message
  useEffect(() => {
    setBlockedMessage(null);
  }, [stuck.user_draft, stuck.confirmed]);

  const setUserDraft = (v: string) => updateField("stuck_formula.user_draft", v);
  const setAiPolished = (v: string) =>
    updateField("stuck_formula.ai_polished", v.length > 0 ? v : null);
  const setQuestions = (v: string[]) =>
    updateField("stuck_formula.ai_clarifying_questions", v);
  const setConfirmed = (v: boolean) => updateField("stuck_formula.confirmed", v);

  const handleAdvance = () => {
    setAttempted(true);
    if (!checks.userDraftFilled || !checks.userDraftLongEnough) {
      setBlockedMessage("請至少寫一個完整的句型句（至少 15 字）。看下方林老師範例。");
      return;
    }
    if (!checks.confirmed) {
      setBlockedMessage(
        "請確認你能回答 AI 列的問題（或已預約找主人翁問）。如果都答不出來 → 退回卡 1。",
      );
      return;
    }
    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(4);
      navigate({ to: "/learn/worksheet/04" });
    } finally {
      setSubmitting(false);
    }
  };

  const userDraftPass = checks.userDraftFilled && checks.userDraftLongEnough;

  return (
    <div className="flex flex-col min-h-[calc(100vh-7.5rem)] bg-page">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* card intro */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 3 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/40 bg-verified/5 px-2 py-1 text-[11px] font-bold text-verified"
              aria-label="這張卡 AI 介入：校對 prompt"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：✅ 校對 prompt
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            把抱怨變成「卡關公式」
          </h1>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary-light/60 p-4">
            <Edit className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[15px] leading-[1.6] text-text-primary">
              <span className="font-semibold">規則：</span>
              你<span className="font-semibold">先</span>寫初版，再請 AI 校對 — 不是反過來。AI 不替你發明細節，但能幫你看出含糊處。
            </div>
          </div>

          <p className="mt-4 text-[14.5px] leading-[1.65] text-text-secondary">
            句型範本：<code className="font-mono px-1.5 py-0.5 rounded bg-muted-bg text-text-primary">「我每次要 [想做的事]，都會卡在 [障礙]。」</code>
          </p>
        </header>

        <div className="space-y-5">
          <UserDraftInput
            value={stuck.user_draft}
            onChange={setUserDraft}
            highlight={attempted && !userDraftPass}
          />

          <AiPromptBlock prompt={prompt} prereqReady={checks.prereqReady} />

          <AiResponseInput
            aiPolished={stuck.ai_polished ?? ""}
            onAiPolishedChange={setAiPolished}
            questions={stuck.ai_clarifying_questions}
            onQuestionsChange={setQuestions}
          />

          <ConfirmationCheck
            confirmed={stuck.confirmed}
            onConfirmedChange={setConfirmed}
            highlight={attempted && !checks.confirmed}
          />

          <p className="text-[12px] text-text-muted" aria-live="polite">
            {hydrated && savedAgo
              ? `已自動儲存到瀏覽器 · ${savedAgo}`
              : "尚未開始輸入"}
          </p>

          <ExampleReferenceCard3 />
        </div>
      </main>

      <CardThreeExitGateFooter
        userDraftPass={userDraftPass}
        confirmedPass={checks.confirmed}
        containsAbstract={checks.containsAbstract}
        submitting={submitting}
        blockedMessage={blockedMessage}
        onAdvance={handleAdvance}
      />
    </div>
  );
}
