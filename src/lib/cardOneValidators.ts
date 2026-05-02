/**
 * Card 1 anti-fake validators —
 * R2.1：原句不含分析詞（「我覺得 / 應該需要 / 可能 / 大概 / 或許 / 似乎」）
 * R2.2：source_name 不是泛稱代詞
 * 場景檢核：scene >= 5 字
 *
 * 純函式，無副作用，方便測試與在多處呼叫（inline hint / panel / exit gate）。
 */

const ANALYSIS_WORDS = ["我覺得", "應該需要", "可能", "大概", "或許", "似乎"] as const;
const FORBIDDEN_NAMES = ["現代人", "上班族", "大家", "很多人", "某人"] as const;

export type CheckStatus = "pass" | "warning" | "pending";

export type CardOneChecks = {
  /** R2.1 — 原句不含分析詞 */
  noAnalysisWords: CheckStatus;
  /** R2.2 — 來源是有具體姓名的真人 */
  realPerson: CheckStatus;
  /** 場景可被觀察（>= 5 字） */
  observableScene: CheckStatus;
  /** 5 個欄位皆非空且 verbatim >= 10 字 */
  allRequiredFilled: CheckStatus;
};

export type CardOneInput = {
  verbatim: string;
  source_name: string;
  source_relation: string;
  datetime: string;
  scene: string;
};

export function detectAnalysisWords(text: string): string[] {
  return ANALYSIS_WORDS.filter((w) => text.includes(w));
}

export function isForbiddenName(name: string): boolean {
  return FORBIDDEN_NAMES.some((f) => name.trim() === f);
}

export function evaluateCardOne(input: CardOneInput): CardOneChecks {
  const verbatim = input.verbatim.trim();
  const sourceName = input.source_name.trim();
  const scene = input.scene.trim();

  // pending = 該欄位還沒輸入；warning = 有輸入但違規；pass = 通過
  const noAnalysisWords: CheckStatus = !verbatim
    ? "pending"
    : detectAnalysisWords(verbatim).length === 0
      ? "pass"
      : "warning";

  const realPerson: CheckStatus = !sourceName
    ? "pending"
    : isForbiddenName(sourceName)
      ? "warning"
      : "pass";

  const observableScene: CheckStatus = !scene ? "pending" : scene.length >= 5 ? "pass" : "warning";

  const allFilled =
    verbatim.length >= 10 &&
    sourceName.length >= 1 &&
    input.source_relation.trim().length >= 1 &&
    input.datetime.trim().length >= 1 &&
    scene.length >= 1;

  return {
    noAnalysisWords,
    realPerson,
    observableScene,
    allRequiredFilled: allFilled ? "pass" : "pending",
  };
}

/** 卡 1 是否可進入卡 2（exit gate） */
export function canAdvanceCardOne(checks: CardOneChecks): boolean {
  return (
    checks.allRequiredFilled === "pass" &&
    checks.noAnalysisWords === "pass" &&
    checks.realPerson === "pass"
  );
}

export const CARD_ONE_FORBIDDEN_NAMES = FORBIDDEN_NAMES;
export const CARD_ONE_ANALYSIS_WORDS = ANALYSIS_WORDS;
