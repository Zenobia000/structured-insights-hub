/**
 * NextStepCta — 依 verdict.judgment 的三變體 CTA (Grok dark)
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { usePainCardStore } from "@/store/painCard";
import { cn } from "@/lib/utils";

export function NextStepCta() {
  const card = usePainCardStore((s) => s.card);
  const j = card.verdict.judgment;

  const wrapClass = cn(
    "relative isolate overflow-hidden max-w-4xl mx-auto rounded-lg p-8 sm:p-10 border bg-canvas-raised",
    j === "true_pain" && "border-accent-electric/40 glow-accent-sm",
    j === "pending_interview" && "border-status-warning/30",
    j === "fake_pain" && "border-border-default",
    !j && "border-border-hairline",
  );

  const eyebrowText =
    j === "true_pain"
      ? "Verdict · ✓ Verified pain"
      : j === "pending_interview"
        ? "Verdict · pending interview"
        : j === "fake_pain"
          ? "Verdict · archived (fake)"
          : "Verdict · pending";

  return (
    <section className={wrapClass}>
      {j === "true_pain" && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 600px 200px at 50% 0%, var(--accent-glow-mid), transparent 70%)",
          }}
        />
      )}
      <Eyebrow variant="dotted">{eyebrowText}</Eyebrow>
      <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-5">
        那麼，接下來呢？
      </h2>
      {j === "true_pain" && <TruePainVariant />}
      {j === "pending_interview" && <PendingInterviewVariant />}
      {j === "fake_pain" && <FakePainVariant />}
      {!j && (
        <p className="text-text-secondary text-[14px]">
          卡 9 的真假判斷還沒寫，
          <Link
            to="/learn/worksheet/09"
            className="text-accent-electric hover:text-accent-electric-hover underline underline-offset-2"
          >
            回去寫一下
          </Link>
        </p>
      )}
    </section>
  );
}

function PrimaryButton({
  children,
  href,
  to,
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
}) {
  const cls =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent-electric px-5 text-[14px] font-medium text-text-primary transition-all hover:bg-accent-electric-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-raised";
  if (href)
    return (
      <a href={href} rel="noopener" className={cls}>
        {children}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  return (
    <Link to={to as "/learn/worksheet/08"} className={cls}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function GhostButton({
  children,
  to,
  onClick,
}: {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
}) {
  const cls =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-default bg-transparent px-5 text-[14px] font-medium text-text-primary transition-colors hover:bg-surface-hover hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-raised";
  if (to)
    return (
      <Link to={to as "/learn/worksheet/08"} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function TruePainVariant() {
  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你寫下了：這是真痛點。
      </p>
      <p className="mt-3 text-text-secondary text-[15px] leading-[1.7]">
        把卡 8 的訪談對象一個一個約起來、現場再確認一次。確認沒問題之後，可以進階段二：PainMap App，再往「能不能賺到錢」走一步。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <PrimaryButton href="/app/start">進入 PainMap App</PrimaryButton>
        <GhostButton to="/learn/worksheet/08">先去訪談（卡 8 名單）</GhostButton>
      </div>
      <Link
        to="/learn/worksheet/01"
        className="inline-block mt-4 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary hover:text-accent-electric transition-colors"
      >
        ← 我想從頭再讀一次
      </Link>
    </>
  );
}

function PendingInterviewVariant() {
  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你還拿不準 — 這是最常見的結果，很正常，不用為此焦慮。
      </p>
      <p className="mt-3 text-text-secondary text-[15px] leading-[1.7]">
        去找 2-3 個真人聊一聊再回來。通常聊完之後，真假會自己浮出來。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <PrimaryButton to="/learn/worksheet/08">看看要找誰聊</PrimaryButton>
        <GhostButton to="/learn/worksheet/09">聊完之後回來再判一次</GhostButton>
      </div>
    </>
  );
}

function FakePainVariant() {
  const reset = usePainCardStore((s) => s.reset);
  const handleNew = () => {
    if (confirm("要新寫一張嗎？這張會被新的覆蓋掉（建議先匯出 .md 留個備份）。")) {
      reset();
      window.location.href = "/learn/worksheet/01";
    }
  };

  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你寫下了：這是假痛點。
      </p>
      <p className="mt-3 text-text-secondary text-[15px] leading-[1.7]">
        <strong className="text-text-primary">
          不要覺得可惜。這就是這份填空簿真正的價值 — 它幫你省下了 3 個月走錯路的時間。
        </strong>{" "}
        換個題目，從卡 1 重新走一遍。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <GhostButton onClick={handleNew}>換個題目，從卡 1 開始</GhostButton>
        <GhostButton to="/learn/worksheet/09">回卡 9 重看一次判斷</GhostButton>
      </div>
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-tertiary">
        這張已經幫你封存起來了 — 匯出之後，當作一次經驗留下來也很值得。
      </p>
    </>
  );
}
