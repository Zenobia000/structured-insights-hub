/**
 * FooterMinimal — Variant A footer per Grok v1.2 §1.0.
 *
 * Spec rules:
 * - One-line minimal: brand glyph + nav links + copyright + meta
 * - Single mono-style status pills inline (Local-first / No sign-up etc.)
 * - No heavy CTA block (the Hero owns primary action)
 * - Hairline top border, generous bottom padding
 *
 * Replaces the v2.0 CtaFooterSection (large centered CTA).
 */
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { startNewPainCard } from "@/lib/painCardActions";

export function FooterMinimal() {
  const navigate = useNavigate();

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  return (
    <footer className="relative border-t border-border-hairline bg-canvas-sunken">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        {/* Compact final CTA — single line, no headline block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 pb-16 border-b border-border-hairline">
          <p className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-primary max-w-[20em] leading-[1.2]">
            你不需要先懂什麼，就可以開始。
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-text-primary px-6 text-[14px] font-medium text-text-inverse transition-colors duration-200 hover:bg-text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-primary focus-visible:outline-offset-2 shrink-0"
          >
            從第一張卡開始
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* True footer line — brand + meta + tags */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            ◆&nbsp;painmap · 痛點填空簿 · 2026
          </p>

          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary leading-[1.7]">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-1 w-1 rounded-full bg-text-primary" />
              Local-first
            </span>
            <span className="mx-3 text-border-default">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-1 w-1 rounded-full bg-text-primary" />
              No sign-up
            </span>
            <span className="mx-3 text-border-default">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-1 w-1 rounded-full bg-text-primary" />
              Export anytime
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
