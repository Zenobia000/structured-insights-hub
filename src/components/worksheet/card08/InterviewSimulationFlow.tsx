/**
 * InterviewSimulationFlow — 卡 8 三階段虛擬訪談 + 訪綱產出
 *
 * Stage 1（既有 ai_simulated_response 重構）：AI 演主人翁回答 3 題
 * Stage 2（新增 ai_audit_findings）：UX researcher 視角審查 stage 1
 * Stage 3（新增 interview_guide_md）：產出可帶走的 UX 訪綱
 *
 * 三階段全 copy-paste pattern（外部 ChatGPT），與 Iron Law #5 一致。
 * 全程 optional — 不影響卡 8 → 卡 9 推進條件。
 */
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Lock } from "lucide-react";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { AuditFindingsPanel } from "@/components/worksheet/card08/AuditFindingsPanel";
import { InterviewGuidePreview } from "@/components/worksheet/card08/InterviewGuidePreview";
import { buildAuditPrompt, buildGuidePrompt, buildSimulationPrompt } from "@/lib/cardEightPrompts";
import { cn } from "@/lib/utils";
import type { PainCard } from "@/types/painCard";

const STAGE_2_UNLOCK_MIN = 50;
const STAGE_3_UNLOCK_MIN = 50;
const GUIDE_MIN_LENGTH = 200;

type Props = {
  card: PainCard;
  onSimulationChange: (v: string) => void;
  onAuditChange: (v: string) => void;
  onGuideChange: (v: string) => void;
  onGuideGenerated: () => void;
};

export function InterviewSimulationFlow({
  card,
  onSimulationChange,
  onAuditChange,
  onGuideChange,
  onGuideGenerated,
}: Props) {
  const ip = card.interview_plan;
  const persona = ip.targets[0]?.persona ?? "";
  const stuckFormula = card.stuck_formula.ai_polished?.trim() ?? "";

  const simulation = ip.ai_simulated_response ?? "";
  const audit = ip.ai_audit_findings ?? "";
  const guide = ip.interview_guide_md ?? "";

  const stage1Done = simulation.trim().length >= STAGE_2_UNLOCK_MIN;
  const stage2Done = audit.trim().length >= STAGE_3_UNLOCK_MIN;
  const stage3Done = guide.trim().length >= GUIDE_MIN_LENGTH;

  // 預設展開到「下一個還沒完成的階段」
  const [openStage, setOpenStage] = useState<1 | 2 | 3 | null>(() => {
    if (!stage1Done) return 1;
    if (!stage2Done) return 2;
    if (!stage3Done) return 3;
    return null;
  });

  const simulationPrompt = useMemo(
    () => buildSimulationPrompt({ persona, stuckFormula, questions: ip.questions }),
    [persona, stuckFormula, ip.questions],
  );

  const auditPrompt = useMemo(
    () =>
      buildAuditPrompt({
        simulationResponse: simulation,
        questions: ip.questions,
      }),
    [simulation, ip.questions],
  );

  const guidePrompt = useMemo(
    () =>
      buildGuidePrompt({
        simulationResponse: simulation,
        auditFindings: audit,
        card,
      }),
    [simulation, audit, card],
  );

  function handleGuideChange(v: string) {
    onGuideChange(v);
    if (v.trim().length >= GUIDE_MIN_LENGTH && !ip.guide_generated_at) {
      onGuideGenerated();
    }
  }

  return (
    <section className="rounded-lg border border-border-hairline bg-canvas-raised">
      <header className="px-5 py-4 border-b border-border-subtle">
        <h2 className="text-[16px] font-semibold text-text-primary">
          （可選）三階段虛擬訪談 → 帶走一份訪綱
        </h2>
        <p className="mt-1.5 text-[13px] leading-[1.6] text-text-secondary">
          先讓 AI 演一遍受訪者、再讓 AI 用 UX
          研究員的眼光審查、最後幫你整理成可以列印帶去現場的訪綱。
          <span className="text-text-tertiary">這份只是熱身 — 真人訪談永遠不可少。</span>
        </p>
      </header>

      <div className="divide-y divide-border-subtle">
        <StageRow
          stage={1}
          title="先請 AI 演一遍"
          subtitle="AI 扮演主人翁，回答你寫的 3 題訪談題"
          done={stage1Done}
          locked={false}
          open={openStage === 1}
          onToggle={() => setOpenStage(openStage === 1 ? null : 1)}
        >
          <AIPromptCopyBlock
            prompt={simulationPrompt}
            response={simulation}
            onResponseChange={onSimulationChange}
            title="🎭 Stage 1 · AI 模擬訪談 prompt"
          />
        </StageRow>

        <StageRow
          stage={2}
          title="再讓 UX 研究員看一眼"
          subtitle="找出哪幾題太誘導、AI 哪邊「太完美」、缺哪些 follow-up probe"
          done={stage2Done}
          locked={!stage1Done}
          lockedHint="先在 Stage 1 貼回 AI 模擬回覆（至少 50 字）"
          open={openStage === 2}
          onToggle={() => setOpenStage(openStage === 2 ? null : 2)}
        >
          <AIPromptCopyBlock
            prompt={auditPrompt}
            response={audit}
            onResponseChange={onAuditChange}
            title="🔍 Stage 2 · UX 研究員 audit prompt"
          />
          {audit.trim().length > 0 && <AuditFindingsPanel content={audit} />}
        </StageRow>

        <StageRow
          stage={3}
          title="最後幫你整理成訪綱"
          subtitle="符合 UX 標準的訪綱：暖場 / 主軸 / probe / 結尾 / 訪談者備忘"
          done={stage3Done}
          locked={!stage2Done}
          lockedHint="先在 Stage 2 貼回 audit 結果（至少 50 字）"
          open={openStage === 3}
          onToggle={() => setOpenStage(openStage === 3 ? null : 3)}
        >
          <AIPromptCopyBlock
            prompt={guidePrompt}
            response={guide}
            onResponseChange={handleGuideChange}
            title="📋 Stage 3 · 訪綱產出 prompt"
          />
          {guide.trim().length > 0 && <InterviewGuidePreview content={guide} card={card} />}
        </StageRow>
      </div>

      <footer className="flex items-start gap-2.5 px-5 py-4 border-t border-border-subtle bg-canvas-base/40 text-[13px] leading-[1.6] text-text-secondary">
        <AlertTriangle className="h-4 w-4 text-status-warning shrink-0 mt-0.5" aria-hidden />
        <p>
          AI 給不了你真人現場的沉默、猶豫、身體語言。這份訪綱寫好之後，
          <span className="text-text-primary font-semibold">記得真的拿去找真人問。</span>
        </p>
      </footer>
    </section>
  );
}

type StageRowProps = {
  stage: 1 | 2 | 3;
  title: string;
  subtitle: string;
  done: boolean;
  locked: boolean;
  lockedHint?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function StageRow({
  stage,
  title,
  subtitle,
  done,
  locked,
  lockedHint,
  open,
  onToggle,
  children,
}: StageRowProps) {
  return (
    <div className={cn("transition-colors", locked && "opacity-60")}>
      <button
        type="button"
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-5 py-4 text-left",
          !locked && "hover:bg-surface-hover",
          "disabled:cursor-not-allowed",
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold",
              done
                ? "bg-status-success-bg text-status-success ring-1 ring-status-success/30"
                : locked
                  ? "bg-surface-elevated text-text-tertiary"
                  : "bg-accent-electric-subtle text-accent-electric ring-1 ring-accent-electric/20",
            )}
          >
            {locked ? <Lock className="h-3 w-3" /> : `0${stage}`}
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-text-primary">{title}</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.55] text-text-tertiary truncate">
              {locked && lockedHint ? lockedHint : subtitle}
            </p>
          </div>
        </div>
        {!locked &&
          (open ? (
            <ChevronDown className="h-4 w-4 text-text-tertiary shrink-0" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-tertiary shrink-0" aria-hidden />
          ))}
      </button>

      {open && !locked && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}
