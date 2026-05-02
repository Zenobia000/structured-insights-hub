import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  persona: string;
  stuckFormula: string;
  questions: string[];
  response: string | null;
  onResponseChange: (v: string) => void;
};

export function AiSimulationBlock({
  persona,
  stuckFormula,
  questions,
  response,
  onResponseChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = `我準備訪談一個 ${persona || "（請先填上方第 1 位 persona）"}。
我的痛點假設是：${stuckFormula || "（請先到卡 3 填卡關公式）"}

請扮演這個受訪者，根據常見現況回答我這 3 題：
1. ${questions[0] || "（請先填第 1 題）"}
2. ${questions[1] || "（請先填第 2 題）"}
3. ${questions[2] || "（請先填第 3 題）"}

回答時請：
- 不要美化、不要奉承
- 用真實生活的口吻
- 如果現況其實沒那麼痛，請直接說
- 不要假裝自己會付錢買 App`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <section className="rounded-lg border border-dashed border-border bg-muted-bg/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-text-primary inline-flex items-center gap-1.5">
          {open ? (
            <ChevronDown className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4" aria-hidden />
          )}
          （可選）熱身：請 AI 模擬受訪者
        </span>
        <span className="text-[12px] text-text-secondary">
          {open ? "收起" : "展開"}
        </span>
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-4">
          <p className="text-[13px] text-text-secondary leading-[1.55]">
            ⚠️ 只能當熱身練習，不能取代真人訪談。
          </p>

          <div className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border bg-muted-bg/40">
              <span className="text-[13px] font-semibold text-text-primary">
                AI 模擬 prompt
              </span>
              <Button size="sm" variant="outline" onClick={handleCopy} className="h-8">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1" /> 已複製
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" /> 複製 prompt
                  </>
                )}
              </Button>
            </div>
            <pre className="font-mono text-[12.5px] sm:text-[13px] leading-[1.6] bg-muted-bg p-4 max-h-80 overflow-auto whitespace-pre-wrap text-text-primary">
              {prompt}
            </pre>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="ai-sim-response"
              className="text-[13.5px] font-semibold text-text-primary block"
            >
              AI 模擬回覆（貼回來保存，未來對照真人訪談）
            </label>
            <Textarea
              id="ai-sim-response"
              value={response ?? ""}
              onChange={(e) => onResponseChange(e.target.value)}
              placeholder="把 AI 扮演受訪者的回答貼進來..."
              className="min-h-[140px] font-mono text-[13px]"
            />
          </div>

          <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/40 bg-caution/5 p-3 text-[13px] leading-[1.6] text-text-primary">
            <AlertTriangle
              className="h-4 w-4 text-caution shrink-0 mt-0.5"
              aria-hidden
            />
            <p>
              AI 模擬只是熱身。真實的沉默、猶豫、身體語言，AI 給不了你。
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
