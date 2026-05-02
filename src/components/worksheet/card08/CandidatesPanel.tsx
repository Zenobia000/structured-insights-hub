import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { parseQ8Candidates } from "@/lib/cardEightValidators";

type Props = {
  q8Raw: string;
  onPick: (persona: string) => void;
};

export function CandidatesPanel({ q8Raw, onPick }: Props) {
  const candidates = useMemo(() => parseQ8Candidates(q8Raw), [q8Raw]);

  if (!q8Raw.trim()) {
    return (
      <div className="rounded-md border-2 border-caution/40 bg-caution/5 px-3 py-2.5 text-[13.5px] text-text-primary">
        卡 6 第 8 題沒給你 5 種人。先回卡 6 補完，這裡才會自動帶入候選名單。
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted-bg/40 px-3 py-2.5 text-[13px] text-text-secondary">
        從卡 6 抓不到清楚的人群名稱。直接在下方欄位手動輸入即可。
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[13px] text-text-secondary">
        卡 6 給的候選人群（點一下會帶到下方第 1 個還沒填的 persona 欄位）：
      </p>
      <div className="flex flex-wrap gap-2">
        {candidates.map((c) => (
          <Button
            key={c}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPick(c)}
            className="h-8 rounded-full border-secondary/40 text-text-primary hover:bg-secondary/10"
          >
            {c}
          </Button>
        ))}
      </div>
    </div>
  );
}
