import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECOND_ROUND_PROMPT } from "@/lib/cardSevenValidators";

export function SecondRoundPromptBlock() {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SECOND_ROUND_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border bg-muted-bg/40">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">
            第二輪追問 prompt（複製貼上回 AI）
          </h3>
          <p className="text-[12.5px] text-text-secondary mt-0.5">
            AI 把上面的研究整理成一張「痛點判斷表」。
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={handleCopy} className="h-8">
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" /> 已複製
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" /> 複製第二輪 prompt
            </>
          )}
        </Button>
      </div>
      <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[1.6] bg-muted-bg p-4 max-h-80 overflow-auto whitespace-pre-wrap text-text-primary">
        {SECOND_ROUND_PROMPT}
      </pre>
    </div>
  );
}
