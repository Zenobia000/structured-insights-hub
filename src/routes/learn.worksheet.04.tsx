import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import { TextField, TextareaField } from "@/components/worksheet/card01/FormFields";
import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { TagInputField } from "@/components/worksheet/card04/TagInputField";
import { ExampleReferenceCard4 } from "@/components/worksheet/card04/ExampleReferenceCard4";
import { CardFourExitGateFooter } from "@/components/worksheet/card04/CardFourExitGateFooter";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  evaluateCardFour,
  findForbiddenToolKeywords,
  findAbstractDissatisfactionKeywords,
} from "@/lib/cardFourValidators";
import { detectSolutionModeWords } from "@/lib/cardFourAiParsers";
import { judge, toCacheEntry } from "@/lib/llmJudge";
import { useSavedAgo } from "@/hooks/useSavedAgo";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/04")({
  head: () => ({
    meta: [
      { title: "卡 4 現在怎麼解 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "看看主人翁現在用什麼方法在解這個痛點。AI 可以提案 5 個常見 workaround，但「不滿在哪」這件事必須從真人嘴裡聽到。",
      },
    ],
  }),
  component: CardFourPage,
});

function CardFourPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const markAsDraft = usePainCardStore((s) => s.markAsDraft);

  const w = card.workaround;

  const checks = useMemo(() => evaluateCardFour(w), [w]);

  const stuckPolished = card.stuck_formula.ai_polished?.trim() ?? "";

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
  const savedAgo = useSavedAgo(card.updated_at);

  // 任意輸入後清除 blocked message
  useEffect(() => {
    setBlockedMessage(null);
  }, [w.tool_name, w.why_still_stuck, w.ai_alternatives.length, w.user_dissatisfactions.length]);

  const setTool = (v: string) => updateField("workaround.tool_name", v);
  const setWhy = (v: string) => updateField("workaround.why_still_stuck", v);
  const setAlternatives = (v: string[]) => updateField("workaround.ai_alternatives", v);
  const setDissatisfactions = (v: string[]) => updateField("workaround.user_dissatisfactions", v);

  // 內嵌 AIPromptCopyBlock 需要 response slot — 我們把 response 暫存到 alternatives 旁邊（page-local）
  const [aiResponse, setAiResponse] = useState("");

  const forbiddenHits = findForbiddenToolKeywords(w.tool_name);
  const abstractHits = useMemo(
    () =>
      Array.from(
        new Set(w.user_dissatisfactions.flatMap((d) => findAbstractDissatisfactionKeywords(d))),
      ),
    [w.user_dissatisfactions],
  );

  const toolNamePass =
    checks.toolNameFilled === "pass" &&
    checks.toolNameNotForbidden === "pass" &&
    checks.whyStillStuckFilled === "pass";
  const aiAlternativesPass = checks.aiAlternativesEnough === "pass";
  const dissatisfactionsPass = checks.dissatisfactionsEnough === "pass";
  const forbiddenTriggered = checks.toolNameNotForbidden === "warn";

  // 偵測 AI 回應中的「solution mode」禁詞 — 顯示 inline warning，不擋
  const solutionModeHits = useMemo(() => detectSolutionModeWords(aiResponse), [aiResponse]);

  // 設計決策：不做 auto-parse — AI 輸出格式（bullet / 編號 / markdown / 段落）
  // 變化太大，正則拆解總會留下垃圾項目（介紹語、結語、markdown 標記、拆碎的編號）。
  // 強迫使用者手動把 5 個項目逐一鍵入 TagInputField — 多花 5 秒、無雜訊、與 Card 3 一致。

  const handleAdvance = async () => {
    setAttempted(true);

    // 「沒人解過 / 自己想辦法」這類 hardcoded 命中 — 請 LLM 看完整 context 二次確認
    // 救援情境：使用者寫「沒人解過，但他每天還是試 Notion/Excel」應該被放行
    if (forbiddenTriggered) {
      setSubmitting(true);
      try {
        const outcome = await judge(
          "card4.tool_is_real_attempt",
          w.tool_name,
          w.why_still_stuck,
          card.llm_cache,
        );
        if (outcome.source !== "fallback" && outcome.verdict === "pass") {
          const entry = toCacheEntry(outcome);
          if (entry) updateField("llm_cache.card4.tool_is_real_attempt", entry);
        } else if (outcome.source !== "fallback") {
          setBlockedMessage(`再想想看：${outcome.reason}`);
          setFailureCount((c) => c + 1);
          return;
        } else {
          setBlockedMessage(
            `「${forbiddenHits.join("、")}」代表他可能還沒花時間解這個問題 — 也許這還不夠痛。回卡 1 再想清楚一點再來。`,
          );
          setFailureCount((c) => c + 1);
          return;
        }
      } finally {
        setSubmitting(false);
      }
    }
    if (checks.toolNameFilled !== "pass") {
      setBlockedMessage(
        "填一個具體的工具或方法名（≥ 3 字，例：『Notion 模板』『Excel + 翻群組』）。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (checks.whyStillStuckFilled !== "pass") {
      setBlockedMessage("用主人翁的話寫，他為什麼還是覺得卡（≥ 5 字）。");
      setFailureCount((c) => c + 1);
      return;
    }
    if (!aiAlternativesPass) {
      setBlockedMessage(
        "Step 2 複製 prompt 給 AI，把回的 5 個 workaround 貼回 Step 3（至少 3 個）。沒走過 AI 一輪，難判斷你寫的工具是不是真的。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (!dissatisfactionsPass) {
      setBlockedMessage(
        "至少需要 3 個具體的不滿理由。只能列出 1-2 個的話 — 帶著 AI 清單回去問主人翁，看他有沒有試過其他方法。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    // dissatisfactions 數量夠但抽象詞太多 — LLM 二次確認具體性
    if (abstractHits.length > 0) {
      setSubmitting(true);
      try {
        const outcome = await judge(
          "card4.dissatisfactions_concrete",
          w.user_dissatisfactions.join("\n"),
          undefined,
          card.llm_cache,
        );
        if (outcome.source !== "fallback" && outcome.verdict === "pass") {
          const entry = toCacheEntry(outcome);
          if (entry) updateField("llm_cache.card4.dissatisfactions_concrete", entry);
        } else if (outcome.source !== "fallback") {
          setBlockedMessage(`再想想看：${outcome.reason}`);
          setFailureCount((c) => c + 1);
          return;
        }
        // LLM fallback 時不擋（這原本只是 inline warning，不是 hard gate）
      } finally {
        setSubmitting(false);
      }
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
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-40 space-y-10">
        <WorksheetCardHeader
          cardNumber={4}
          aiStatus="required"
          title="他現在到底怎麼解這個問題？"
          illustration="e2-fake-pain-anatomy"
          illustrationAlt="假痛點被解剖如昆蟲標本 — 19 世紀科學蝕刻風"
          rule={
            <>
              <span className="font-semibold">為什麼要看這個：</span>
              如果他根本沒在花時間解 → 這個痛可能還不夠痛。如果他試了好幾個方法都不滿意 →
              真痛點可能就藏在那些「不滿」裡。
            </>
          }
          intro={
            <>
              這張卡分 4 步走：① 你先憑訪談寫一個版本 → ② AI 補 5 個常見 workaround → ③ 讀 AI
              回應，把 5 個 workaround 逐項鍵入（必填，不可跳過） → ④ 帶著 AI
              清單再去問主人翁，把他「不滿在哪」的 3 個具體理由帶回來。
            </>
          }
        />

        {stuckMissing && (
          <div className="flex items-start gap-2.5 rounded-md border border-status-warning/40 px-3.5 py-3 text-[13.5px] leading-[1.6] text-text-primary">
            <AlertCircle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" aria-hidden />
            <span>還沒填卡 3「卡關公式」，下方 prompt 會缺變數。建議先回卡 3 完成。</span>
          </div>
        )}

        {/* Step 1 */}
        <section className="space-y-5">
          <div>
            <Eyebrow variant="numbered" index={1}>
              Step · from interview
            </Eyebrow>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.01em] text-text-primary">
              你從訪談聽到的（先寫）
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary leading-[1.65]">
              從卡 1-3
              你聽到的，主人翁現在用什麼解這個問題？可能是：一個工具、一個人、一個習慣動作、一個
              Excel 表。
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
                ? `偵測到「${forbiddenHits.join("、")}」— 這代表這個人沒在花時間解 → 回去把卡 1 想清楚再來`
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
              attempted && checks.whyStillStuckFilled !== "pass" ? "請寫至少 5 個字" : undefined
            }
            highlight={attempted && checks.whyStillStuckFilled !== "pass"}
          />
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <div>
            <Eyebrow variant="numbered" index={2}>
              Step · AI required
            </Eyebrow>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.01em] text-text-primary">
              AI 提案其他 5 個常見 workaround
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary leading-[1.65]">
              複製下方 prompt → 貼到 ChatGPT / Claude / Perplexity / Gemini → 把 AI
              的回應貼回左側方框（僅供你檢視，不會被自動處理）。讀完後到下方 Step 3 把 5
              個逐項輸入。
            </p>
          </div>

          <AIPromptCopyBlock
            prompt={promptText}
            response={aiResponse}
            onResponseChange={setAiResponse}
            title="🤖 AI 幫你補充其他可能"
          />

          {solutionModeHits.length > 0 && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-md border border-status-warning/40 px-3.5 py-3 text-[13px] leading-[1.6] text-text-primary"
            >
              <AlertCircle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" aria-hidden />
              <span>
                AI 回應裡偵測到「{solutionModeHits.join("、")}
                」這類「叫你做產品」的話 — 這階段只看「他現在怎麼解」，請忽略這類建議。
              </span>
            </div>
          )}

          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            Prompt source · worksheet 卡片 4 「AI 幫你補充其他可能」段落（逐字引用）
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <div>
            <Eyebrow variant="numbered" index={3}>
              Step · paste back
            </Eyebrow>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.01em] text-text-primary">
              把 AI 提案的 5 個逐項輸入
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary leading-[1.65]">
              讀 Step 2 的 AI 回應，挑出 5 個 workaround 名稱，逐個鍵入下方（按 Enter 新增）。
              手動的好處：你會邊輸入邊判斷哪些是合理的、哪些 AI 在亂講。
            </p>
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
            <Eyebrow variant="numbered" index={4}>
              Step · ground truth
            </Eyebrow>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.01em] text-text-primary">
              拿 AI 清單去問主人翁，填回 3 個不滿理由
            </h2>
          </div>

          <div
            role="alert"
            className="flex items-start gap-3 rounded-md border border-text-primary/40 bg-surface-active/40 p-4"
          >
            <AlertCircle className="h-5 w-5 text-text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.65] text-text-primary">
              <span className="font-semibold">這一步是真實性的關鍵。</span>把 AI 列的 5 個
              workaround 拿去問主人翁：「這幾個你有用過嗎？哪個最像你的狀況？」然後
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

        <ExampleReferenceCard4 />
      </main>

      <CardFourExitGateFooter
        toolNamePass={toolNamePass}
        aiAlternativesPass={aiAlternativesPass}
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
