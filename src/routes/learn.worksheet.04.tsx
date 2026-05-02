import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Wrench, Sparkles, AlertCircle } from "lucide-react";

import { TextField, TextareaField } from "@/components/worksheet/card01/FormFields";
import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { TagInputField } from "@/components/worksheet/card04/TagInputField";
import { ExampleReferenceCard4 } from "@/components/worksheet/card04/ExampleReferenceCard4";
import { CardFourExitGateFooter } from "@/components/worksheet/card04/CardFourExitGateFooter";
import {
  evaluateCardFour,
  findForbiddenToolKeywords,
  findAbstractDissatisfactionKeywords,
} from "@/lib/cardFourValidators";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/04")({
  head: () => ({
    meta: [
      { title: "卡 4 現在怎麼解 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "找出主人翁現在用什麼方法解這個痛點。AI 提案 5 個常見 workaround，但不滿理由必須來自真人。",
      },
    ],
  }),
  component: CardFourPage,
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

function CardFourPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const markAsDraft = usePainCardStore((s) => s.markAsDraft);

  const w = card.workaround;

  const checks = useMemo(() => evaluateCardFour(w), [w]);

  const stuckPolished =
    card.stuck_formula.ai_polished?.trim() ?? "";

  const promptText = useMemo(() => {
    const stuck = stuckPolished || "（請先到卡 3 填寫卡關公式）";
    return `有一個人遇到這個卡關：
${stuck}

請列出 5 個常見的 workaround（他可能正在用的解法）。

規則：
1. 每個都要有具體名字（工具名、流程名、做法名）
2. 不要包含「沒人解過」「會自己想辦法」這種空話
3. 如果你不確定，標註 [推測]
4. 不要建議我做新的工具`;
  }, [stuckPolished]);

  // 試圖送出
  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failureCount, setFailureCount] = useState(0);

  // autosave
  const [savedAgo, setSavedAgo] = useState("");
  useEffect(() => {
    if (!card.updated_at) return;
    setSavedAgo(relativeTime(card.updated_at));
    const t = setInterval(() => setSavedAgo(relativeTime(card.updated_at)), 15_000);
    return () => clearInterval(t);
  }, [card.updated_at]);

  // 任意輸入後清除 blocked message
  useEffect(() => {
    setBlockedMessage(null);
  }, [
    w.tool_name,
    w.why_still_stuck,
    w.ai_alternatives.length,
    w.user_dissatisfactions.length,
  ]);

  const setTool = (v: string) => updateField("workaround.tool_name", v);
  const setWhy = (v: string) => updateField("workaround.why_still_stuck", v);
  const setAlternatives = (v: string[]) => updateField("workaround.ai_alternatives", v);
  const setDissatisfactions = (v: string[]) =>
    updateField("workaround.user_dissatisfactions", v);

  // 內嵌 AIPromptCopyBlock 需要 response slot — 我們把 response 暫存到 alternatives 旁邊（page-local）
  const [aiResponse, setAiResponse] = useState("");

  const forbiddenHits = findForbiddenToolKeywords(w.tool_name);
  const abstractHits = useMemo(
    () =>
      Array.from(
        new Set(
          w.user_dissatisfactions.flatMap((d) =>
            findAbstractDissatisfactionKeywords(d),
          ),
        ),
      ),
    [w.user_dissatisfactions],
  );

  const toolNamePass =
    checks.toolNameFilled === "pass" &&
    checks.toolNameNotForbidden === "pass" &&
    checks.whyStillStuckFilled === "pass";
  const dissatisfactionsPass = checks.dissatisfactionsEnough === "pass";
  const forbiddenTriggered = checks.toolNameNotForbidden === "warn";

  const handleAdvance = () => {
    setAttempted(true);

    if (forbiddenTriggered) {
      setBlockedMessage(
        `「${forbiddenHits.join("、")}」代表這個人可能還沒在花時間解這個問題。請考慮退回卡 1。`,
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (checks.toolNameFilled !== "pass") {
      setBlockedMessage(
        "請填具體工具/方法名（≥ 3 字，例：『Notion 模板』『Excel + 翻群組』）。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (checks.whyStillStuckFilled !== "pass") {
      setBlockedMessage("請用主人翁的話說明為什麼還是覺得卡（≥ 5 字）。");
      setFailureCount((c) => c + 1);
      return;
    }
    if (!dissatisfactionsPass) {
      setBlockedMessage(
        "需要至少 3 個具體不滿理由。如果只能列 1-2 個 → 拿 AI 清單回去問主人翁，看他有沒有試過其他方法。",
      );
      setFailureCount((c) => c + 1);
      return;
    }

    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(5);
      navigate({ to: "/learn/worksheet/05" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetreat = () => {
    markAsDraft();
    navigate({ to: "/learn/worksheet/01" });
  };

  const stuckMissing = !stuckPolished;

  return (
    <div className="flex flex-col min-h-[calc(100vh-7.5rem)] bg-page">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 space-y-8">
        {/* Card intro */}
        <header>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 4 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/50 bg-verified/5 px-2 py-1 text-[11px] font-bold text-verified"
              aria-label="這張卡 AI 介入：提案 5 個 workaround"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：✅ 提案 5 個 workaround
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            找出他「現在怎麼解」
          </h1>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary-light/60 p-4">
            <Wrench className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[15px] leading-[1.6] text-text-primary">
              <span className="font-semibold">為什麼這張卡關鍵：</span>
              如果他現在沒有用任何方法在解 → 痛點可能不夠痛。如果他用了好幾個方法都不滿意 → 真痛點可能在這裡。
            </div>
          </div>

          <p className="mt-4 text-[15px] leading-[1.65] text-text-secondary">
            這張卡會做 4 步：① 你先憑訪談寫 → ② AI 提案 5 個常見 workaround → ③ 你貼回 AI 提案 → ④ 拿 AI 清單去問主人翁，填回 3 個不滿理由
          </p>
        </header>

        {stuckMissing && (
          <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary">
            <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>
              還沒填卡 3「卡關公式」，下方 prompt 會缺變數。建議先回卡 3 完成。
            </span>
          </div>
        )}

        {/* Step 1 */}
        <section className="space-y-5">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 1：你從訪談聽到的（先寫）
            </h2>
            <p className="mt-1 text-[14px] text-text-secondary leading-[1.6]">
              從卡 1-3 你聽到的，主人翁現在用什麼解這個問題？可能是：一個工具、一個人、一個習慣動作、一個 Excel 表。
            </p>
          </div>

          <TextField
            id="tool_name"
            label="工具/方法的名字"
            helper="必須有具體名字（不可寫「沒人解過」「會自己想辦法」）"
            placeholder="LINE + Excel 成績表 + 翻群組對話（手動拼湊）"
            value={w.tool_name}
            onChange={setTool}
            required
            warning={
              forbiddenTriggered
                ? `偵測到「${forbiddenHits.join("、")}」— 這代表這個人沒在花時間解 → 退回卡 1`
                : undefined
            }
            error={
              attempted && checks.toolNameFilled !== "pass" && !forbiddenTriggered
                ? "請填具體名字（至少 3 字）"
                : undefined
            }
            highlight={attempted && !toolNamePass}
          />

          <TextareaField
            id="why_still_stuck"
            label="為什麼還是覺得卡"
            helper="用主人翁告訴你的話，不是你的解釋"
            placeholder="每個資料源都要重新翻找，沒辦法一次看完"
            value={w.why_still_stuck}
            onChange={setWhy}
            required
            rows={3}
            maxLength={300}
            error={
              attempted && checks.whyStillStuckFilled !== "pass"
                ? "請寫至少 5 個字"
                : undefined
            }
            highlight={attempted && checks.whyStillStuckFilled !== "pass"}
          />
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 2：AI 提案其他 5 個常見 workaround
            </h2>
            <p className="mt-1 text-[14px] text-text-secondary leading-[1.6]">
              複製下方 prompt → 貼到 ChatGPT / Claude / Perplexity / Gemini → 把 AI 列的 5 個貼回 Step 3。
            </p>
          </div>

          <AIPromptCopyBlock
            prompt={promptText}
            response={aiResponse}
            onResponseChange={setAiResponse}
            title="🤖 AI 幫你補充其他可能"
          />

          <p className="text-[12px] text-text-muted">
            Prompt 來源：worksheet 卡片 4 「🤖 AI 幫你補充其他可能」段落（逐字引用）
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 3：把 AI 提案的 5 個貼回
            </h2>
          </div>

          <TagInputField
            id="ai_alternatives"
            label="AI 列的 5 個常見 workaround"
            helper="每個 workaround 加一個標籤（Enter 鍵新增）。≥ 3 個即可"
            placeholder="Notion 模板"
            values={w.ai_alternatives}
            onChange={setAlternatives}
            minCount={3}
            maxCount={10}
          />
        </section>

        {/* Step 4 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-[20px] font-bold text-text-primary">
              Step 4：拿 AI 清單去問主人翁，填回 3 個不滿理由
            </h2>
          </div>

          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border-2 border-accent/40 bg-accent/10 p-4"
          >
            <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary">
              <span className="font-bold">這一步是真實性的關鍵。</span>
              把 AI 列的 5 個 workaround 拿去問主人翁：「這幾個你有用過嗎？哪個最像你的狀況？」然後
              <span className="font-semibold">寫下他不滿意現有方法的具體理由（≥ 3 個）</span>。
              這一步可能要花幾天等主人翁回覆 — 頁面會自動儲存。
            </div>
          </div>

          <TagInputField
            id="user_dissatisfactions"
            label="主人翁不滿意現有方法的具體理由（≥ 3 個）"
            helper="要具體（不是「不好用」「不方便」這種抽象詞）"
            placeholder="Notion 試過 1 個月放棄，太花時間貼來貼去"
            values={w.user_dissatisfactions}
            onChange={setDissatisfactions}
            required
            minCount={3}
            maxCount={15}
            warning={
              abstractHits.length > 0
                ? `「${abstractHits.join("、")}」太抽象。具體是哪一步、卡多久、有什麼後果？`
                : null
            }
            highlight={attempted && !dissatisfactionsPass}
          />
        </section>

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo ? `已自動儲存到瀏覽器 · ${savedAgo}` : "尚未開始輸入"}
        </p>

        <ExampleReferenceCard4 />
      </main>

      <CardFourExitGateFooter
        toolNamePass={toolNamePass}
        dissatisfactionsPass={dissatisfactionsPass}
        submitting={submitting}
        blockedMessage={blockedMessage}
        failureCount={failureCount}
        forbiddenTriggered={forbiddenTriggered}
        onAdvance={handleAdvance}
        onRetreat={handleRetreat}
      />
    </div>
  );
}
