import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, Copy, Check, ExternalLink, AlertCircle } from "lucide-react";

import { AiToolSelector } from "@/components/worksheet/card06/AiToolSelector";
import { EightAnswersForm } from "@/components/worksheet/card06/EightAnswersForm";
import { AntiSolutionCheck } from "@/components/worksheet/card06/AntiSolutionCheck";
import { CardSixExitGateFooter } from "@/components/worksheet/card06/CardSixExitGateFooter";
import {
  evaluateEightAnswers,
  findSolutionPushHits,
  getToolById,
  type EightAnswersInput,
} from "@/lib/cardSixHelpers";
import { usePainCardStore } from "@/store/painCard";
import type { AiTool } from "@/types/painCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learn/worksheet/06")({
  head: () => ({
    meta: [
      { title: "卡 6 用 AI 蒐集證據 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "用 AI 跑 8 題證據蒐集 prompt，把回覆原文與結構化結果保存。AI 不可推銷產品。",
      },
    ],
  }),
  component: CardSixPage,
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

function CardSixPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const ev = card.ai_evidence;

  const stuck =
    card.stuck_formula.ai_polished?.trim() ?? "";
  const peopleBg = card.people.background.trim();
  const tool = card.workaround.tool_name.trim();
  const dis = card.workaround.user_dissatisfactions
    .filter(Boolean)
    .slice(0, 3)
    .join("、");

  const promptText = useMemo(
    () => `我想研究一個可能的痛點：

「${stuck || "（請先到卡 3 填卡關公式）"}」
痛點主人翁特徵：${peopleBg || "（請先到卡 2 填背景）"}
他現在用：${tool || "（請先到卡 4 填現有解法）"}
不滿之處：${dis || "（請先到卡 4 填不滿）"}

⚠️ 重要規則：
- 請不要幫我設計產品，也不要提出商業模式
- 請不要建議 App、SaaS、解決方案
- 請只做痛點探索與證據蒐集

請回答以下 8 題：
1. 哪些具體人群最常遇到這個問題？請列 3-5 群（要有具體職業/角色，不要寫「上班族」這種模糊詞）
2. 這個問題通常在什麼場景發生？頻率多高？
3. 他們現在怎麼解決？請列 5 個具體 workaround（工具名/流程名）
4. 現有解法有哪些不滿？請分成：時間成本、品質壓力、情緒壓力、資料整理壓力、其他
5. 有哪些公開證據支持這個痛點？請找：論壇、社群、產業文章、工具評論、搜尋趨勢
6. 這個痛點背後真正的 Job-to-be-Done 是什麼？
7. 哪些可能是假痛點？也就是看起來很煩，但其實不夠頻繁、不夠痛、或已經被現有工具解決
8. 如果我要做真人訪談，最應該訪談哪 5 種人？每種人給 3 個訪談問題

不要對任何結論加裝飾性評論。如果某題你不確定，標 [推測]。`,
    [stuck, peopleBg, tool, dis],
  );

  const prereqMissing = !stuck || !peopleBg || !tool;

  // setters
  const setTool = (id: AiTool) => updateField("ai_evidence.ai_tool", id);
  const setReason = (v: string) => updateField("ai_evidence.ai_tool_reason", v);
  const setRaw = (v: string) => updateField("ai_evidence.raw_response", v);
  const setAnswer = (key: keyof EightAnswersInput, v: string) =>
    updateField(`ai_evidence.eight_answers.${key}`, v);

  // 反推銷偵測
  const allText = useMemo(() => {
    return [ev.raw_response, ...Object.values(ev.eight_answers)].join("\n");
  }, [ev.raw_response, ev.eight_answers]);

  const hits = useMemo(() => findSolutionPushHits(allText), [allText]);
  const triggered = hits.length > 0;

  // manual override（page-local，但同步到 PainCard.no_solution_check_passed）
  const [manualOverride, setManualOverride] = useState(false);
  // 初始化 manualOverride：如果偵測無 hit 且資料已存在 passed，視為自動 passed；否則依命中
  useEffect(() => {
    const desired = !triggered || manualOverride;
    if (ev.no_solution_check_passed !== desired) {
      updateField("ai_evidence.no_solution_check_passed", desired);
    }
  }, [triggered, manualOverride, ev.no_solution_check_passed, updateField]);

  // copy prompt
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  // 評估 8 題
  const eightEval = useMemo(
    () => evaluateEightAnswers(ev.eight_answers as EightAnswersInput),
    [ev.eight_answers],
  );

  const rawLong = ev.raw_response.trim().length >= 200;
  const noSolutionPassed = !triggered || manualOverride;

  // 嘗試送出
  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
  }, [ev.raw_response, ev.eight_answers, manualOverride]);

  const handleAdvance = () => {
    setAttempted(true);
    if (!ev.ai_tool) {
      setBlockedMessage("請先選 1 個 AI 工具。");
      return;
    }
    if (!rawLong) {
      setBlockedMessage("請把 AI 回覆原文整段貼上（≥ 200 字）。");
      return;
    }
    if (!eightEval.allPassed) {
      const missing = Object.entries(eightEval.filled)
        .filter(([, ok]) => !ok)
        .map(([k]) => k.replace(/_.*/, "").toUpperCase())
        .join("、");
      setBlockedMessage(
        `8 題中還有 ${8 - eightEval.passedCount} 題未達最少字數（${missing}）。請貼上 AI 給的完整答案。`,
      );
      return;
    }
    if (!noSolutionPassed) {
      setBlockedMessage(
        "AI 回覆出現推銷詞 — 請使用補強 prompt 重跑，或勾選「手動覆寫」確認。",
      );
      return;
    }

    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(7);
      navigate({ to: "/learn/worksheet/07" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTool = getToolById(ev.ai_tool);

  return (
    <div className="flex flex-col min-h-[calc(100vh-7.5rem)] bg-page">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-32 space-y-8">
        {/* card_intro */}
        <header>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 6 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/50 bg-verified/5 px-2 py-1 text-[11px] font-bold text-verified"
              aria-label="這張卡 AI 介入：8 題證據蒐集"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：✅ 8 題證據蒐集
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            用 AI 蒐集證據
          </h1>

          <p className="mt-3 text-[16px] leading-[1.65] text-text-secondary">
            你已經有自己的猜測（卡 1-5）。現在用 AI 去找公開證據，看看你的猜測有沒有支撐。
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-lg border-2 border-caution/40 bg-caution/5 p-4">
            <Search className="h-5 w-5 text-caution shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">這張不是什麼：</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>不是設計產品</li>
                <li>不是談商業模式</li>
                <li>不是想 App</li>
              </ul>
              <p className="pt-1">
                最重要的一句 prompt 是：「<span className="font-semibold">請不要幫我設計產品，也不要提出商業模式</span>」。
              </p>
            </div>
          </div>
        </header>

        {prereqMissing && (
          <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary">
            <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>
              卡 2 / 3 / 4 尚未填完，下方 prompt 變數會缺。建議先補完再來這一卡。
            </span>
          </div>
        )}

        {/* Section 3: tool selector */}
        <section className="space-y-3">
          <h2 className="text-[20px] font-bold text-text-primary">
            第一步：選一個 AI 工具
          </h2>
          <p className="text-[14px] text-text-secondary leading-[1.6]">
            4 種工具各有強項，依你想找的證據類型挑一個。第一次不確定就先用 ChatGPT Deep Research。
          </p>
          <AiToolSelector
            selected={ev.ai_tool}
            onSelect={setTool}
            reason={ev.ai_tool_reason}
            onReasonChange={setReason}
            highlight={attempted && !ev.ai_tool}
          />
        </section>

        {/* Section 4: prompt copy block */}
        <section className="space-y-3">
          <h2 className="text-[20px] font-bold text-text-primary">
            第二步：複製這段證據蒐集 prompt
          </h2>

          <div className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border bg-muted-bg/40">
              <span className="text-[13px] text-text-secondary">
                完整 prompt（含「請不要幫我設計產品」鐵律）
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-8"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1" /> 已複製
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" /> 複製 prompt
                    </>
                  )}
                </Button>
                {selectedTool && (
                  <Button
                    asChild
                    size="sm"
                    className="h-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    <a
                      href={selectedTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      打開 {selectedTool.name}
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[1.6] bg-muted-bg p-4 max-h-96 overflow-auto whitespace-pre-wrap text-text-primary">
              {promptText}
            </pre>
          </div>
          <p className="text-[12.5px] text-text-secondary">
            複製後到 {selectedTool ? selectedTool.name : "上方選的 AI 工具"} 貼上跑一次，再回來填下面的欄位。
          </p>
        </section>

        {/* Section 5: 8 answers */}
        <section className="space-y-3">
          <h2 className="text-[20px] font-bold text-text-primary">
            第三步：把 AI 回覆貼回來
          </h2>
          <p className="text-[14px] text-text-secondary leading-[1.6]">
            先貼整段原文（保存用），再把 8 題答案分別貼進對應欄位。
          </p>

          <EightAnswersForm
            rawResponse={ev.raw_response}
            onRawChange={setRaw}
            answers={ev.eight_answers as EightAnswersInput}
            onAnswerChange={setAnswer}
            attempted={attempted}
          />
        </section>

        {/* Section 6: anti-solution check */}
        <section className="space-y-3">
          <h2 className="text-[20px] font-bold text-text-primary">
            第四步：反推銷檢查
          </h2>
          <AntiSolutionCheck
            hits={hits}
            manualOverride={manualOverride}
            onManualOverrideChange={setManualOverride}
          />
        </section>

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo
            ? `已自動儲存到瀏覽器 · ${savedAgo}`
            : "尚未開始輸入"}
        </p>
      </main>

      <CardSixExitGateFooter
        answersAllPassed={eightEval.allPassed}
        answersPassedCount={eightEval.passedCount}
        noSolutionPassed={noSolutionPassed}
        rawResponseLong={rawLong}
        submitting={submitting}
        blockedMessage={blockedMessage}
        onAdvance={handleAdvance}
      />
    </div>
  );
}
