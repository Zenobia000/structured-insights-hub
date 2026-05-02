/**
 * PainIdCard — 痛點身份證視覺核心（仿 worksheet ASCII 框架）
 *
 * 9 個欄位垂直堆疊；mode === 'production' 時隱藏 Pain Quality 區塊。
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { usePainCardStore } from "@/store/painCard";
import { useDisplayModeStore } from "@/store/displayMode";
import {
  JUDGMENT_LABEL,
  NEXT_ACTION_LABEL,
  trizLabel,
  sacrificedLabel,
} from "@/lib/cardTenExport";
import { cn } from "@/lib/utils";

const DECOR = "═══════════════════════════════════";

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-5 border-b border-border last:border-b-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
        {label}
      </h3>
      <div className="text-text-primary text-[15px] leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

function Empty() {
  return <span className="text-text-muted">（未填）</span>;
}

export function PainIdCard() {
  const card = usePainCardStore((s) => s.card);
  const mode = useDisplayModeStore((s) => s.mode);
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-verified-light text-verified">
          ✓ 真痛點
        </span>
      );
    if (j === "fake_pain")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-muted text-text-secondary">
          ✗ 假痛點
        </span>
      );
    if (j === "pending_interview")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-accent-light text-caution">
          ? 待訪談
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
      className="max-w-3xl mx-auto bg-surface rounded-lg shadow-sm border-2 border-primary-light px-6 sm:px-10 py-8 sm:py-10"
    >
      {/* 上裝飾線 + 標題 */}
      <div className="text-center mb-6 select-none">
        <div className="font-mono text-xs text-text-muted truncate" aria-hidden>
          {DECOR}
        </div>
        <h2 className="text-2xl font-bold text-text-primary my-3">痛點身份證</h2>
        <div className="font-mono text-xs text-text-muted truncate" aria-hidden>
          {DECOR}
        </div>
      </div>

      <div>
        <FieldBlock label="主人翁">
          {firstPerson?.name ? (
            <p>
              <strong>{firstPerson.name}</strong>
              <span className="text-text-secondary">（{firstPerson.relation}）</span>
            </p>
          ) : (
            <Empty />
          )}
        </FieldBlock>

        <FieldBlock label="場景">
          {card.complaint.verbatim ? (
            <blockquote className="border-l-2 border-secondary pl-3 text-text-secondary">
              {card.complaint.verbatim.length > 200
                ? card.complaint.verbatim.slice(0, 200) + "…"
                : card.complaint.verbatim}
            </blockquote>
          ) : (
            <Empty />
          )}
          <p className="text-sm">
            <span className="text-text-muted">卡關公式：</span>
            {stuck || <Empty />}
          </p>
        </FieldBlock>

        <FieldBlock label="他現在怎麼解">
          <p>
            <span className="text-text-muted">工具/方法：</span>
            {card.workaround.tool_name || <Empty />}
          </p>
          {dis.length > 0 && (
            <ul className="list-disc list-inside text-text-secondary">
              {dis.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </FieldBlock>

        <FieldBlock label="兩件事不能同時要">
          <p>
            <span className="text-text-muted">類型：</span>
            {trizLabel(card)}
          </p>
          <p>
            <span className="text-text-muted">A 端：</span>
            {card.contradiction.side_a || <Empty />}
          </p>
          <p>
            <span className="text-text-muted">B 端：</span>
            {card.contradiction.side_b || <Empty />}
          </p>
          <p>
            <span className="text-text-muted">通常犧牲：</span>
            {sacrificedLabel(card)}
          </p>
        </FieldBlock>

        <FieldBlock label="AI 找到的關鍵證據">
          {card.self_guess.pain_judgment_table ? (
            <>
              <pre className="font-mono text-xs whitespace-pre-wrap bg-muted-bg rounded p-3 overflow-x-auto">
                {tableExpanded ? card.self_guess.pain_judgment_table : tablePreview}
              </pre>
              {hasMoreTable && (
                <button
                  type="button"
                  onClick={() => setTableExpanded((x) => !x)}
                  className="text-xs text-secondary hover:underline inline-flex items-center gap-1"
                >
                  {tableExpanded ? (
                    <>
                      收合 <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      展開完整判斷表 <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <Empty />
          )}
          <p className="text-sm">
            <span className="text-text-muted">AI 工具：</span>
            {card.ai_evidence.ai_tool ?? <Empty />}
          </p>
        </FieldBlock>

        <FieldBlock label="我自己猜 vs AI 答的差異">
          <p>
            <span className="text-text-muted">最大差異：</span>
            {card.self_guess.deltas.biggest_diff || <Empty />}
          </p>
          <p>
            <span className="text-text-muted">AI 補了：</span>
            {card.self_guess.deltas.ai_added || <Empty />}
          </p>
          <p>
            <span className="text-text-muted">我猜但 AI 沒支持：</span>
            {card.self_guess.deltas.guess_unsupported || <Empty />}
          </p>
        </FieldBlock>

        <FieldBlock label="我會優先訪談">
          {targets[0] ? (
            <>
              <p>
                <span className="text-text-muted">對象：</span>
                {targets[0].persona}
              </p>
              {targets[0].contact_info && (
                <p className="text-sm text-text-secondary">{targets[0].contact_info}</p>
              )}
            </>
          ) : (
            <Empty />
          )}
          {qs.length > 0 && (
            <ol className="list-decimal list-inside text-text-secondary space-y-1 pt-1">
              {qs.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          )}
        </FieldBlock>

        <FieldBlock label="我的判斷">
          <div className="flex items-center gap-3 flex-wrap">
            {judgmentBadge ?? <Empty />}
          </div>
          {card.verdict.reason_100w && (
            <p className="text-text-secondary leading-relaxed pt-1">
              {card.verdict.reason_100w}
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-2 pt-2 text-sm">
            <p>
              <span className="text-text-muted">最有把握：</span>
              {card.verdict.most_confident_evidence || <Empty />}
            </p>
            <p>
              <span className="text-text-muted">最沒把握：</span>
              {card.verdict.least_confident || <Empty />}
            </p>
          </div>
        </FieldBlock>

        {mode === "teaching" && (
          <FieldBlock label="Pain Quality（5 維度反思）">
            <PainQualityBlock card={card} />
          </FieldBlock>
        )}

        <FieldBlock label="下一步">
          {card.verdict.next_action ? (
            <p className="font-medium">{NEXT_ACTION_LABEL[card.verdict.next_action]}</p>
          ) : (
            <Empty />
          )}
        </FieldBlock>
      </div>

      {/* 下裝飾 + 簽名線 */}
      <div className={cn("text-center mt-6 select-none")}>
        <div className="font-mono text-xs text-text-muted truncate" aria-hidden>
          {DECOR}
        </div>
        <p className="mt-3 text-xs text-text-muted">
          建立：{card.created_at.slice(0, 10)} ｜ 最後檢核：
          {card.updated_at.slice(0, 16).replace("T", " ")}
        </p>
      </div>
    </article>
  );
}

function PainQualityBlock({
  card,
}: {
  card: ReturnType<typeof usePainCardStore.getState>["card"];
}) {
  const s = card.verdict.scores;
  const items: Array<[string, number | null]> = [
    ["人群具體度", s.people_specificity],
    ["發生頻率", s.frequency],
    ["痛苦強度", s.intensity],
    ["現有解法不滿", s.workaround_dissatisfaction],
    ["證據可信度", s.evidence_credibility],
  ];
  return (
    <>
      <p className="text-text-primary font-semibold">
        總分：{card.verdict.total_score ?? "—"} / 25
      </p>
      <ul className="space-y-1 text-sm text-text-secondary">
        {items.map(([label, score]) => (
          <li key={label} className="flex justify-between max-w-xs">
            <span>{label}</span>
            <span className="font-mono">{score ?? "—"} / 5</span>
          </li>
        ))}
      </ul>
      <p className="text-xs italic text-text-muted pt-1">分數只是工具，不是答案。</p>
    </>
  );
}
