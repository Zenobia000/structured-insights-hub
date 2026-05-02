import { ChevronUp } from "lucide-react";

export type InlineHintItem = {
  label: string;
  done: boolean;
};

type Props = {
  /** 標題文字,例如「反思問題」或「想想看」 */
  title?: string;
  /** 每一項提示 */
  items: InlineHintItem[];
  /** 觸發底部摺疊面板展開的事件名稱 */
  expandEventName: string;
  /** 全部通過時是否隱藏 */
  hideWhenAllDone?: boolean;
};

/**
 * 主畫面內的小型提示條,告訴使用者還有哪些反思題未過。
 * 點擊任一未過項目 → 派送 expandEventName CustomEvent,讓底部 footer 展開並跳到對應欄位。
 *
 * 與底部 sticky footer 的關係:
 *  - 這個元件放在主要內容下方、footer 之前
 *  - 不 sticky,會跟著主畫面捲動,提供「就近提示」
 *  - footer 仍是最終的詳細區+操作區
 */
export function ReflectionInlineHint({
  title = "反思問題",
  items,
  expandEventName,
  hideWhenAllDone = true,
}: Props) {
  const remaining = items.filter((i) => !i.done);
  if (hideWhenAllDone && remaining.length === 0) return null;

  function openFooter(targetIndex?: number) {
    window.dispatchEvent(
      new CustomEvent(expandEventName, {
        detail: { targetIndex },
      }),
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[12.5px] font-medium text-text-primary">
          {title}：還有{" "}
          <span className="text-secondary font-semibold">{remaining.length}</span> 題沒過
        </span>
        <button
          type="button"
          onClick={() => openFooter()}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-medium text-secondary transition-colors hover:bg-secondary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          aria-label="展開底部反思面板"
        >
          展開細節 <ChevronUp className="h-3 w-3" aria-hidden />
        </button>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => openFooter(idx)}
              disabled={item.done}
              className={
                item.done
                  ? "inline-flex items-center gap-1 rounded-full border border-verified/30 bg-verified/10 px-2 py-0.5 text-[11.5px] text-verified cursor-default"
                  : "inline-flex items-center gap-1 rounded-full border border-secondary/40 bg-surface px-2 py-0.5 text-[11.5px] text-text-secondary transition-colors hover:bg-secondary/10 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              }
              aria-label={item.done ? `已完成:${item.label}` : `未過:${item.label},點擊展開細節`}
            >
              <span aria-hidden>{item.done ? "✓" : "○"}</span>
              <span className="truncate max-w-[18rem]">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
