import { Lightbulb } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RULES_TABLE } from "@/lib/cardEightValidators";

type Props = {
  understood: boolean;
  onUnderstoodChange: (v: boolean) => void;
};

export function InterviewRulesTable({ understood, onUnderstoodChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Desktop: real table */}
      <div className="hidden sm:block overflow-hidden rounded-lg border border-border">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="bg-muted-bg">
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-text-primary border-b border-border w-1/2"
              >
                ❌ 不要做
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-text-primary border-b border-l border-border w-1/2"
              >
                ✅ 要做
              </th>
            </tr>
          </thead>
          <tbody>
            {RULES_TABLE.map((r, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-muted-bg/30" : ""}>
                <td className="px-4 py-3 text-text-primary border-t border-border align-top leading-[1.6]">
                  {r.dont}
                </td>
                <td className="px-4 py-3 text-text-primary border-t border-l border-border align-top leading-[1.6]">
                  {r.do}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked */}
      <div className="sm:hidden space-y-3">
        {RULES_TABLE.map((r, i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden">
            <div className="bg-muted-bg px-3 py-2 text-[12.5px] font-semibold text-text-primary">
              第 {i + 1} 對
            </div>
            <div className="p-3 space-y-2 text-[13.5px]">
              <div>
                <p className="text-[11.5px] font-semibold text-caution">❌ 不要做</p>
                <p className="text-text-primary">{r.dont}</p>
              </div>
              <div>
                <p className="text-[11.5px] font-semibold text-verified">✅ 要做</p>
                <p className="text-text-primary">{r.do}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why callout */}
      <div className="flex items-start gap-2.5 rounded-md border border-secondary/30 bg-secondary/5 p-3 text-[13px] leading-[1.6] text-text-primary">
        <Lightbulb className="h-4 w-4 text-secondary shrink-0 mt-0.5" aria-hidden />
        <p>
          為什麼？因為使用者很會配合你。你問「會買嗎」，他會說「會」；但他不會真的買。問現況才有真相。
        </p>
      </div>

      {/* Confirm checkbox */}
      <label
        htmlFor="taboos-understood"
        className="flex items-start gap-3 rounded-md border border-border bg-surface p-3 cursor-pointer hover:border-secondary/40 transition-colors"
      >
        <Checkbox
          id="taboos-understood"
          checked={understood}
          onCheckedChange={(v) => onUnderstoodChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-[14.5px] font-semibold text-text-primary">
          我看完了，知道訪談時不要做什麼
        </span>
      </label>
    </div>
  );
}
