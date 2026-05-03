import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AntiFakeCheckPanel } from "@/components/worksheet/card01/AntiFakeCheckPanel";
import { CardOneExitGateFooter } from "@/components/worksheet/card01/CardOneExitGateFooter";
import { ExampleReference } from "@/components/worksheet/card01/ExampleReference";
import { TextField, TextareaField } from "@/components/worksheet/card01/FormFields";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { useSavedAgo } from "@/hooks/useSavedAgo";
import {
  CARD_ONE_ANALYSIS_WORDS,
  detectAnalysisWords,
  evaluateCardOne,
  isForbiddenName,
} from "@/lib/cardOneValidators";
import { judge, toCacheEntry } from "@/lib/llmJudge";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/01")({
  head: () => ({
    meta: [
      { title: "卡 1 抱怨原句 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "把那句抱怨原原本本寫下來，不美化、不解釋、不分析 — AI 不能進來，因為有些事只有真人會說出口。",
      },
    ],
  }),
  component: CardOnePage,
});

function CardOnePage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const complaint = card.complaint;

  // 即時檢核
  const checks = useMemo(() => evaluateCardOne(complaint), [complaint]);
  const canAdvance =
    checks.allRequiredFilled === "pass" &&
    checks.noAnalysisWords === "pass" &&
    checks.realPerson === "pass";

  // 嘗試送出後才高亮系統錯誤與 blocked message（避免一進來就紅）
  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 自動儲存指示（每次 updated_at 變動就更新顯示，每 15 秒 refresh 相對時間）
  const savedAgo = useSavedAgo(card.updated_at);

  const handleAdvance = async () => {
    setAttempted(true);

    // 步驟 a：欄位填滿（純結構性，不走 LLM）
    if (checks.allRequiredFilled !== "pass") {
      const tooShort = complaint.verbatim.trim().length < 10;
      setBlockedMessage(
        tooShort
          ? "再去找他聊一次吧。一句話通常聽不完整個故事 — 把那一整段話寫下來。"
          : "5 個欄位都需要填。不確定怎麼下筆，下方有林老師的範例可以對照。",
      );
      return;
    }
    // 步驟 b：R2.1 — hardcoded warn 時請 LLM 二次確認原句是否摻入分析語
    if (checks.noAnalysisWords !== "pass") {
      setSubmitting(true);
      try {
        const outcome = await judge(
          "card1.analysis_words",
          complaint.verbatim,
          undefined,
          card.llm_cache,
        );
        if (outcome.source !== "fallback" && outcome.verdict === "pass") {
          const entry = toCacheEntry(outcome);
          if (entry) updateField("llm_cache.card1.analysis_words", entry);
        } else if (outcome.source !== "fallback") {
          setBlockedMessage(`再想想看：${outcome.reason}`);
          return;
        } else {
          const found = detectAnalysisWords(complaint.verbatim).join("、");
          setBlockedMessage(
            `這聽起來像你的解釋，不是他原本說的話（偵測到：「${found}」)。改寫成你具體聽到的句子，例如：「他在飯局上說『我每週都……』」`,
          );
          return;
        }
      } finally {
        setSubmitting(false);
      }
    }
    // 步驟 c：R2.2 — hardcoded warn 時請 LLM 二次確認 source_name 是否泛稱
    if (checks.realPerson !== "pass") {
      setSubmitting(true);
      try {
        const outcome = await judge(
          "card1.forbidden_source_name",
          complaint.source_name,
          undefined,
          card.llm_cache,
        );
        if (outcome.source !== "fallback" && outcome.verdict === "pass") {
          const entry = toCacheEntry(outcome);
          if (entry) updateField("llm_cache.card1.forbidden_source_name", entry);
        } else if (outcome.source !== "fallback") {
          setBlockedMessage(`再想想看：${outcome.reason}`);
          return;
        } else {
          setBlockedMessage(
            "「現代人」「上班族」「大家」不是某個你能聯絡到的人。填一個具體姓名（化名也可以，但要是真人）。如果你連一個名字都想不到 — 這還不是你的題目，先去找個真人聊聊再回來。",
          );
          return;
        }
      } finally {
        setSubmitting(false);
      }
    }

    // 全通過
    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(2);
      navigate({ to: "/learn/worksheet/02" });
    } finally {
      setSubmitting(false);
    }
  };

  // 5 欄位 onChange 直接寫 store（store 內已寫 LocalStorage）
  const set = (path: string) => (v: string) => updateField(`complaint.${path}`, v);

  // 個別欄位 inline warning
  const verbatimWarning = (() => {
    if (!complaint.verbatim) return null;
    const found = detectAnalysisWords(complaint.verbatim);
    if (found.length === 0) return null;
    return `這像是你的解釋,不是原句（偵測到:「${found.join("、")}」）。`;
  })();
  const verbatimError =
    attempted && complaint.verbatim.trim().length > 0 && complaint.verbatim.trim().length < 10
      ? "原句太短(至少 10 字)。"
      : null;

  const sourceNameWarning =
    complaint.source_name && isForbiddenName(complaint.source_name)
      ? "這是泛稱,不是具體姓名。請填可聯絡到的真人名字。"
      : null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-40">
        <WorksheetCardHeader
          cardNumber={1}
          aiStatus="disabled"
          title="把那句話原原本本寫下來"
          illustration="e1-knot-unraveling"
          illustrationAlt="一段糾結的線慢慢拉直 — 從混亂走向清楚"
          rule={
            <>
              <span className="font-semibold">規則：</span>
              一字不改寫下你聽到的原話 — 不美化、不解釋、不分析。一字不改，是對說那句話的人的尊重。
            </>
          }
          intro={
            <>
              你應該有聽過某人說：「欸，要是有人做一個 ___ 就好了！」這張卡只請你做一件事：
              <span className="font-semibold text-text-primary">忠實複述</span>。分析的事，留給後面
              8 張卡。
            </>
          }
        />

        {/* 70/30 layout — Desktop right sticky panel, Mobile stacked */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-start">
          {/* Form */}
          <section aria-labelledby="form-title" className="space-y-6">
            <h2 id="form-title" className="sr-only">
              5 個欄位
            </h2>

            <TextareaField
              id="verbatim"
              label="抱怨原句"
              helper="聽到的原句（一字不改）。如果你只記得大意,先去找他再聊一次。"
              placeholder="「我每週六晚上要寫 30 個學生的家長 LINE,常寫到半夜兩點。」"
              value={complaint.verbatim}
              onChange={set("verbatim")}
              required
              rows={4}
              maxLength={500}
              warning={verbatimWarning}
              error={verbatimError}
              highlight={
                attempted &&
                (complaint.verbatim.trim().length < 10 ||
                  detectAnalysisWords(complaint.verbatim).length > 0)
              }
            />

            <TextField
              id="source_name"
              label="是誰說的"
              helper="真人姓名（可化名,但要是你認識的具體一個人）。"
              placeholder="林老師"
              value={complaint.source_name}
              onChange={set("source_name")}
              required
              warning={sourceNameWarning}
              highlight={
                attempted && (!complaint.source_name || isForbiddenName(complaint.source_name))
              }
            />

            <TextField
              id="source_relation"
              label="你跟他的關係"
              helper="你怎麼認識他的？這影響你能不能找他第二次。"
              placeholder="我表妹的數學老師"
              value={complaint.source_relation}
              onChange={set("source_relation")}
              required
              highlight={attempted && !complaint.source_relation.trim()}
            />

            <TextField
              id="datetime"
              label="什麼時候說的"
              helper="日期或情境（例:「那次飯局」「上週六晚上」）。"
              placeholder="2026-04-15"
              value={complaint.datetime}
              onChange={set("datetime")}
              required
              highlight={attempted && !complaint.datetime.trim()}
            />

            <TextField
              id="scene"
              label="當時他在做什麼"
              helper="場景:他在做哪件事的時候說的？這個動作是觀察痛點的關鍵錨點。"
              placeholder="我陪他從 21:00 跟到 02:30 親眼看他寫"
              value={complaint.scene}
              onChange={set("scene")}
              required
              highlight={attempted && !complaint.scene.trim()}
            />

            {/* Autosave indicator */}
            <p
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary"
              aria-live="polite"
            >
              {hydrated && savedAgo ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                  Saved locally · {savedAgo}
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary" />
                  Not started yet
                </>
              )}
            </p>

            {/* Example reference (collapsed by default) */}
            <ExampleReference />

            {/* Mobile: anti-fake panel below form */}
            <div className="lg:hidden">
              <AntiFakeCheckPanel checks={checks} />
            </div>
          </section>

          {/* Right sticky anti-fake panel — Desktop only */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <AntiFakeCheckPanel checks={checks} />
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-2">
                Detected analysis words
              </p>
              <div className="flex flex-wrap gap-1">
                {CARD_ONE_ANALYSIS_WORDS.map((w) => (
                  <code
                    key={w}
                    className="inline-block font-mono text-[11px] px-1.5 py-0.5 rounded border border-border-hairline bg-canvas-raised text-text-tertiary"
                  >
                    {w}
                  </code>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <CardOneExitGateFooter
        allFilled={checks.allRequiredFilled === "pass"}
        noAnalysisWords={checks.noAnalysisWords === "pass"}
        realPerson={checks.realPerson === "pass"}
        submitting={submitting}
        blockedMessage={blockedMessage}
        onAdvance={handleAdvance}
      />

      {/* sr-only live status for whether ready */}
      <span className="sr-only" aria-live="polite">
        {canAdvance ? "可以走到卡 2 了" : "再多想一下"}
      </span>
    </div>
  );
}
