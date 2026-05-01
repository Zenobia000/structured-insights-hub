/**
 * HeroSection — landing 第一屏。
 *
 * 排版：Desktop 左右分欄（文案 + ProgressVisual）；Mobile 堆疊。
 * 例外：Hero 全寬不受 1200px Grid 限制（spec 例外規則 #1）。
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProgressVisual } from "./ProgressVisual";
import { SectionFade } from "./SectionFade";
import { startNewPainCard } from "@/lib/painCardActions";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  return (
    <SectionFade
      eager
      ariaLabelledBy="hero-headline"
      className="bg-page border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary mb-4">
              PainMap Worksheet · 教學模式
            </p>
            <h1
              id="hero-headline"
              className="text-3xl sm:text-4xl lg:text-[36px] font-bold leading-[1.2] tracking-tight text-text-primary"
            >
              9 張卡片填空，學會判斷一句抱怨
              <br className="hidden sm:block" />
              是真痛點還是假痛點。
            </h1>
            <p className="mt-6 text-base sm:text-[17px] leading-[1.7] text-text-secondary max-w-2xl">
              第一次 90 分鐘，熟練後 30 分鐘。你不需要懂創新理論、AI 模型、創業框架；你只需要會抄、會問、會打電話。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground px-6 py-3.5 font-semibold text-base shadow-sm hover:bg-accent/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              >
                30 秒開始第一張卡
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/"
                hash="three-step-teaching"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 py-3.5 font-medium text-text-primary hover:border-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              >
                看看 9 張卡片長什麼樣
              </Link>
            </div>
          </div>

          {/* Right: 9-dot ProgressVisual */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-[0_1px_3px_rgba(30,58,95,0.06)]">
              <p className="text-xs font-semibold text-text-secondary mb-1">
                你會走過的 9 個步驟
              </p>
              <p className="text-[11px] text-text-muted mb-5">
                每張卡都有明確產出，可隨時暫停儲存。
              </p>
              <ProgressVisual />
            </div>
          </div>
        </div>
      </div>
    </SectionFade>
  );
}
