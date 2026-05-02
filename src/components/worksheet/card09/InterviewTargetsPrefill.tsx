/**
 * InterviewTargetsPrefill — 卡 9 內的「訪談目標預填」面板
 *
 * 用途：
 * - 從卡 8 的 interview_plan.targets 自動帶入 personas + 聯絡資訊
 * - 依目前 judgment + next_action 動態決定顯示策略
 *   - judgment ∈ {true_pain, pending_interview} 且 next_action = interview
 *     → 顯示「優先聯絡」清單（有 contact_info 的優先）
 *   - next_action = more_evidence → 提示先補證據再回來看訪談對象
 *   - next_action = change_topic 或 judgment = fake_pain
 *     → 提示這次不需訪談；保留原始清單供使用者自行決定
 *
 * 規則：
 * - 只讀，不回寫卡 8 資料（避免反向覆寫使用者在卡 8 已填的內容）
 * - 「複製聯絡資訊」按鈕方便使用者進入訪談排程
 */

import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Users, AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

import type { Judgment, NextAction, PainCard } from "@/types/painCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Target = PainCard["interview_plan"]["targets"][number];

type Props = {
  targets: Target[];
  judgment: Judgment | null;
  nextAction: NextAction | null;
};

type Mode =
  | "prioritize_contact" // 真痛點/待訪談 + interview
  | "gather_more_first" // next_action = more_evidence
  | "no_interview" // fake_pain 或 change_topic
  | "needs_judgment"; // 尚未選 judgment

function deriveMode(j: Judgment | null, na: NextAction | null): Mode {
  if (j === null) return "needs_judgment";
  if (na === "more_evidence") return "gather_more_first";
  if (na === "change_topic" || j === "fake_pain") return "no_interview";
  if (na === "interview") return "prioritize_contact";
  // 已選 judgment 但尚未選 next_action：默認顯示優先聯絡
  return "prioritize_contact";
}

export function InterviewTargetsPrefill({ targets, judgment, nextAction }: Props) {
  const mode = deriveMode(judgment, nextAction);

  const sorted = useMemo(() => {
    // 有聯絡資訊的排前面，再按 persona 是否填寫
    const withPersona = targets.filter((t) => t.persona.trim().length > 0);
    return [...withPersona].sort((a, b) => {
      const aHas = a.contact_known && a.contact_info.trim().length > 0 ? 1 : 0;
      const bHas = b.contact_known && b.contact_info.trim().length > 0 ? 1 : 0;
      return bHas - aHas;
    });
  }, [targets]);

  const contactReady = sorted.filter((t) => t.contact_known && t.contact_info.trim().length > 0);
  const contactMissing = sorted.filter(
    (t) => !t.contact_known || t.contact_info.trim().length === 0,
  );

  const empty = sorted.length === 0;

  return (
    <section
      aria-label="訪談目標預填"
      className="rounded-lg bg-surface border border-border border-l-4 border-l-secondary p-5 sm:p-6 space-y-4 max-w-3xl"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-text-primary flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" aria-hidden />
            訪談目標（自動從卡 8 帶入）
          </h2>
          <p className="text-[13px] text-text-secondary leading-[1.55] mt-1">
            <ModeBlurb mode={mode} judgment={judgment} nextAction={nextAction} />
          </p>
        </div>
        <Link
          to="/learn/worksheet/08"
          className="text-[12.5px] text-secondary hover:underline shrink-0"
        >
          回卡 8 編輯 →
        </Link>
      </header>

      {empty ? (
        <EmptyHint />
      ) : mode === "no_interview" ? (
        <NoInterviewBlock targets={sorted} />
      ) : mode === "gather_more_first" ? (
        <GatherMoreBlock targets={sorted} />
      ) : (
        <PrioritizeBlock contactReady={contactReady} contactMissing={contactMissing} />
      )}
    </section>
  );
}

function ModeBlurb({
  mode,
  judgment,
  nextAction,
}: {
  mode: Mode;
  judgment: Judgment | null;
  nextAction: NextAction | null;
}) {
  if (mode === "needs_judgment") {
    return <>選好「真 / 假 / 待訪談」後，這裡會根據判斷推薦誰先訪談。</>;
  }
  if (mode === "no_interview") {
    return (
      <>
        目前判斷：
        <strong className="text-text-primary">{judgment === "fake_pain" ? "假痛點" : "—"}</strong>
        ／下一步：
        <strong className="text-text-primary">
          {nextAction === "change_topic" ? "換題目" : "—"}
        </strong>
        。這次不需訪談，原始名單保留作參考。
      </>
    );
  }
  if (mode === "gather_more_first") {
    return <>下一步是「補證據」。先回卡 6 跑一輪 AI，再回來看訪談對象。</>;
  }
  return <>下一步是「訪談」。優先聯絡有資訊的對象；缺聯絡的需要先補上才能約。</>;
}

function EmptyHint() {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-caution/40 bg-caution/5 px-3 py-2.5 text-[13px] leading-[1.55] text-text-primary">
      <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
      <span>
        卡 8 還沒填任何 persona。
        <Link to="/learn/worksheet/08" className="text-secondary hover:underline ml-1">
          去卡 8 補上
        </Link>
        後再回來，這裡就會自動列出訪談對象。
      </span>
    </div>
  );
}

function PrioritizeBlock({
  contactReady,
  contactMissing,
}: {
  contactReady: Target[];
  contactMissing: Target[];
}) {
  return (
    <div className="space-y-4">
      {contactReady.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[13.5px] font-semibold text-verified flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            可優先聯絡（{contactReady.length}）
          </h3>
          <ul className="space-y-2">
            {contactReady.map((t, i) => (
              <TargetRow key={i} target={t} ready />
            ))}
          </ul>
        </div>
      )}
      {contactMissing.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[13.5px] font-semibold text-caution">
            缺聯絡資訊（{contactMissing.length}）— 需要回卡 8 補上
          </h3>
          <ul className="space-y-2">
            {contactMissing.map((t, i) => (
              <TargetRow key={i} target={t} ready={false} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GatherMoreBlock({ targets }: { targets: Target[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5 rounded-md border border-secondary/30 bg-secondary/5 px-3 py-2.5 text-[13px] leading-[1.55] text-text-primary">
        <AlertCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" aria-hidden />
        <span>目前選擇「補證據」優先。下面是卡 8 已列的對象，補完證據後再回來確認名單。</span>
      </div>
      <ul className="space-y-2">
        {targets.map((t, i) => (
          <TargetRow key={i} target={t} ready={false} muted />
        ))}
      </ul>
    </div>
  );
}

function NoInterviewBlock({ targets }: { targets: Target[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5 rounded-md border border-text-muted/30 bg-muted/30 px-3 py-2.5 text-[13px] leading-[1.55] text-text-primary">
        <AlertCircle className="h-4 w-4 text-text-muted shrink-0 mt-0.5" aria-hidden />
        <span>這次判斷不需訪談。卡 8 名單保留下來，未來換題目時可回來重看誰仍可聯絡。</span>
      </div>
      <details className="text-[13px] text-text-secondary">
        <summary className="cursor-pointer hover:text-text-primary">
          顯示原始名單（{targets.length}）
        </summary>
        <ul className="space-y-2 mt-2">
          {targets.map((t, i) => (
            <TargetRow key={i} target={t} ready={false} muted />
          ))}
        </ul>
      </details>
    </div>
  );
}

function TargetRow({ target, ready, muted }: { target: Target; ready: boolean; muted?: boolean }) {
  const [copied, setCopied] = useState(false);
  const hasContact = target.contact_known && target.contact_info.trim().length > 0;

  function copyContact() {
    if (!hasContact) return;
    void navigator.clipboard.writeText(`${target.persona} — ${target.contact_info}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <li
      className={cn(
        "rounded-md border px-3 py-2.5 flex items-start gap-3",
        ready ? "border-verified/40 bg-verified/5" : "border-border bg-surface",
        muted && "opacity-70",
      )}
    >
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-[14px] font-semibold text-text-primary truncate">
          {target.persona || <span className="italic text-text-muted">（未命名 persona）</span>}
        </p>
        {hasContact ? (
          <p className="text-[12.5px] font-mono text-text-secondary truncate">
            {target.contact_info}
          </p>
        ) : (
          <p className="text-[12px] text-caution">缺聯絡資訊</p>
        )}
        {target.planned_time.trim().length > 0 && (
          <p className="text-[11.5px] text-text-muted">預計時間：{target.planned_time}</p>
        )}
      </div>
      {hasContact && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copyContact}
          className="h-8 px-2 text-[12px] shrink-0"
          aria-label="複製 persona 與聯絡資訊"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" /> 已複製
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" /> 複製
            </>
          )}
        </Button>
      )}
    </li>
  );
}
