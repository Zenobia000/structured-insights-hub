/**
 * useResumeCard — 判斷 landing 是否該顯示「繼續上次的進度」卡。
 *
 * 規則（來自 00_landing spec）：
 * - 當 store 中 card.status 不是 'structured' 也不是 'archived_fake'
 *   且使用者已經輸入了任何資料（complaint.verbatim 非空 或 current_step > 1）
 *   就視為「未完成」
 * - SSR 階段不能讀 LocalStorage，必須等 hydration 完成再判斷
 *   否則會出現 SSR/CSR mismatch
 */

import { usePainCardStore } from "@/store/painCard";
import { STEP_TITLES, type CurrentStep } from "@/types/painCard";

export type ResumeInfo = {
  showResume: boolean;
  currentStep: CurrentStep;
  cardName: string;
  createdAt: string;
  updatedAt: string;
};

export function useResumeCard(): ResumeInfo {
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);

  if (!hydrated) {
    return {
      showResume: false,
      currentStep: 1,
      cardName: STEP_TITLES[1],
      createdAt: card.created_at,
      updatedAt: card.updated_at,
    };
  }

  const finished = card.status === "structured" || card.status === "archived_fake";
  const hasContent = !!card.complaint.verbatim.trim() || card.current_step > 1;

  return {
    showResume: !finished && hasContent,
    currentStep: card.current_step,
    cardName: STEP_TITLES[card.current_step],
    createdAt: card.created_at,
    updatedAt: card.updated_at,
  };
}
