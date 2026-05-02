/**
 * CtaFooterSection — 最終轉化推力 (Grok CTA Block centered)。
 */
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { Eyebrow } from "@/components/ui/eyebrow";
import { startNewPainCard } from "@/lib/painCardActions";

export function CtaFooterSection() {
  const navigate = useNavigate();

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  return (
    <SectionFade
      ariaLabelledBy="cta-footer-title"
      className="relative isolate overflow-hidden border-t border-border-hairline bg-canvas-sunken"
    >
      {/* Layered glow */}
      <div aria-hidden className="absolute inset-0 bg-spotlight-dual opacity-80" />
      <div aria-hidden className="absolute inset-0 bg-dot-default opacity-30" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 py-24 md:py-40 text-center">
        <Eyebrow variant="dotted" className="justify-center mx-auto">
          Start now · 30 sec to begin
        </Eyebrow>

        <h2
          id="cta-footer-title"
          className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-[-0.04em] text-text-primary"
        >
          你不需要先懂什麼，
          <br />
          <span className="bg-gradient-to-r from-text-primary via-accent-electric to-text-primary bg-clip-text text-transparent">
            就可以開始。
          </span>
        </h2>

        <p className="mt-7 text-base sm:text-lg leading-[1.65] text-text-secondary max-w-xl mx-auto">
          選一件最近卡住你的事 — 你自己的、或聽別人說的都行 — 30
          分鐘後，你會帶走一張屬於自己、寫得清清楚楚的痛點身份證。
        </p>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleStart}
            className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-md bg-accent-electric px-8 text-base font-medium text-text-primary transition-all duration-200 hover:bg-accent-electric-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base glow-accent-md"
          >
            從第一張卡開始
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary leading-[1.7]">
          ● Local-only &nbsp;·&nbsp; ● No sign-up &nbsp;·&nbsp; ● Export anytime (MD / JSON / PDF)
        </p>
      </div>
    </SectionFade>
  );
}
