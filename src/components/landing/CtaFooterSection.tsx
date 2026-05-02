/**
 * CtaFooterSection — 最終轉化推力。
 * 例外：深色背景 #1E3A5F（spec 例外規則 #2）。
 */
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionFade } from "./SectionFade";
import { startNewPainCard } from "@/lib/painCardActions";

export function CtaFooterSection() {
  const navigate = useNavigate();

  const handleStart = () => {
    const { path } = startNewPainCard();
    navigate({ to: path });
  };

  return (
    <SectionFade ariaLabelledBy="cta-footer-title" className="bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2
          id="cta-footer-title"
          className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-primary-foreground"
        >
          你不需要先懂什麼，就可以開始
        </h2>
        <p className="mt-4 text-[17px] leading-[1.7] text-primary-foreground/85 max-w-2xl mx-auto">
          選一件最近卡住你的事 — 你自己的、或聽別人說的都行 — 30
          分鐘後，你會帶走一張屬於自己、寫得清清楚楚的痛點身份證。
        </p>

        <button
          type="button"
          onClick={handleStart}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground px-7 py-4 font-semibold text-base shadow-md hover:bg-accent/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition-all"
        >
          從第一張卡開始
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-6 text-xs leading-[1.6] text-primary-foreground/70 max-w-xl mx-auto">
          你寫的字只存在你自己的瀏覽器，不上傳、不註冊。隨時可以匯出 Markdown / JSON / PDF 帶走。
        </p>
      </div>
    </SectionFade>
  );
}
