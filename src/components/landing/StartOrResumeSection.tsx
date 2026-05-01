/**
 * StartOrResumeSection — 「開始新的」與「繼續未完成」並列。
 *
 * resume_card 顯示條件由 useResumeCard hook 判斷（hydration-safe）。
 */
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { SectionFade } from "./SectionFade";
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
    | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09";
  return (`/learn/worksheet/${n}`) as
    | "/learn/worksheet/01" | "/learn/worksheet/02" | "/learn/worksheet/03"
    | "/learn/worksheet/04" | "/learn/worksheet/05" | "/learn/worksheet/06"
    | "/learn/worksheet/07" | "/learn/worksheet/08" | "/learn/worksheet/09";
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
      className="bg-page border-b border-border"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2
          id="start-resume-title"
          className="sr-only"
        >
          開始填寫或繼續未完成
        </h2>

        <div
          className={cn(
            "grid gap-4 md:gap-6",
            resume.showResume ? "md:grid-cols-2" : "md:grid-cols-1 max-w-xl mx-auto",
          )}
        >
          {/* Start card */}
          <article className="rounded-xl border-2 border-accent/40 bg-accent-light/40 p-6 sm:p-7 flex flex-col">
            <h3 className="text-[18px] font-semibold text-text-primary">
              30 秒開始新的 PainCard
            </h3>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-text-secondary">
              建立一張空白的痛點身份證，從卡 1 開始填。
            </p>
            <p className="mt-3 text-xs text-text-muted leading-[1.5]">
              你需要：一個你最近反覆遇到的麻煩 + 30 分鐘不被打擾的時間。
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground px-5 py-3 font-semibold hover:bg-accent/90 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
            >
              建立新 PainCard
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>

          {/* Resume card — 只在有未完成時顯示 */}
          {resume.showResume && (
            <article className="rounded-xl border border-secondary/40 bg-surface p-6 sm:p-7 flex flex-col">
              <h3 className="text-[18px] font-semibold text-text-primary">
                我有未完成的 PainCard
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-text-secondary">
                上次填到「卡 {resume.currentStep}：{resume.cardName}」，繼續嗎？
              </p>
              <p className="mt-3 text-xs text-text-muted leading-[1.5]">
                建立於 {formatDateTime(resume.createdAt)} · 最後修改 {formatDateTime(resume.updatedAt)}
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleResume}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground px-5 py-3 font-semibold hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                >
                  繼續上次的進度
                  <ArrowRight className="h-4 w-4" />
                </button>

                <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:border-text-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      捨棄重新開始
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>確定要捨棄這份 PainCard？</AlertDialogTitle>
                      <AlertDialogDescription>
                        這個動作會清除瀏覽器內目前儲存的進度，無法復原。建議先匯出 Markdown / JSON 後再捨棄。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDiscard}>
                        確定捨棄
                      </AlertDialogAction>
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
