/**
 * LandingPage — Variant A manifesto-style (Grok v1.2 §1.0).
 *
 * 5-section structure:
 * 1. Floating ThemeToggle (acts as minimal top nav)
 * 2. HeroSection — manifesto headline + single CTA
 * 3. MissionSection — single big paragraph + stage footnote
 * 4. ExamplePainCardPreviewSection — showcase (acts as News Highlights placeholder)
 * 5. FooterMinimal — compact CTA + brand + meta line
 *
 * Cut from v2.0:
 * - StartOrResumeSection (StateOrResumeSection)
 * - ThreeStepTeachingSection
 * - ExpectationCalibrationSection
 *
 * Replaced from v2.0:
 * - StageRelationshipSection → MissionSection (collapsed two-card compare to single statement)
 * - CtaFooterSection → FooterMinimal (compact one-line footer)
 */
import { ExamplePainCardPreviewSection } from "@/components/landing/ExamplePainCardPreviewSection";
import { FooterMinimal } from "@/components/landing/FooterMinimal";
import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-canvas-base text-text-primary overflow-hidden">
      {/* Floating theme toggle (top-right, acts as minimal top nav) */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <MissionSection />
        <ExamplePainCardPreviewSection />
        <FooterMinimal />
      </div>
    </main>
  );
}
