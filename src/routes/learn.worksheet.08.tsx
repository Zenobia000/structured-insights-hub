import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Mic, AlertCircle } from "lucide-react";

import { usePainCardStore } from "@/store/painCard";
import {
  CONTACT_MIN,
  TARGETS_MAX,
  TARGETS_MIN,
  evaluateQuestions,
  evaluateTargets,
} from "@/lib/cardEightValidators";
import { CandidatesPanel } from "@/components/worksheet/card08/CandidatesPanel";
import { TargetsForm } from "@/components/worksheet/card08/TargetsForm";
import { QuestionForm } from "@/components/worksheet/card08/QuestionForm";
import { InterviewRulesTable } from "@/components/worksheet/card08/InterviewRulesTable";
import { AiSimulationBlock } from "@/components/worksheet/card08/AiSimulationBlock";
import { CardEightExitGateFooter } from "@/components/worksheet/card08/CardEightExitGateFooter";

export const Route = createFileRoute("/learn/worksheet/08")({
  head: () => ({
    meta: [
      { title: "卡 8 真人訪談規劃 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "規劃 2 位訪談對象、3 題非推銷題，並理解訪談禁忌。AI 不能取代真人訪談。",
      },
    ],
  }),
  component: CardEightPage,
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

function CardEightPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const plan = card.interview_plan;

  // 確保 targets 與 questions 至少有預設長度
  useEffect(() => {
    if (plan.targets.length < TARGETS_MIN) {
      const filled = [...plan.targets];
      while (filled.length < TARGETS_MIN) {
        filled.push({
          persona: "",
          contact_known: false,
          contact_info: "",
          planned_time: "",
        });
      }
      updateField("interview_plan.targets", filled);
    }
    if (plan.questions.length < 3) {
      const qs = [...plan.questions];
      while (qs.length < 3) qs.push("");
      updateField("interview_plan.questions", qs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // helpers
  const setTargetField = (
    i: number,
    field: "persona" | "contact_known" | "contact_info" | "planned_time",
    value: string | boolean,
  ) => {
    updateField(`interview_plan.targets.${i}.${field}`, value);
  };

  const addTarget = () => {
    if (plan.targets.length >= TARGETS_MAX) return;
    updateField("interview_plan.targets", [
      ...plan.targets,
      {
        persona: "",
        contact_known: false,
        contact_info: "",
        planned_time: "",
      },
    ]);
  };

  const removeTarget = (i: number) => {
    if (plan.targets.length <= TARGETS_MIN) return;
    const next = plan.targets.filter((_, idx) => idx !== i);
    updateField("interview_plan.targets", next);
  };

  const setQuestion = (i: number, v: string) => {
    const next = [...plan.questions];
    while (next.length < 3) next.push("");
    next[i] = v;
    updateField("interview_plan.questions", next);
  };

  const setTaboos = (v: boolean) =>
    updateField("interview_plan.interview_taboos_understood", v);

  const setAiResponse = (v: string) =>
    updateField("interview_plan.ai_simulated_response", v);

  // chip pick → fill first empty persona
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const handleChipPick = (persona: string) => {
    const targets = plan.targets;
    const emptyIdx = targets.findIndex((t) => !t.persona.trim());
    const idx = emptyIdx >= 0 ? emptyIdx : 0;
    updateField(`interview_plan.targets.${idx}.persona`, persona);
    setHighlightIndex(idx);
    setTimeout(() => setHighlightIndex(null), 1000);
  };

  // evaluators
  const targetsEval = useMemo(() => evaluateTargets(plan), [plan]);
  const questionsEval = useMemo(() => evaluateQuestions(plan), [plan]);
  const tablePassed = plan.interview_taboos_understood;
  const noContactAtAll = !targetsEval.anyContact;

  // exit gate
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBlockedMessage(null);
  }, [plan.targets, plan.questions, plan.interview_taboos_understood]);

  function handleAdvance() {
    if (!targetsEval.anyContact) {
      setBlockedMessage(
        `至少要有 1 位你能聯絡到的人（contact 欄位 ≥ ${CONTACT_MIN} 字）`,
      );
      return;
    }
    if (!questionsEval.allFilled) {
      setBlockedMessage("3 題都要寫完（每題 ≥ 15 字）");
      return;
    }
    if (!tablePassed) {
      setBlockedMessage("請看完訪談規則並勾選「我看完了」");
      return;
    }
    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(9);
      navigate({ to: "/learn/worksheet/09" });
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackToCard2() {
    advanceStep(2);
    navigate({ to: "/learn/worksheet/02" });
  }

  // autosave indicator
  const [savedAgo, setSavedAgo] = useState("");
  useEffect(() => {
    if (!card.updated_at) return;
    setSavedAgo(relativeTime(card.updated_at));
    const t = setInterval(() => setSavedAgo(relativeTime(card.updated_at)), 15_000);
    return () => clearInterval(t);
  }, [card.updated_at]);

  const stuckFormula = card.stuck_formula.ai_polished?.trim() ?? "";
  const q8Raw = card.ai_evidence.eight_answers.q8_interview_targets;

  // 補滿 targets / questions 在初次 render 之前
  const targetsForUi = useMemo(() => {
    const t = [...plan.targets];
    while (t.length < TARGETS_MIN) {
      t.push({
        persona: "",
        contact_known: false,
        contact_info: "",
        planned_time: "",
      });
    }
    return t;
  }, [plan.targets]);

  const questionsForUi = useMemo(() => {
    const qs = [...plan.questions];
    while (qs.length < 3) qs.push("");
    return qs;
  }, [plan.questions]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-7.5rem)] bg-page">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 space-y-8">
        {/* card_intro */}
        <header>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 8 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/50 bg-verified/5 px-2 py-1 text-[11px] font-bold text-verified"
              aria-label="這張卡 AI 介入：模擬訪談熱身（可選）"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：✅ 模擬訪談熱身（可選）
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            真人訪談規劃
          </h1>
          <p className="mt-3 text-[16px] leading-[1.65] text-text-secondary">
            AI 找到的證據是「文字痕跡」，不是「現場真實」。沉默、尷尬、害怕、猶豫、身體語言，AI 看不到。
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4">
            <Mic className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">為什麼還要訪談？</p>
              <p>
                真人訪談仍然是必要的。AI 只是讓你更快找到該訪談誰。判斷一個痛點是真是假，最後永遠來自真人對話。
              </p>
            </div>
          </div>
        </header>

        {/* Section 3: targets */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              第一步：挑 2 位訪談對象
            </h2>
            <p className="text-[14px] text-text-secondary leading-[1.6] mt-1">
              從卡 7 痛點判斷表 + 卡 6 第 8 題的人裡，選 2 種最容易聯絡到的。
            </p>
          </div>

          <CandidatesPanel q8Raw={q8Raw} onPick={handleChipPick} />

          <TargetsForm
            targets={targetsForUi}
            highlightIndex={highlightIndex}
            onUpdate={setTargetField}
            onAdd={addTarget}
            onRemove={removeTarget}
          />

          {noContactAtAll && (
            <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] text-text-primary">
              <AlertCircle
                className="h-4 w-4 text-caution shrink-0 mt-0.5"
                aria-hidden
              />
              <span>
                目前所有訪談對象都還沒有具體聯絡管道。如果你連 1 位都聯絡不到，建議
                <strong className="font-semibold"> 退回卡 2</strong> 補充你已認識的人。
              </span>
            </div>
          )}
        </section>

        {/* Section 4: questions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              第二步：寫 3 個訪談題
            </h2>
            <p className="text-[14px] text-text-secondary leading-[1.6] mt-1">
              不是推銷題。問他「你最近一次怎麼解」，不要問「你會用 App 嗎」。
            </p>
          </div>
          <QuestionForm questions={questionsForUi} onChange={setQuestion} />
        </section>

        {/* Section 5: rules */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              第三步：訪談規則（很重要）
            </h2>
          </div>
          <InterviewRulesTable
            understood={plan.interview_taboos_understood}
            onUnderstoodChange={setTaboos}
          />
        </section>

        {/* Section 6: AI simulation (optional) */}
        <AiSimulationBlock
          persona={targetsForUi[0]?.persona ?? ""}
          stuckFormula={stuckFormula}
          questions={questionsForUi}
          response={plan.ai_simulated_response}
          onResponseChange={setAiResponse}
        />

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo
            ? `已自動儲存到瀏覽器 · ${savedAgo}`
            : "尚未開始輸入"}
        </p>
      </main>

      <CardEightExitGateFooter
        hasContact={targetsEval.anyContact}
        questionsAllFilled={questionsEval.allFilled}
        taboosUnderstood={tablePassed}
        blockedMessage={blockedMessage}
        submitting={submitting}
        noContactAtAll={noContactAtAll}
        onAdvance={handleAdvance}
        onBackToCard2={handleBackToCard2}
      />
    </div>
  );
}
