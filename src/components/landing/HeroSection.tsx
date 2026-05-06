/**
 * HeroSection — landing 第一屏 (Editorial 5/7 split).
 *
 * Editorial principles:
 * - lg+: illustration occupies left 7 cols (≈58vw), copy occupies right 5 cols
 * - Mobile: illustration full-bleed on top, copy stacked below
 * - Headline scaled to clamp(56px, 8vw, 128px) so it fills 5-col gutter on desktop
 *   without overflow, while staying punchy on mobile
 * - Pure monochrome canvas + dot-dim texture (v1.2 §10 allowed exception)
 * - Sequence fade-in on illustration → title → subtitle → CTAs
 */
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Illustration } from "@/components/Illustration";
import { startNewPainCard } from "@/lib/painCardActions";

export function HeroSection() {
  const navigate = useNavigate();

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  const openExample = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("example-paincard")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.location.hash = "example-paincard-open";
  };

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-canvas-base"
    >
      <div aria-hidden className="absolute inset-0 bg-dot-dim opacity-50" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border-hairline" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 section-2xl">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Illustration: mobile full-bleed top; lg+ left 7 cols */}
          <div className="col-span-12 lg:col-span-7 lg:order-1 animate-grok-fade-up">
            <Illustration
              name="e11-listening-vessel"
              alt="一隻手心捧著像空容器的耳朵 — 等著被填滿的傾聽"
              aspect="4/3"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="border-0 bg-transparent"
            />
          </div>

          {/* Copy: mobile stacked below; lg+ right 5 cols */}
          <div className="col-span-12 lg:col-span-5 lg:order-2">
            <h1
              id="hero-headline"
              className="font-display font-bold leading-[0.92] tracking-[-0.05em] text-text-primary animate-grok-fade-up text-[clamp(56px,8vw,128px)]"
              style={{ animationDelay: "120ms" }}
            >
              痛點 ID Card
            </h1>

            <p
              className="mt-8 max-w-prose text-lg sm:text-xl leading-[1.55] text-text-secondary animate-grok-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              9 張卡，陪你從「我覺得有問題」走到「我知道問題在哪」。 第一次 90 分鐘，熟了 30 分鐘 —
              你只需要會抄、會問、會打電話。
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 animate-grok-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              <button
                type="button"
                onClick={handleStart}
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-md bg-text-primary px-7 text-[15px] font-medium text-text-inverse transition-colors duration-200 hover:bg-text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-primary focus-visible:outline-offset-2"
              >
                開始第一張卡
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <a
                href="#example-paincard"
                onClick={openExample}
                className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                查看範例 ID card
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
