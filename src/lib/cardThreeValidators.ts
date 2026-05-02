/**
 * Card 3 validators — Stuck Formula
 *
 * 設計（2026-05 重構）：
 * 卡 3 不再要求使用者重寫一遍卡關公式（避免跟卡 1 verbatim 重複）。
 * 流程簡化為 3 步：
 *   Step 1: 複製 prompt → AI 把卡 1 verbatim + 卡 2 background 整理成卡關公式
 *   Step 2: 貼回 AI 整理的句子 (ai_polished) 與釐清問題 (ai_clarifying_questions)
 *   Step 3: 逐題回答釐清問題（每題 ≥10 字，或勾「預約找主人翁問」）
 *
 * 過關條件：
 * - prereq: 卡 1 verbatim + 卡 2 background 已填
 * - ai_polished 至少 AI_POLISHED_MIN 字
 * - 若 AI 列了 ai_clarifying_questions → 全部 resolved（answered ≥10 字 OR reserved）
 * 註：舊版的 stuck_formula.user_draft 已從 schema 移除，由 onRehydrateStorage migration 搬到 ai_polished。
 */

import type { PainCard } from "@/types/painCard";

/** AI 整理後句子的最低字數 */
export const AI_POLISHED_MIN = 15;
export const AI_POLISHED_MAX = 500;

/** 每題回答的最低字數 */
export const ANSWER_MIN = 10;

export type ClarifyingItemStatus = {
  question: string;
  answered: boolean;
  reserved: boolean;
  resolved: boolean;
};

export function evaluateClarifyingAnswered(card: PainCard): {
  items: ClarifyingItemStatus[];
  resolvedCount: number;
  totalCount: number;
  allResolved: boolean;
} {
  const questions = card.stuck_formula.ai_clarifying_questions ?? [];
  const answers = card.stuck_formula.ai_clarifying_answers ?? [];
  const byQ = new Map(answers.map((a) => [a.question, a]));
  const items: ClarifyingItemStatus[] = questions.map((q) => {
    const a = byQ.get(q);
    const answer = (a?.answer ?? "").trim();
    const reserved = a?.reserved === true;
    const answered = answer.length >= ANSWER_MIN;
    return { question: q, answered, reserved, resolved: answered || reserved };
  });
  const resolvedCount = items.filter((i) => i.resolved).length;
  return {
    items,
    resolvedCount,
    totalCount: items.length,
    allResolved: items.every((i) => i.resolved),
  };
}

export type CardThreeChecks = {
  aiPolishedFilled: boolean;
  aiPolishedLongEnough: boolean;
  /** 衍生值：沒問題 → true；有問題 → 全部 resolved */
  confirmed: boolean;
  prereqReady: boolean;
  clarifying: ReturnType<typeof evaluateClarifyingAnswered>;
};

export function evaluateCardThree(card: PainCard): CardThreeChecks {
  const polished = (card.stuck_formula.ai_polished ?? "").trim();
  const verbatim = card.complaint.verbatim.trim();
  const background = card.people.background.trim();
  const clarifying = evaluateClarifyingAnswered(card);
  const noQuestions = clarifying.totalCount === 0;
  return {
    aiPolishedFilled: polished.length > 0,
    aiPolishedLongEnough: polished.length >= AI_POLISHED_MIN,
    confirmed: noQuestions ? true : clarifying.allResolved,
    prereqReady: verbatim.length > 0 && background.length > 0,
    clarifying,
  };
}

/**
 * Prompt 模板 — 餵給 AI 的素材就是卡 1 verbatim + 卡 2 background。
 * 變數插值：{complaint_verbatim}、{people_background}
 */
export const PROMPT_TEMPLATE = `我有一個抱怨原句：
{complaint_verbatim}

抱怨主人翁是：
{people_background}

請幫我把它整理成「我每次要 ___，都會卡在 ___」這個句型。

規則：
1. 不要替我發明細節，只能用原句裡有的事實
2. 如果原句不夠具體，請列出 3 個我需要再問清楚的問題
3. 不要建議解決方案、不要推薦工具、不要分析市場
4. 直接給我句子，不要解釋為什麼`;

export function interpolatePrompt(
  complaintVerbatim: string,
  peopleBackground: string,
): string {
  return PROMPT_TEMPLATE.replace("{complaint_verbatim}", complaintVerbatim || "（尚未填寫卡 1 抱怨原句）")
    .replace("{people_background}", peopleBackground || "（尚未填寫卡 2 背景）");
}

export type AiToolPref = "chatgpt" | "claude" | "gemini" | "perplexity";

export const AI_TOOL_PREF_KEY = "user_pref.ai_tool";

export const AI_TOOL_OPTIONS: Array<{ id: AiToolPref; label: string; url: string }> = [
  { id: "chatgpt", label: "ChatGPT", url: "https://chat.openai.com/" },
  { id: "claude", label: "Claude", url: "https://claude.ai/" },
  { id: "gemini", label: "Gemini", url: "https://gemini.google.com/" },
  { id: "perplexity", label: "Perplexity", url: "https://www.perplexity.ai/" },
];
