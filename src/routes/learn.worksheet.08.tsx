import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Mic, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useSavedAgo } from "@/hooks/useSavedAgo";
import { usePainCardStore } from "@/store/painCard";
import {
  CONTACT_MIN,
  PERSONA_MIN,
  PLANNED_MIN,
  TARGETS_MAX,
  TARGETS_MIN,
  evaluateQuestions,
  evaluateTargets,
} from "@/lib/cardEightValidators";
import { judge, toCacheEntry } from "@/lib/llmJudge";
import { CandidatesPanel } from "@/components/worksheet/card08/CandidatesPanel";
import { TargetsForm } from "@/components/worksheet/card08/TargetsForm";
import { QuestionForm } from "@/components/worksheet/card08/QuestionForm";
import { InterviewRulesTable } from "@/components/worksheet/card08/InterviewRulesTable";
import { InterviewSimulationFlow } from "@/components/worksheet/card08/InterviewSimulationFlow";
import { CardEightExitGateFooter } from "@/components/worksheet/card08/CardEightExitGateFooter";

export const Route = createFileRoute("/learn/worksheet/08")({
  head: () => ({
    meta: [
      { title: "卡 8 真人訪談規劃 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "想清楚要找誰聊 2 位、要問哪 3 題，再讀過訪談禁忌。AI 看不到沉默和猶豫 — 那些只有真人對話會出現。",
      },
    ],
  }),
  component: CardEightPage,
});

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

  const addTargetFromTemplate = (tpl: { data: typeof plan.targets[number] }) => {
    if (plan.targets.length >= TARGETS_MAX) return;
    const next = [...plan.targets, { ...tpl.data }];
    updateField("interview_plan.targets", next);
    const newIdx = next.length - 1;
    setHighlightIndex(newIdx);

    // 套用範本後立刻檢查每個欄位是否真的通過,
    // 若沒通過 → toast 顯示具體缺少原因,並捲動 / focus 到第一個失敗欄位
    const t = next[newIdx];
    const personaLen = t.persona.trim().length;
    const contactLen = t.contact_info.trim().length;
    const plannedLen = t.planned_time.trim().length;

    type Issue = {
      field: "persona" | "contact" | "planned";
      label: string;
      need: number;
      have: number;
    };
    const issues: Issue[] = [];
    if (personaLen < PERSONA_MIN)
      issues.push({ field: "persona", label: "Persona", need: PERSONA_MIN, have: personaLen });
    if (contactLen < CONTACT_MIN)
      issues.push({
        field: "contact",
        label: t.contact_known ? "聯絡方式" : "去哪找他",
        need: CONTACT_MIN,
        have: contactLen,
      });
    if (plannedLen < PLANNED_MIN)
      issues.push({ field: "planned", label: "預計時間", need: PLANNED_MIN, have: plannedLen });

    // 第一個要 focus 的欄位:依 persona → contact → planned 順序
    const firstField = issues[0]?.field ?? "contact";
    const elementId = `${firstField === "planned" ? "planned" : firstField}-${newIdx}`;

    requestAnimationFrame(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => (el as HTMLElement).focus(), 350);
      }
    });

    if (issues.length > 0) {
      const lines = issues.map(
        (it) => `• ${it.label}：還差 ${it.need - it.have} 字（目前 ${it.have} / ${it.need}）`,
      );
      toast.warning("範本已加入,但有欄位還沒過關", {
        description: `把【方括號】內的占位字換成你的真實資料:\n${lines.join("\n")}`,
        duration: 6000,
      });
    } else {
      toast.success("範本已加入,所有欄位都已通過 ✓", {
        description: "記得把【方括號】內的占位字改成你的真實資料,讓對方真的找得到。",
        duration: 4500,
      });
    }

    window.setTimeout(() => setHighlightIndex(null), 2500);
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

  const setTaboos = (v: boolean) => updateField("interview_plan.interview_taboos_understood", v);

  const setAiResponse = (v: string) => updateField("interview_plan.ai_simulated_response", v);
  const setAuditFindings = (v: string) => updateField("interview_plan.ai_audit_findings", v);
  const setInterviewGuide = (v: string) => updateField("interview_plan.interview_guide_md", v);
  const markGuideGenerated = () =>
    updateField("interview_plan.guide_generated_at", new Date().toISOString());

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

  /**
   * 跳到第一個缺『聯絡方式』的訪談對象 → 高亮卡片 + 捲動 + focus 該欄位
   * 用在 footer 的「帶我去填」按鈕、以及 advance 卡住時自動觸發
   */
  const jumpToMissingContact = () => {
    const targets = plan.targets;
    // 優先找「persona 已寫但 contact 還沒填」的；其次第一個空的；都沒有就 0
    const partialIdx = targets.findIndex(
      (t) => t.persona.trim().length > 0 && t.contact_info.trim().length < CONTACT_MIN,
    );
    const emptyIdx = targets.findIndex((t) => t.contact_info.trim().length < CONTACT_MIN);
    const idx = partialIdx >= 0 ? partialIdx : emptyIdx >= 0 ? emptyIdx : 0;

    setHighlightIndex(idx);
    // 等 React 重 render 完再抓 DOM
    requestAnimationFrame(() => {
      const el = document.getElementById(`contact-${idx}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // 滾動到位再 focus（避免捲動被 focus 中斷）
        setTimeout(() => {
          (el as HTMLTextAreaElement).focus({ preventScroll: true });
        }, 350);
      }
    });
    // 高亮維持 2.5 秒,給使用者視覺停留
    setTimeout(() => setHighlightIndex(null), 2500);
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

  async function handleAdvance() {
    if (!targetsEval.anyContact) {
      setBlockedMessage(`至少要有 1 位你聯絡得到的人(contact 欄位 ≥ ${CONTACT_MIN} 字)`);
      jumpToMissingContact();
      return;
    }
    if (!questionsEval.allFilled) {
      setBlockedMessage("3 題都需要寫完（每題 ≥ 15 字）");
      return;
    }
    if (!tablePassed) {
      setBlockedMessage("讀完訪談規則之後，勾選「我看完了」");
      return;
    }

    // 結構性 gate 都過 → LLM 二次確認 3 題訪談題是否誘導 / 推銷
    setSubmitting(true);
    try {
      const outcome = await judge(
        "card8.no_selling_questions",
        plan.questions.join("\n"),
        undefined,
        card.llm_cache,
      );
      if (outcome.source !== "fallback" && outcome.verdict === "warn") {
        setBlockedMessage(`UX 研究員看了一眼：${outcome.reason}`);
        return;
      }
      if (outcome.source !== "fallback" && outcome.verdict === "pass") {
        const entry = toCacheEntry(outcome);
        if (entry) updateField("llm_cache.card8.no_selling_questions", entry);
      }
      // fallback → 既有行為（放行）
    } finally {
      setSubmitting(false);
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
  const savedAgo = useSavedAgo(card.updated_at);

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
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32 space-y-8">
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
            想清楚你要找誰，去聊一場
          </h1>
          <p className="mt-3 text-[16px] leading-[1.65] text-text-secondary">
            AI 看到的是文字痕跡，不是現場真實。沉默、尷尬、害怕、猶豫、身體語言這些 —
            只有面對面才會浮出來。
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4">
            <Mic className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">為什麼跑了 AI 還要再訪談？</p>
              <p>
                真人訪談永遠必要。AI 是來幫你更快找到「該找誰聊」 —
                但判斷一個痛點是真是假，最後一定要從真人嘴裡聽到。
              </p>
            </div>
          </div>
        </header>

        {/* Section 3: targets */}
        <section id="card8-targets" className="space-y-4 scroll-mt-24">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">第一步：挑 2 位訪談對象</h2>
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
            onAddFromTemplate={addTargetFromTemplate}
            onRemove={removeTarget}
          />

          {noContactAtAll && (
            <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] text-text-primary">
              <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
              <span>
                目前所有訪談對象都還沒有具體聯絡管道。如果你連 1 位都聯絡不到，建議
                <strong className="font-semibold"> 回去把卡 2 想清楚再來</strong> 補充你已認識的人。
              </span>
            </div>
          )}
        </section>

        {/* Section 4: questions */}
        <section id="card8-questions" className="space-y-4 scroll-mt-24">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">第二步：寫 3 個訪談題</h2>
            <p className="text-[14px] text-text-secondary leading-[1.6] mt-1">
              不是推銷題。問他「你最近一次怎麼解」，不要問「你會用 App 嗎」。
            </p>
          </div>
          <QuestionForm questions={questionsForUi} onChange={setQuestion} />
        </section>

        {/* Section 5: rules */}
        <section id="card8-rules" className="space-y-4 scroll-mt-24">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">第三步：訪談規則（很重要）</h2>
          </div>
          <InterviewRulesTable
            understood={plan.interview_taboos_understood}
            onUnderstoodChange={setTaboos}
          />
        </section>

        {/* Section 6: 三階段虛擬訪談 → 訪綱產出（全 optional） */}
        <InterviewSimulationFlow
          card={card}
          onSimulationChange={setAiResponse}
          onAuditChange={setAuditFindings}
          onGuideChange={setInterviewGuide}
          onGuideGenerated={markGuideGenerated}
        />

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo ? `已悄悄存進你的瀏覽器 · ${savedAgo}` : "還沒開始寫"}
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
        onJumpToMissingContact={jumpToMissingContact}
      />
    </div>
  );
}
