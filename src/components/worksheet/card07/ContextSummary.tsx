import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PainCard } from "@/types/painCard";

type Props = { card: PainCard };

export function ContextSummary({ card }: Props) {
  const [open, setOpen] = useState(false);
  const verbatim = card.complaint.verbatim.trim();
  const bg = card.people.background.trim();
  const stuck =
    card.stuck_formula.ai_polished?.trim() ?? "";
  const tool = card.workaround.tool_name.trim();
  const why = card.workaround.why_still_stuck.trim();

  return (
    <div className="rounded-md border border-border bg-muted-bg/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[13.5px] font-semibold text-text-primary inline-flex items-center gap-1.5">
          {open ? (
            <ChevronDown className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden />
          )}
          看一下卡 1-4 的關鍵資料（幫助你下猜測）
        </span>
      </button>
      {open && (
        <dl className="px-4 pb-3 pt-1 space-y-2 text-[13px] leading-[1.6]">
          <div>
            <dt className="font-semibold text-text-primary">抱怨原句</dt>
            <dd className="text-text-secondary">{verbatim || "（卡 1 未填）"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">主人翁背景</dt>
            <dd className="text-text-secondary">{bg || "（卡 2 未填）"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">卡關公式</dt>
            <dd className="text-text-secondary">{stuck || "（卡 3 未填）"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">現在怎麼解</dt>
            <dd className="text-text-secondary">
              {tool ? `${tool}${why ? ` — ${why}` : ""}` : "（卡 4 未填）"}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}
