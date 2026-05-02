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

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-canvas-base text-text-primary overflow-hidden">
      {/* Ambient page glow — anchored to top-left & bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 800px 600px at 0% 0%, rgba(91,141,239,0.10), transparent 60%), radial-gradient(ellipse 600px 800px at 100% 100%, rgba(139,92,246,0.06), transparent 60%)",
        }}
      />
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
