/**
 * Card 3 validators — Stuck Formula
 *
 * 鐵律：
 * - user_draft 至少 15 字（minLength）
 * - R2.3 抽象詞 warning（不擋過關，僅提醒）
 * - confirmed 必須勾選才能過關
 * - prompt 內容必須與 worksheet 卡 3 原文 100% 一致（逐字引用）
 *
 * 前置條件：卡 1 (complaint.verbatim) + 卡 2 (people.background) 已填。
 */

import type { PainCard } from "@/types/painCard";

export const USER_DRAFT_MIN = 15;
export const USER_DRAFT_MAX = 500;

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

export type CardThreeChecks = {
  userDraftFilled: boolean;
  userDraftLongEnough: boolean;
  containsAbstract: boolean;
  confirmed: boolean;
  prereqReady: boolean;
};

export function evaluateCardThree(card: PainCard): CardThreeChecks {
  const draft = card.stuck_formula.user_draft.trim();
  const verbatim = card.complaint.verbatim.trim();
  const background = card.people.background.trim();
  return {
    userDraftFilled: draft.length > 0,
    userDraftLongEnough: draft.length >= USER_DRAFT_MIN,
    containsAbstract: abstractKeywordsHit(draft).length > 0,
    confirmed: card.stuck_formula.confirmed === true,
    prereqReady: verbatim.length > 0 && background.length > 0,
  };
}

/**
 * Prompt 模板 — 與 worksheet 卡 3「🤖 AI 幫你校對」段落 100% 逐字一致。
 * 變數插值僅 {complaint_verbatim} 與 {people_background} 兩個。
 *
 * ⚠️ 任何文字改動都必須同步 worksheet 卡 3 原文，禁止單方面改寫。
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
