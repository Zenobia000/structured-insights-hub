/**
 * Card 3 validators — Stuck Formula
 *
 * 鐵律（更新版）：
 * - user_draft 至少 15 字（自然語言初稿，不再強制句型）
 * - R2.3 抽象詞 warning（不擋過關，僅提醒）
 * - 若 AI 列了 ai_clarifying_questions：每題必須有 ≥10 字回答 OR 勾選「預約找主人翁問」
 * - 若 AI 沒列任何問題：自動視為通過
 * - prompt 內容必須與 worksheet 卡 3 原文 100% 一致（逐字引用），但材料區允許帶入 user_draft
 *
 * 前置條件：卡 1 (complaint.verbatim) + 卡 2 (people.background) 已填。
 */

import type { PainCard } from "@/types/painCard";

export const USER_DRAFT_MIN = 15;
export const USER_DRAFT_MAX = 500;

/** 每題回答的最低字數門檻 */
export const ANSWER_MIN = 10;

/** R2.3 抽象詞清單 — 命中時顯示 warning（不擋輸入、不擋過關） */
export const ABSTRACT_KEYWORDS = [
  "效率不好",
  "沒效率",
  "效率差",
  "流程不順",
  "流程亂",
  "不方便",
  "不順手",
  "體驗不好",
  "用起來很爛",
  "麻煩",
] as const;

export function abstractKeywordsHit(text: string): string[] {
  const t = text.trim();
  if (!t) return [];
  return ABSTRACT_KEYWORDS.filter((k) => t.includes(k));
}

export type ClarifyingItemStatus = {
  question: string;
  answered: boolean;
  reserved: boolean;
  /** 該題是否視為「已處理」(answered OR reserved) */
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
  userDraftFilled: boolean;
  userDraftLongEnough: boolean;
  containsAbstract: boolean;
  /** 衍生值：沒問題 → true；有問題 → 全部 resolved */
  confirmed: boolean;
  prereqReady: boolean;
  clarifying: ReturnType<typeof evaluateClarifyingAnswered>;
};

export function evaluateCardThree(card: PainCard): CardThreeChecks {
  const draft = card.stuck_formula.user_draft.trim();
  const verbatim = card.complaint.verbatim.trim();
  const background = card.people.background.trim();
  const clarifying = evaluateClarifyingAnswered(card);
  const noQuestions = clarifying.totalCount === 0;
  return {
    userDraftFilled: draft.length > 0,
    userDraftLongEnough: draft.length >= USER_DRAFT_MIN,
    containsAbstract: abstractKeywordsHit(draft).length > 0,
    confirmed: noQuestions ? true : clarifying.allResolved,
    prereqReady: verbatim.length > 0 && background.length > 0,
    clarifying,
  };
}

/**
 * Prompt 模板 — 與 worksheet 卡 3「🤖 AI 幫你校對」段落 100% 逐字一致；
 * 材料區額外帶入使用者初稿，幫 AI 看出落差與含糊處。
 * 變數插值：{complaint_verbatim}、{people_background}、{user_draft}
 */
export const PROMPT_TEMPLATE = `我有一個抱怨原句：
{complaint_verbatim}

抱怨主人翁是：
{people_background}

我自己嘗試的描述：
{user_draft}

請幫我把上述材料整理成「我每次要 ___，都會卡在 ___」這個句型。

規則：
1. 不要替我發明細節，只能用上述材料裡有的事實
2. 如果材料不夠具體，請列出 3 個我需要再問清楚的問題
3. 不要建議解決方案、不要推薦工具、不要分析市場
4. 直接給我句子，不要解釋為什麼`;

export function interpolatePrompt(
  complaintVerbatim: string,
  peopleBackground: string,
  userDraft: string,
): string {
  return PROMPT_TEMPLATE.replace("{complaint_verbatim}", complaintVerbatim || "（尚未填寫卡 1 抱怨原句）")
    .replace("{people_background}", peopleBackground || "（尚未填寫卡 2 背景）")
    .replace("{user_draft}", userDraft || "（尚未寫初稿）");
}

export type AiToolPref = "chatgpt" | "claude" | "gemini" | "perplexity";

export const AI_TOOL_PREF_KEY = "user_pref.ai_tool";

export const AI_TOOL_OPTIONS: Array<{ id: AiToolPref; label: string; url: string }> = [
  { id: "chatgpt", label: "ChatGPT", url: "https://chat.openai.com/" },
  { id: "claude", label: "Claude", url: "https://claude.ai/" },
  { id: "gemini", label: "Gemini", url: "https://gemini.google.com/" },
  { id: "perplexity", label: "Perplexity", url: "https://www.perplexity.ai/" },
];
