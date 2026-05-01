/**
 * LandingPage — Worksheet landing 主檔（7 sections 整合）。
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
    <main className="min-h-screen bg-page text-text-primary">
      <HeroSection />
      <ThreeStepTeachingSection />
      <ExpectationCalibrationSection />
      <ExamplePainCardPreviewSection />
      <StartOrResumeSection />
      <StageRelationshipSection />
      <CtaFooterSection />
    </main>
  );
}
