/**
 * Card 4 — 「現在怎麼解」驗證器
 *
 * R2.4 禁用詞：tool_name 含這些字 → 代表這個人沒在花時間解 → 退回卡 1
 * 抽象詞：dissatisfactions 含這些字 → 提示具體化（warning，不擋）
 */

const FORBIDDEN_TOOL_KEYWORDS = [
  "沒人解過",
  "沒解過",
  "沒解",
  "會自己想辦法",
  "自己想辦法",
  "用想的",
  "不知道怎麼解",
  "不知道怎麼處理",
  "沒在解",
  "都沒解",
];

const ABSTRACT_DISSATISFACTION_KEYWORDS = [
  "不好用",
  "不方便",
  "不順",
  "難用",
  "麻煩",
  "不爽",
  "不喜歡",
  "怪怪的",
];

export function isForbiddenToolName(value: string): boolean {
  if (!value) return false;
  const v = value.replace(/\s/g, "");
  return FORBIDDEN_TOOL_KEYWORDS.some((kw) => v.includes(kw));
}

export function findForbiddenToolKeywords(value: string): string[] {
  if (!value) return [];
  const v = value.replace(/\s/g, "");
  return FORBIDDEN_TOOL_KEYWORDS.filter((kw) => v.includes(kw));
}

export function findAbstractDissatisfactionKeywords(value: string): string[] {
  if (!value) return [];
  const v = value.replace(/\s/g, "");
  return ABSTRACT_DISSATISFACTION_KEYWORDS.filter((kw) => v.includes(kw));
}

export function hasAnyAbstractDissatisfaction(items: string[]): boolean {
  return items.some((it) => findAbstractDissatisfactionKeywords(it).length > 0);
}

export type CheckState = "pass" | "warn" | "empty";

export type CardFourEvaluation = {
  toolNameFilled: CheckState;
  toolNameNotForbidden: CheckState;
  whyStillStuckFilled: CheckState;
  aiAlternativesEnough: CheckState; // ≥ 3
  dissatisfactionsEnough: CheckState; // ≥ 3
  dissatisfactionsConcrete: CheckState; // warn if abstract
};

export type CardFourInput = {
  tool_name: string;
  why_still_stuck: string;
  ai_alternatives: string[];
  user_dissatisfactions: string[];
};

export function evaluateCardFour(input: CardFourInput): CardFourEvaluation {
  const tool = input.tool_name.trim();
  const why = input.why_still_stuck.trim();
  const alts = input.ai_alternatives.filter((s) => s.trim().length > 0);
  const dis = input.user_dissatisfactions.filter((s) => s.trim().length > 0);

  return {
    toolNameFilled: tool.length >= 3 ? "pass" : tool.length > 0 ? "warn" : "empty",
    toolNameNotForbidden: tool.length === 0 ? "empty" : isForbiddenToolName(tool) ? "warn" : "pass",
    whyStillStuckFilled: why.length >= 5 ? "pass" : why.length > 0 ? "warn" : "empty",
    aiAlternativesEnough: alts.length >= 3 ? "pass" : alts.length > 0 ? "warn" : "empty",
    dissatisfactionsEnough: dis.length >= 3 ? "pass" : dis.length > 0 ? "warn" : "empty",
    dissatisfactionsConcrete:
      dis.length === 0 ? "empty" : hasAnyAbstractDissatisfaction(dis) ? "warn" : "pass",
  };
}
