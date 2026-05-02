/**
 * TRIZ 6 種矛盾 — 順序固定 1-6，禁止隨機。
 * 對應 PainCard.contradiction.triz_id / triz_label
 */
import type { TrizId, TrizLabel } from "@/types/painCard";

export type TrizOption = {
  id: TrizId;
  label: TrizLabel;
  en: string;
  example: string;
};

export const TRIZ_OPTIONS: ReadonlyArray<TrizOption> = [
  {
    id: 1,
    label: "想快但又想做得好",
    en: "Speed vs Quality",
    example: "想 5 分鐘交稿，又想品質像花 1 小時打磨過。",
  },
  {
    id: 2,
    label: "想客製化但又想規模化",
    en: "Personalization vs Scale",
    example: "30 個學生家長都要看到「我的孩子」，老師卻只有 2 小時可寫。",
  },
  {
    id: 3,
    label: "想快但又想正確",
    en: "Speed vs Accuracy",
    example: "想立刻決策，又怕資料沒查證錯成大麻煩。",
  },
  {
    id: 4,
    label: "想很專業但又想新手好上手",
    en: "Expert vs Novice",
    example: "想保留進階功能，又怕新人打開介面就嚇跑。",
  },
  {
    id: 5,
    label: "想自動化但又怕失控",
    en: "Automation vs Control",
    example: "想讓系統自動處理，又怕一錯就大量錯。",
  },
  {
    id: 6,
    label: "想多嘗試但又怕出包",
    en: "Experimentation vs Risk",
    example: "想多試新做法，又怕在客戶面前翻車。",
  },
] as const;

export function getTrizById(id: TrizId | null): TrizOption | undefined {
  if (id === null) return undefined;
  return TRIZ_OPTIONS.find((o) => o.id === id);
}
