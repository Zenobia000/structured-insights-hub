/**
 * PainIdCard — 痛點身份證視覺核心 (Grok Bento large card)
 *
 * 9 個欄位垂直堆疊；不再有 Pain Quality / 教學模式相關 UI。
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, X, Clock } from "lucide-react";

import { usePainCardStore } from "@/store/painCard";
import { NEXT_ACTION_LABEL, sacrificedLabel } from "@/lib/cardTenExport";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

function FieldBlock({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 md:gap-8 py-6 border-b border-border-subtle last:border-b-0">
      <div className="md:pt-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          {String(index).padStart(2, "0")} / {label}
        </p>
      </div>
      <div className="text-text-primary text-[15px] leading-[1.7] space-y-2">{children}</div>
    </section>
  );
}

function Empty() {
  return <span className="text-text-tertiary italic">（未填）</span>;
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.6]">
      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary mr-2">
        {label}
      </span>
      <span className="text-text-primary">{value}</span>
    </p>
  );
}

export function PainIdCard() {
  const card = usePainCardStore((s) => s.card);
  const [tableExpanded, setTableExpanded] = useState(false);

  const firstPerson = card.people.list[0];
  const stuck = card.stuck_formula.ai_polished;
  const dis = card.workaround.user_dissatisfactions.slice(0, 3);
  const targets = card.interview_plan.targets;
  const qs = card.interview_plan.questions.slice(0, 3);
  const j = card.verdict.judgment;
  const judgmentBadge = (() => {
    if (j === "true_pain")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-status-success/40 bg-status-success-bg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-status-success">
          <CheckCircle2 className="h-3 w-3" /> True pain
        </span>
      );
    if (j === "fake_pain")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface-elevated px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-secondary">
          <X className="h-3 w-3" /> Fake pain
        </span>
      );
    if (j === "pending_interview")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-status-warning/40 bg-status-warning-bg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-status-warning">
          <Clock className="h-3 w-3" /> Pending interview
        </span>
      );
    return null;
  })();

  const tableLines = (card.self_guess.pain_judgment_table || "").split("\n");
  const tablePreview = tableLines.slice(0, 5).join("\n");
  const hasMoreTable = tableLines.length > 5;

  return (
    <article
      id="pain-id-card-print"
      className="relative isolate overflow-hidden max-w-4xl mx-auto rounded-lg border border-accent-electric/30 bg-canvas-raised glow-accent-sm"
    >
      {/* Subtle glow background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 800px 400px at 50% 0%, var(--accent-glow-soft), transparent 70%)",
        }}
      />

      {/* Header bar */}
      <div className="border-b border-border-hairline bg-canvas-overlay/50 px-6 sm:px-10 py-5">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow variant="numbered" index={10}>
            Pain ID Card · {card.id?.slice(0, 8) || "DRAFT"}
          </Eyebrow>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
            ◆ painmap
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-primary">
          痛點身份證
        </h2>
      </div>

      <div className="px-6 sm:px-10 py-2">
        <FieldBlock label="主人翁" index={1}>
          {firstPerson?.name ? (
            <p>
              <strong className="text-text-primary">{firstPerson.name}</strong>
              <span className="text-text-secondary">（{firstPerson.relation}）</span>
            </p>
          ) : (
            <Empty />
          )}
        </FieldBlock>

        <FieldBlock label="場景" index={2}>
          {card.complaint.verbatim ? (
            <blockquote className="border-l-2 border-accent-electric pl-4 italic text-text-secondary">
              {card.complaint.verbatim.length > 200
                ? card.complaint.verbatim.slice(0, 200) + "…"
                : card.complaint.verbatim}
            </blockquote>
          ) : (
            <Empty />
          )}
          <Meta label="卡關公式" value={stuck || <Empty />} />
        </FieldBlock>

        <FieldBlock label="現在怎麼解" index={3}>
          <Meta label="工具/方法" value={card.workaround.tool_name || <Empty />} />
          {dis.length > 0 && (
            <ul className="space-y-1.5 text-text-secondary mt-2">
              {dis.map((d, i) => (
                <li key={i} className="flex gap-2 text-[14px]">
                  <span className="text-accent-electric shrink-0">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </FieldBlock>

        <FieldBlock label="兩件事不能同時要" index={4}>
          <Meta label="A 端" value={card.contradiction.side_a || <Empty />} />
          <Meta label="B 端" value={card.contradiction.side_b || <Empty />} />
          <Meta label="通常犧牲" value={sacrificedLabel(card)} />
          <Meta label="犧牲理由" value={card.contradiction.sacrificed_reason || <Empty />} />
        </FieldBlock>

        <FieldBlock label="AI 找到的證據" index={5}>
          {card.self_guess.pain_judgment_table ? (
            <>
              <pre className="font-mono text-[12px] whitespace-pre-wrap rounded-md border border-border-hairline bg-canvas-sunken p-4 overflow-x-auto text-text-secondary">
                {tableExpanded ? card.self_guess.pain_judgment_table : tablePreview}
              </pre>
              {hasMoreTable && (
                <button
                  type="button"
                  onClick={() => setTableExpanded((x) => !x)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.06em] text-accent-electric hover:text-accent-electric-hover transition-colors"
                >
                  {tableExpanded ? (
                    <>
                      Collapse <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Expand full table <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <Empty />
          )}
          <Meta label="AI 工具" value={card.ai_evidence.ai_tool ?? <Empty />} />
        </FieldBlock>

        <FieldBlock label="我猜 vs AI 答的差異" index={6}>
          <Meta label="最大差異" value={card.self_guess.deltas.biggest_diff || <Empty />} />
          <Meta label="AI 補了" value={card.self_guess.deltas.ai_added || <Empty />} />
          <Meta
            label="我猜但 AI 沒支持"
            value={card.self_guess.deltas.guess_unsupported || <Empty />}
          />
        </FieldBlock>

        <FieldBlock label="我會優先訪談" index={7}>
          {targets[0] ? (
            <>
              <Meta label="對象" value={targets[0].persona} />
              {targets[0].contact_info && (
                <p className="text-[13px] text-text-tertiary">{targets[0].contact_info}</p>
              )}
            </>
          ) : (
            <Empty />
          )}
          {qs.length > 0 && (
            <ol className="space-y-1.5 text-text-secondary pt-1 text-[14px]">
              {qs.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[11px] text-text-tertiary tabular-nums shrink-0 mt-1">
                    Q{i + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          )}
        </FieldBlock>

        <FieldBlock label="我的判斷" index={8}>
          <div className="flex items-center gap-3 flex-wrap">{judgmentBadge ?? <Empty />}</div>
          {card.verdict.reason_100w && (
            <p className="text-text-secondary leading-[1.7] pt-2">{card.verdict.reason_100w}</p>
          )}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <Meta
              label="最有把握"
              value={card.verdict.most_confident_evidence || <Empty />}
            />
            <Meta label="最沒把握" value={card.verdict.least_confident || <Empty />} />
          </div>
        </FieldBlock>

        <FieldBlock label="下一步" index={9}>
          {card.verdict.next_action ? (
            <p className="font-medium text-accent-electric">
              → {NEXT_ACTION_LABEL[card.verdict.next_action]}
            </p>
          ) : (
            <Empty />
          )}
        </FieldBlock>
      </div>

      {/* Footer signature */}
      <div
        className={cn(
          "border-t border-border-hairline bg-canvas-overlay/40 px-6 sm:px-10 py-5 text-center",
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </p>
        <p className="mt-3 font-mono text-[11px] tabular-nums text-text-tertiary">
          建立 {card.created_at.slice(0, 10)} · 最後檢核{" "}
          {card.updated_at.slice(0, 16).replace("T", " ")}
        </p>
      </div>
    </article>
  );
}
