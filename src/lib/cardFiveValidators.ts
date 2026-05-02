/**
 * Card 5 — 矛盾選擇驗證器
 */
import type { Contradiction } from "./cardFiveTypes";

export type CheckState = "pass" | "warn" | "empty";

export type CardFiveEvaluation = {
  trizSelected: CheckState;
  sideAFilled: CheckState;
  sideBFilled: CheckState;
  sacrificedSelected: CheckState;
};

export function evaluateCardFive(input: Contradiction): CardFiveEvaluation {
  const a = input.side_a.trim();
  const b = input.side_b.trim();
  return {
    trizSelected: input.triz_id !== null ? "pass" : "empty",
    sideAFilled: a.length >= 10 ? "pass" : a.length > 0 ? "warn" : "empty",
    sideBFilled: b.length >= 10 ? "pass" : b.length > 0 ? "warn" : "empty",
    sacrificedSelected:
      input.sacrificed === "a" || input.sacrificed === "b" ? "pass" : "empty",
  };
}
