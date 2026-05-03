import { Lightbulb } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RULES_TABLE } from "@/lib/cardEightValidators";

type Props = {
  understood: boolean;
  onUnderstoodChange: (v: boolean) => void;
};

/**
 * InterviewRulesTable — Hairline Ledger pattern (Grok v1.2 §11).
 *
 * Two-column DON'T / DO ruleset rendered as editorial table:
 * - 1px hairline dividers, no zebra striping, no background tint
 * - Mono uppercase column headers (Eyebrow style)
 * - Mobile: stacked rows with same hairline treatment
 */
export function InterviewRulesTable({ understood, onUnderstoodChange }: Props) {
  return (
    <div className="space-y-5">
      {/* Desktop: ledger-style table */}
      <div className="hidden sm:block overflow-hidden rounded-md border border-border-hairline">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="text-left px-5 py-3 border-b border-border-hairline w-1/2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-tertiary"
              >
                <span className="text-status-warning mr-1.5">✕</span>
                <span className="text-text-secondary">Don&apos;t</span>
              </th>
              <th
                scope="col"
                className="text-left px-5 py-3 border-b border-l border-border-hairline w-1/2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-tertiary"
              >
                <span className="text-text-primary mr-1.5">✓</span>
                <span className="text-text-secondary">Do</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {RULES_TABLE.map((r, i) => (
              <tr key={i} className="border-t border-border-subtle first:border-t-0">
                <td className="px-5 py-4 text-text-primary align-top leading-[1.65]">{r.dont}</td>
                <td className="px-5 py-4 text-text-primary border-l border-border-hairline align-top leading-[1.65]">
                  {r.do}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked ledger */}
      <div className="sm:hidden space-y-3">
        {RULES_TABLE.map((r, i) => (
          <div key={i} className="rounded-md border border-border-hairline overflow-hidden">
            <div className="px-4 py-2 border-b border-border-subtle font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-tertiary">
              <span className="tabular-nums text-text-secondary">
                {String(i + 1).padStart(2, "0")} / {String(RULES_TABLE.length).padStart(2, "0")}
              </span>
            </div>
            <dl className="divide-y divide-border-subtle">
              <div className="px-4 py-3">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-status-warning mb-1.5">
                  ✕ Don&apos;t
                </dt>
                <dd className="text-[13.5px] text-text-primary leading-[1.65]">{r.dont}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-primary mb-1.5">
                  ✓ Do
                </dt>
                <dd className="text-[13.5px] text-text-primary leading-[1.65]">{r.do}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Why callout — hairline only, no color fill */}
      <div className="flex items-start gap-2.5 rounded-md border border-border-hairline bg-canvas-raised p-3.5 text-[13px] leading-[1.6] text-text-primary">
        <Lightbulb className="h-4 w-4 text-text-secondary shrink-0 mt-0.5" aria-hidden />
        <p>
          為什麼？因為使用者很會配合你。你問「會買嗎」，他會說「會」；但他不會真的買。問現況才有真相。
        </p>
      </div>

      {/* Confirm checkbox */}
      <label
        htmlFor="taboos-understood"
        className="flex items-start gap-3 rounded-md border border-border-hairline bg-canvas-raised p-3.5 cursor-pointer hover:border-border-default transition-colors"
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
