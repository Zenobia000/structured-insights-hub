/**
 * 共用的卡片 stub 頁面殼。骨架階段：標題 + 目標說明 + 欄位 label 占位 + ExitGate。
 * 真實表單與檢查邏輯之後再貼。
 */

import { ExitGateCheck, type GateCheck } from "@/components/worksheet/ExitGateCheck";

type Props = {
  cardNumber: number;
  title: string;
  goal: string;
  /** 此卡的欄位 label（純文字占位，無實際 input） */
  fields: string[];
  /** Exit gate checklist 文字（passed 一律 false，待實作） */
  checks: string[];
};

export function CardStub({ cardNumber, title, goal, fields, checks }: Props) {
  const gateChecks: GateCheck[] = checks.map((label) => ({ label, passed: false }));

  return (
    <article className="flex flex-col min-h-[calc(100vh-180px)]">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-medium text-secondary tracking-wider uppercase">
            卡 {cardNumber} / 9
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {title}
          </h1>
          <p className="text-text-secondary leading-relaxed">{goal}</p>
        </header>

        <section className="rounded-lg border border-dashed border-border bg-muted-bg/40 p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            這張卡要填的欄位
          </h2>
          <ul className="space-y-2">
            {fields.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-text-muted shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-text-muted italic">
            （此頁尚未實作。表單與 AI 互動將在下一輪貼上。）
          </p>
        </section>
      </div>

      <ExitGateCheck checks={gateChecks} hint="此頁的檢查邏輯尚未實作。" />
    </article>
  );
}
