/**
 * Card 5 — 矛盾欄位驗證器
 *
 * 蘇格拉底大一統 v2.0：不打分數、不貼分類學標籤。
 * 純粹檢查使用者是否用自己的話把取捨寫具體。
 */
import type { PainCard } from "@/types/painCard";

export type CheckStatus = "pass" | "warning" | "pending";

export type CardFiveEvaluation = {
  sideAFilled: CheckStatus;
  sideBFilled: CheckStatus;
  sacrificedSelected: CheckStatus;
  sacrificedReasonFilled: CheckStatus;
};

const MIN_LEN = 10;

function lengthCheck(value: string): CheckStatus {
  const trimmed = value.trim();
  if (trimmed.length >= MIN_LEN) return "pass";
  if (trimmed.length > 0) return "warning";
  return "pending";
}

export function evaluateCardFive(input: PainCard["contradiction"]): CardFiveEvaluation {
  return {
    sideAFilled: lengthCheck(input.side_a),
    sideBFilled: lengthCheck(input.side_b),
    sacrificedSelected: input.sacrificed === "a" || input.sacrificed === "b" ? "pass" : "pending",
    sacrificedReasonFilled: lengthCheck(input.sacrificed_reason),
  };
}
