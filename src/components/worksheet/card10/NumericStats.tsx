/**
 * NumericStats — Anti-chart Numeric (Grok v1.2 §C5).
 *
 * Three oversized numbers as the visual anchor between CompletionHeader
 * and PainIdCard. Each cell:
 *   [eyebrow label]
 *   [96-160px display number]
 *   [thin caption]
 *
 * Uses tabular-nums + mono so digits align across columns. No charts,
 * no progress bars — typography IS the data display.
 */
import { usePainCardStore } from "@/store/painCard";

function elapsedMinutes(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(1, Math.round((end - start) / 60000));
}

export function NumericStats() {
  const card = usePainCardStore((s) => s.card);

  const minutes = elapsedMinutes(card.created_at, card.updated_at);
  const targetCount = card.interview_plan.targets.length;
  const peopleCount = card.people.list.filter((p) => p.name?.trim()).length;

  return (
    <section
      aria-label="痛點填空簿完成統計"
      className="grid grid-cols-1 sm:grid-cols-3 border border-border-hairline rounded-lg overflow-hidden bg-canvas-base"
    >
      <Stat
        eyebrow="01 / scope"
        value="09"
        unit="cards"
        caption="9 張卡，全部走完"
      />
      <Stat
        eyebrow="02 / pace"
        value={minutes >= 100 ? String(minutes) : String(minutes).padStart(2, "0")}
        unit="min"
        caption={`從第一張到判斷，總共 ${minutes} 分鐘`}
      />
      <Stat
        eyebrow="03 / proof"
        value={String(peopleCount + targetCount).padStart(2, "0")}
        unit="people"
        caption={`真人 ${peopleCount} · 訪談對象 ${targetCount}`}
      />
    </section>
  );
}

function Stat({
  eyebrow,
  value,
  unit,
  caption,
}: {
  eyebrow: string;
  value: string;
  unit: string;
  caption: string;
}) {
  return (
    <div className="relative px-7 sm:px-9 py-9 sm:py-12 border-b sm:border-b-0 sm:border-r border-border-hairline last:border-0">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-text-tertiary">
        {eyebrow}
      </p>
      <p className="mt-5 font-display font-bold leading-[0.85] tracking-[-0.06em] text-text-primary">
        <span className="tabular-nums text-[80px] sm:text-[112px] lg:text-[128px]">{value}</span>
        <span className="ml-2 sm:ml-3 font-mono text-[14px] sm:text-[16px] uppercase tracking-[0.08em] text-text-tertiary align-top inline-block translate-y-2 sm:translate-y-3">
          {unit}
        </span>
      </p>
      <p className="mt-5 text-[13px] leading-[1.55] text-text-secondary">{caption}</p>
    </div>
  );
}
