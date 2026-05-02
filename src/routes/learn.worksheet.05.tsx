import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GitMerge, Sparkles, AlertTriangle, AlertCircle } from "lucide-react";

import { TextField, TextareaField } from "@/components/worksheet/card01/FormFields";
import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { SixContradictionsPreview } from "@/components/worksheet/card05/SixContradictionsPreview";
import { TrizRadioSelector } from "@/components/worksheet/card05/TrizRadioSelector";
import { ExampleReferenceCard5 } from "@/components/worksheet/card05/ExampleReferenceCard5";
import { CardFiveExitGateFooter } from "@/components/worksheet/card05/CardFiveExitGateFooter";
import { evaluateCardFive } from "@/lib/cardFiveValidators";
import { getTrizById } from "@/lib/trizOptions";
import { usePainCardStore } from "@/store/painCard";
import type { TrizId } from "@/types/painCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/worksheet/05")({
  head: () => ({
    meta: [
      { title: "卡 5 兩件事不能同時要 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "從 6 種 TRIZ 矛盾中選 1 個最像的：拆出他想要的 A、B 兩件事，以及通常會犧牲哪邊。",
      },
    ],
  }),
  component: CardFivePage,
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

function CardFivePage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const c = card.contradiction;
  const checks = useMemo(() => evaluateCardFive(c), [c]);

  // Prompt 變數插值
  const stuck =
    card.stuck_formula.ai_polished?.trim() || card.stuck_formula.user_draft.trim();
  const workaroundStr = useMemo(() => {
    const w = card.workaround;
    const dis = w.user_dissatisfactions.filter(Boolean).join("、") || "（尚未填寫）";
    return `${w.tool_name || "（尚未填寫工具名）"} — ${w.why_still_stuck || "（尚未填寫卡點）"}（不滿：${dis}）`;
  }, [card.workaround]);

  const promptText = useMemo(
    () => `有一個人遇到這個卡關：
${stuck || "（請先到卡 3 填寫卡關公式）"}

他現在用：
${workaroundStr}

從以下 6 種「兩件事不能同時要」中，挑出最符合他的 1 種：

1. 想快但又想做得好
2. 想客製化但又想規模化
3. 想快但又想正確
4. 想很專業但又想新手好上手
5. 想自動化但又怕失控
6. 想多嘗試但又怕出包

請挑 1 個，並用主人翁的話說明這 2 件事在他身上具體是什麼。
不要挑超過 1 個。如果你覺得 6 個都不像，回答「不像，請我退回卡片 3」。`,
    [stuck, workaroundStr],
  );

  // Step 2 暫存（page-local，不寫進 PainCard schema）
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // 嘗試送出
  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [aiSaysNoneFit, setAiSaysNoneFit] = useState(false);

  // autosave
  const [savedAgo, setSavedAgo] = useState("");
  useEffect(() => {
    if (!card.updated_at) return;
    setSavedAgo(relativeTime(card.updated_at));
    const t = setInterval(() => setSavedAgo(relativeTime(card.updated_at)), 15_000);
    return () => clearInterval(t);
  }, [card.updated_at]);

  useEffect(() => {
    setBlockedMessage(null);
  }, [c.triz_id, c.side_a, c.side_b, c.sacrificed]);

  const setTriz = (id: TrizId) => {
    const o = getTrizById(id);
    updateField("contradiction.triz_id", id);
    updateField("contradiction.triz_label", o?.label ?? null);
  };
  const setSideA = (v: string) => updateField("contradiction.side_a", v);
  const setSideB = (v: string) => updateField("contradiction.side_b", v);
  const setSacrificed = (v: "a" | "b") => updateField("contradiction.sacrificed", v);

  const trizPass = checks.trizSelected === "pass";
  const sidesPass = checks.sideAFilled === "pass" && checks.sideBFilled === "pass";
  const sacrificedPass = checks.sacrificedSelected === "pass";
  const downstreamDisabled = !trizPass;

  const stuckOrWorkaroundMissing = !stuck || !card.workaround.tool_name.trim();

  const handleAdvance = () => {
    setAttempted(true);
    if (!trizPass) {
      setBlockedMessage(
        "請選 1 種矛盾。如果 6 個都不像，點下方「退回卡 3 重新拆」。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (checks.sideAFilled !== "pass" || checks.sideBFilled !== "pass") {
      setBlockedMessage(
        "兩端要具體（不是「想要好」「想要快」這種抽象詞）。每端至少 10 字。看林老師範例。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (!sacrificedPass) {
      setBlockedMessage("請選通常會犧牲哪邊。");
      setFailureCount((c) => c + 1);
      return;
    }

    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(6);
      navigate({ to: "/learn/worksheet/06" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetreat = () => {
    navigate({ to: "/learn/worksheet/03" });
  };

  const showRetreat = aiSaysNoneFit || (failureCount >= 3 && !trizPass);

  return (
    <div className="flex flex-col min-h-[calc(100vh-7.5rem)] bg-page">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 space-y-8">
        {/* card_intro */}
        <header>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 5 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/50 bg-verified/5 px-2 py-1 text-[11px] font-bold text-verified"
              aria-label="這張卡 AI 介入：TRIZ 提案"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：✅ TRIZ 提案
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            找出「兩件事不能同時要」
          </h1>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary-light/60 p-4">
            <GitMerge className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[15px] leading-[1.6] text-text-primary">
              <span className="font-semibold">為什麼這張卡關鍵：</span>
              很多痛點背後其實是「他想要兩件事，但只能選一個」。看清這個矛盾，後面才知道訪談要怎麼問、產品要怎麼切。
            </div>
          </div>

          <div className="mt-5">
            <SixContradictionsPreview />
          </div>
        </header>

        {stuckOrWorkaroundMissing && (
          <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary">
            <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>
              卡 3「卡關公式」或卡 4「現有解法」尚未填寫，下方 prompt 變數會缺。建議先補完。
            </span>
          </div>
        )}

        {/* Step 1 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 1：請 AI 從 6 種挑 1 個最像的
            </h2>
            <p className="mt-1 text-[14px] text-text-secondary leading-[1.6]">
              複製下方 prompt → 貼到外部 AI → 回來填 Step 2。
            </p>
          </div>

          <AIPromptCopyBlock
            prompt={promptText}
            response={aiResponse}
            onResponseChange={setAiResponse}
            title="🤖 AI 從 6 種挑 1 個"
          />
          <p className="text-[12px] text-text-muted">
            Prompt 來源：worksheet 卡片 5「🤖 AI 幫你提案」段落（逐字引用）
          </p>
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 2：AI 推薦的是哪個？（記下來）
            </h2>
            <p className="mt-1 text-[14px] text-text-secondary leading-[1.6]">
              這一格只是給你自己對照用，<span className="font-semibold">不會替你做選擇</span>。Step 3 才是正式選擇。
            </p>
          </div>

          <TextField
            id="ai_recommendation"
            label="AI 推薦的矛盾類型"
            helper="把 AI 推薦的編號（1-6）填這裡。如果 AI 回「不像」，勾下方核取方塊。"
            placeholder="2"
            value={aiRecommendation}
            onChange={setAiRecommendation}
          />
          <TextareaField
            id="ai_explanation"
            label="AI 用主人翁的話說明的版本"
            helper="貼 AI 的解釋（之後抄到 Step 3 的 A/B 兩端參考）"
            placeholder="A 端：家長要看見「我的孩子」… / B 端：老師一週只有 2-3 小時…"
            value={aiExplanation}
            onChange={setAiExplanation}
            rows={4}
            maxLength={800}
          />

          <label className="inline-flex items-start gap-2 text-[13.5px] text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={aiSaysNoneFit}
              onChange={(e) => setAiSaysNoneFit(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-secondary"
            />
            <span>AI 回「6 個都不像，請退回卡 3」— 顯示退回提示</span>
          </label>
        </section>

        {/* Step 3 */}
        <section className="space-y-5">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 3：確認選擇 + 填 A/B 兩端
            </h2>
          </div>

          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border-2 border-caution/40 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary"
          >
            <AlertTriangle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>
              <span className="font-bold">單選</span>（不可複選）— 複選代表你還沒拆乾淨，會被擋過關。如果你覺得超過一個，退回卡 3 再聊。
            </span>
          </div>

          <TrizRadioSelector
            value={c.triz_id}
            onChange={setTriz}
            highlight={attempted && !trizPass}
          />

          <div
            className={cn(
              "grid sm:grid-cols-2 gap-5 transition-opacity",
              downstreamDisabled && "opacity-50 pointer-events-none select-none",
            )}
            aria-disabled={downstreamDisabled}
          >
            <TextareaField
              id="side_a"
              label="A 端（他想要這個）"
              helper="選了矛盾後，A 端是什麼？用主人翁的話寫具體（≥ 10 字）"
              placeholder="家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
              value={c.side_a}
              onChange={setSideA}
              required
              rows={3}
              maxLength={300}
              error={
                attempted && checks.sideAFilled !== "pass"
                  ? "請寫具體（至少 10 字）"
                  : undefined
              }
              highlight={attempted && checks.sideAFilled !== "pass"}
            />
            <TextareaField
              id="side_b"
              label="B 端（他也想要這個）"
              helper="B 端是什麼？跟 A 端對立的另一邊（≥ 10 字）"
              placeholder="老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
              value={c.side_b}
              onChange={setSideB}
              required
              rows={3}
              maxLength={300}
              error={
                attempted && checks.sideBFilled !== "pass"
                  ? "請寫具體（至少 10 字）"
                  : undefined
              }
              highlight={attempted && checks.sideBFilled !== "pass"}
            />
          </div>

          <fieldset
            className={cn(
              "space-y-2 transition-opacity",
              downstreamDisabled && "opacity-50 pointer-events-none select-none",
            )}
            aria-disabled={downstreamDisabled}
          >
            <legend className="text-[18px] font-semibold text-text-primary">
              如果只能選一邊，他通常會犧牲哪邊？
              <span aria-hidden className="text-text-muted ml-1">*</span>
            </legend>
            <div className="flex flex-col sm:flex-row gap-2">
              {(["a", "b"] as const).map((v) => {
                const checked = c.sacrificed === v;
                return (
                  <label
                    key={v}
                    className={cn(
                      "flex-1 flex items-center gap-2 rounded-md border px-3 py-2.5 cursor-pointer",
                      "focus-within:ring-2 focus-within:ring-ring",
                      checked
                        ? "border-secondary bg-secondary/5"
                        : "border-border bg-surface hover:bg-muted-bg/40",
                    )}
                  >
                    <input
                      type="radio"
                      name="sacrificed"
                      value={v}
                      checked={checked}
                      onChange={() => setSacrificed(v)}
                      className="h-4 w-4 accent-secondary cursor-pointer"
                    />
                    <span className="text-[14.5px] text-text-primary font-medium">
                      犧牲 {v.toUpperCase()} 端
                    </span>
                  </label>
                );
              })}
            </div>
            {attempted && !sacrificedPass && (
              <p className="text-[12.5px] text-destructive">請選通常會犧牲哪邊</p>
            )}
          </fieldset>
        </section>

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo ? `已自動儲存到瀏覽器 · ${savedAgo}` : "尚未開始輸入"}
        </p>

        <ExampleReferenceCard5 />
      </main>

      <CardFiveExitGateFooter
        trizPass={trizPass}
        sidesPass={sidesPass}
        sacrificedPass={sacrificedPass}
        submitting={submitting}
        blockedMessage={blockedMessage}
        showRetreat={showRetreat}
        onAdvance={handleAdvance}
        onRetreat={handleRetreat}
      />
    </div>
  );
}
