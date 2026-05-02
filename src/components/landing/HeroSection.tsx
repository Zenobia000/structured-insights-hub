/**
 * HeroSection — landing 第一屏 (Grok Hero pattern)。
 *
 * Grok pattern:
 * - Eyebrow.dotted 開場
 * - display.2xl 主標題（96px desktop / 56px mobile）
 * - spotlight-top + dot-dim 背景組合
 * - 序列進場：eyebrow → headline → subheadline → CTA
 * - Hero 全寬不受 1280 限制（spec 例外）
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProgressVisual } from "./ProgressVisual";
import { Eyebrow } from "@/components/ui/eyebrow";
import { startNewPainCard } from "@/lib/painCardActions";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-canvas-base bg-spotlight-top"
    >
      {/* Dot grid texture overlay */}
      <div aria-hidden className="absolute inset-0 bg-dot-dim opacity-50" />
      {/* Bottom hairline */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border-hairline" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: copy (col 1-7) */}
          <div className="lg:col-span-7">
            <div className="animate-grok-fade-up" style={{ animationDelay: "0ms" }}>
              <Eyebrow variant="dotted">PainMap Worksheet · 9 張卡，陪你走一次</Eyebrow>
            </div>

            <h1
              id="hero-headline"
              className="mt-6 font-display text-[44px] sm:text-6xl lg:text-[80px] xl:text-[96px] font-bold leading-[0.96] tracking-[-0.04em] text-text-primary animate-grok-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <span className="bg-gradient-to-r from-text-primary via-accent-electric to-text-primary bg-clip-text text-transparent">
                痛點 ID card
              </span>
            </h1>

            <p
              className="mt-8 max-w-xl text-base sm:text-lg leading-[1.7] text-text-secondary animate-grok-fade-up"
              style={{ animationDelay: "280ms" }}
            >
              這份填空簿陪你做的事很簡單：把那句話原原本本寫下來，找出說這句話的人，再用 AI
              找證據對照你自己的猜測。第一次 90 分鐘，熟了 30 分鐘 — 你只需要會抄、會問、會打電話。
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row gap-3 animate-grok-fade-up"
              style={{ animationDelay: "420ms" }}
            >
              <button
                type="button"
                onClick={handleStart}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-text-primary px-6 text-[15px] font-medium text-text-inverse transition-all duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
              >
                從第一張卡開始
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link
                to="/"
                hash="three-step-teaching"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-default bg-transparent px-6 text-[15px] font-medium text-text-primary transition-colors duration-200 hover:bg-surface-hover hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base"
              >
                先看看 9 張卡長什麼樣
              </Link>
            </div>

            <p
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary animate-grok-fade-up"
              style={{ animationDelay: "560ms" }}
            >
              <span className="h-1 w-1 rounded-full bg-status-success" />
              No sign-up · Local-only · 隨時匯出帶走
            </p>
          </div>

          {/* Right: 9-dot ProgressVisual (col 8-12) */}
          <div className="lg:col-span-5 animate-grok-fade-up" style={{ animationDelay: "320ms" }}>
            <div className="relative rounded-lg border border-border-hairline bg-canvas-raised p-6 sm:p-8">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-lg bg-dot-dense opacity-40"
              />
              <Eyebrow variant="dotted" className="mb-4">
                Flow preview
              </Eyebrow>
              <p className="text-base font-semibold text-text-primary mb-1">9 張卡，3 個階段</p>
              <p className="text-[13px] leading-[1.6] text-text-tertiary mb-6">
                從聽見一句抱怨，到寫下你自己的判斷 — 陪你走完一次。
              </p>
              <ProgressVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
