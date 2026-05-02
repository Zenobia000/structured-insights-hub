import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Edit, Sparkles } from "lucide-react";


import { AiPromptBlock } from "@/components/worksheet/card03/AiPromptBlock";
import { AiResponseInput } from "@/components/worksheet/card03/AiResponseInput";
import { ClarifyingQAPanel } from "@/components/worksheet/card03/ClarifyingQAPanel";
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
  }, [stuck.ai_polished, stuck.ai_clarifying_answers]);

  const setAiPolished = (v: string) =>
    updateField("stuck_formula.ai_polished", v.length > 0 ? v : null);

  // 變更 questions 時，同步重建 ai_clarifying_answers（保留既有答案）
  const setQuestions = (next: string[]) => {
    const prev = stuck.ai_clarifying_answers ?? [];
    const byQ = new Map(prev.map((a) => [a.question, a]));
    const rebuilt = next.map(
      (q) => byQ.get(q) ?? { question: q, answer: "", reserved: false },
    );
    updateField("stuck_formula.ai_clarifying_questions", next);
    updateField("stuck_formula.ai_clarifying_answers", rebuilt);
  };

  const setAnswerForQuestion = (question: string, answer: string) => {
    const prev = stuck.ai_clarifying_answers ?? [];
    const next = prev.map((a) =>
      a.question === question ? { ...a, answer } : a,
    );
    updateField("stuck_formula.ai_clarifying_answers", next);
  };

  const setReservedForQuestion = (question: string, reserved: boolean) => {
    const prev = stuck.ai_clarifying_answers ?? [];
    const next = prev.map((a) =>
      a.question === question ? { ...a, reserved } : a,
    );
    updateField("stuck_formula.ai_clarifying_answers", next);
  };

  const handleAdvance = () => {
    setAttempted(true);
    if (!checks.prereqReady) {
      setBlockedMessage("請先完成卡 1（抱怨原句）與卡 2（背景）。");
      return;
    }
    if (!checks.aiPolishedFilled || !checks.aiPolishedLongEnough) {
      setBlockedMessage("Step 2 請貼回 AI 整理後的卡關公式句（至少 15 字）。");
      return;
    }
    if (!checks.confirmed) {
      const remaining = checks.clarifying.totalCount - checks.clarifying.resolvedCount;
      setBlockedMessage(
        `還有 ${remaining} 題 AI 釐清問題未處理 — 請寫下回答（≥10 字）或勾「已預約找主人翁問」。`,
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

  const aiPolishedPass = checks.aiPolishedFilled && checks.aiPolishedLongEnough;

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
              <span className="font-semibold">流程：</span>
              複製 prompt → AI 把卡 1 抱怨整理成句型 → 你回答 AI 的釐清問題。AI 不替你發明細節。
            </div>
          </div>

          <p className="mt-4 text-[14.5px] leading-[1.65] text-text-secondary">
            最終會整理成的句型：<code className="font-mono px-1.5 py-0.5 rounded bg-muted-bg text-text-primary">「我每次要 [想做的事]，都會卡在 [障礙]。」</code>
          </p>
        </header>

        <div className="space-y-5">
          <AiPromptBlock prompt={prompt} prereqReady={checks.prereqReady} />

          <AiResponseInput
            aiPolished={stuck.ai_polished ?? ""}
            onAiPolishedChange={setAiPolished}
            questions={stuck.ai_clarifying_questions}
            onQuestionsChange={setQuestions}
          />

          <ClarifyingQAPanel
            questions={stuck.ai_clarifying_questions}
            answers={stuck.ai_clarifying_answers ?? []}
            items={checks.clarifying.items}
            resolvedCount={checks.clarifying.resolvedCount}
            totalCount={checks.clarifying.totalCount}
            onAnswerChange={setAnswerForQuestion}
            onReservedChange={setReservedForQuestion}
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
        aiPolishedPass={aiPolishedPass}
        confirmedPass={checks.confirmed}
        submitting={submitting}
        blockedMessage={blockedMessage}
        onAdvance={handleAdvance}
      />
    </div>
  );
}
