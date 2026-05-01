/**
 * startNewPainCard — landing 「建立新 PainCard」共用入口。
 *
 * 規格說「POST /api/paincards」但 MVP 階段沒有 backend：
 * 直接呼叫 zustand store 的 createCard()，回傳 id 與導向路徑。
 * 之後若接 cloud，這個 helper 就是唯一要改的地方。
 */
import { usePainCardStore } from "@/store/painCard";

export function startNewPainCard(): { id: string; path: "/learn/worksheet/01" } {
  const store = usePainCardStore.getState();
  store.createCard();
  // createCard 後 store.card 已是新 card
  const id = usePainCardStore.getState().card.id;
  return { id, path: "/learn/worksheet/01" };
}
