/**
 * LandingPage — Worksheet landing 主檔（7 sections 整合，Grok dark theme）。
 * 放在 / 與 /learn/worksheet 兩個入口共用。
 */
import { CtaFooterSection } from "@/components/landing/CtaFooterSection";
import { ExamplePainCardPreviewSection } from "@/components/landing/ExamplePainCardPreviewSection";
import { ExpectationCalibrationSection } from "@/components/landing/ExpectationCalibrationSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { StageRelationshipSection } from "@/components/landing/StageRelationshipSection";
import { StartOrResumeSection } from "@/components/landing/StartOrResumeSection";
import { ThreeStepTeachingSection } from "@/components/landing/ThreeStepTeachingSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-canvas-base text-text-primary overflow-hidden">
      {/* Ambient page glow — anchored to top-left & bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60 bg-spotlight-dual"
      />

      {/* Floating theme toggle (top-right) */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <ThreeStepTeachingSection />
        <ExpectationCalibrationSection />
        <ExamplePainCardPreviewSection />
        <StartOrResumeSection />
        <StageRelationshipSection />
        <CtaFooterSection />
      </div>
    </main>
  );
}
