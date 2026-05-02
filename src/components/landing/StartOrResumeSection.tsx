/**
 * StartOrResumeSection — 「開始新的」與「繼續未完成」並列 (Grok CTA Block pattern)。
 *
 * resume_card 顯示條件由 useResumeCard hook 判斷（hydration-safe）。
 */
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { Eyebrow } from "@/components/ui/eyebrow";
import { useResumeCard } from "@/hooks/useResumeCard";
import { startNewPainCard } from "@/lib/painCardActions";
import { usePainCardStore } from "@/store/painCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { CurrentStep } from "@/types/painCard";

function formatDateTime(iso: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function stepToPath(step: CurrentStep) {
  if (step === 10) return "/learn/worksheet/result" as const;
  const n = String(step).padStart(2, "0") as
    | "01"
    | "02"
    | "03"
    | "04"
    | "05"
    | "06"
    | "07"
    | "08"
    | "09";
  return `/learn/worksheet/${n}` as
    | "/learn/worksheet/01"
    | "/learn/worksheet/02"
    | "/learn/worksheet/03"
    | "/learn/worksheet/04"
    | "/learn/worksheet/05"
    | "/learn/worksheet/06"
    | "/learn/worksheet/07"
    | "/learn/worksheet/08"
    | "/learn/worksheet/09";
}

export function StartOrResumeSection() {
  const navigate = useNavigate();
  const resume = useResumeCard();
  const reset = usePainCardStore((s) => s.reset);
  const [discardOpen, setDiscardOpen] = useState(false);

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  const handleResume = () => {
    navigate({ to: stepToPath(resume.currentStep) });
  };

  const handleDiscard = () => {
    reset();
    setDiscardOpen(false);
  };

  return (
    <SectionFade
      ariaLabelledBy="start-resume-title"
      className="relative border-t border-border-hairline bg-canvas-base bg-spotlight-center"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 py-20 md:py-32">
        <div className="text-center mb-12">
          <Eyebrow variant="dotted" className="justify-center mx-auto">
            Ready when you are
          </Eyebrow>
          <h2
            id="start-resume-title"
            className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-text-primary"
          >
            從頭開始，
            <br />
            或接著上次寫。
          </h2>
        </div>

        <div
          className={cn(
            "grid gap-4 md:gap-6",
            resume.showResume ? "md:grid-cols-2" : "md:grid-cols-1 max-w-2xl mx-auto",
          )}
        >
          {/* Start card — primary highlight */}
          <article className="group relative rounded-lg border border-accent-electric/40 bg-canvas-raised p-7 md:p-8 flex flex-col overflow-hidden transition-all duration-300 hover:border-accent-electric hover:glow-accent-sm">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-50"
              style={{
                background:
                  "radial-gradient(ellipse 300px 200px at 100% 0%, rgba(91,141,239,0.10), transparent 70%)",
              }}
            />
            <Eyebrow variant="dotted" className="mb-4">
              New session
            </Eyebrow>
            <h3 className="text-xl font-semibold tracking-[-0.01em] text-text-primary">
              從頭開始，新寫一張
            </h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">
              從卡 1 開始，9 張卡走完，你會帶走一張屬於自己的痛點身份證。
            </p>
            <p className="mt-3 text-[12px] text-text-tertiary leading-[1.6]">
              開始之前，準備一件最近反覆讓你卡住的事 — 你自己的、或聽別人說的都行 — 加上 30
              分鐘不被打擾的時間。
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent-electric px-5 text-[14px] font-medium text-text-primary transition-all duration-200 hover:bg-accent-electric-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
            >
              開始第一張卡
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </article>

          {/* Resume card */}
          {resume.showResume && (
            <article className="group relative rounded-lg border border-border-default bg-canvas-raised p-7 md:p-8 flex flex-col transition-all duration-300 hover:border-border-strong hover:bg-surface-hover">
              <Eyebrow className="mb-4">
                Continue · Card {String(resume.currentStep).padStart(2, "0")}
              </Eyebrow>
              <h3 className="text-xl font-semibold tracking-[-0.01em] text-text-primary">
                你有一張寫到一半的卡
              </h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">
                上次寫到「卡 {resume.currentStep}：{resume.cardName}」 — 我們從那裡接著走？
              </p>
              <p className="mt-3 font-mono text-[11px] tabular-nums text-text-tertiary leading-[1.6]">
                Started · {formatDateTime(resume.createdAt)}
                <br />
                Last edit · {formatDateTime(resume.updatedAt)}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleResume}
                  className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-text-primary px-5 text-[14px] font-medium text-text-inverse transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
                >
                  從這裡接著寫
                  <ArrowRight className="h-4 w-4" />
                </button>

                <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border-default bg-transparent px-4 text-[13px] text-text-tertiary hover:text-text-primary hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      捨棄重來
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-canvas-overlay border-border-default">
                    <AlertDialogHeader>
                      <AlertDialogTitle>真的要捨棄這張卡嗎？</AlertDialogTitle>
                      <AlertDialogDescription className="text-text-secondary">
                        這會清掉你寫到一半的內容，沒辦法復原。如果想留個備份，先匯出 Markdown 或
                        JSON 再捨棄。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>先不要</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDiscard}>我確定，捨棄</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </article>
          )}
        </div>
      </div>
    </SectionFade>
  );
}
