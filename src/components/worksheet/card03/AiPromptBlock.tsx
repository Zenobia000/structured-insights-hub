/**
 * Step 2：複製 prompt 到外部 AI（含工具偏好記錄）。
 *
 * - prompt 文字逐字引用 worksheet 卡 3，禁止改寫
 * - 變數插值僅 complaint.verbatim + people.background
 * - tool_picker 寫入 LocalStorage user_pref.ai_tool（不影響 prompt 內容）
 */
import { useEffect, useState } from "react";
import { Copy, ExternalLink, Check, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AI_TOOL_OPTIONS,
  AI_TOOL_PREF_KEY,
  type AiToolPref,
} from "@/lib/cardThreeValidators";

type Props = {
  prompt: string;
  prereqReady: boolean;
};

export function AiPromptBlock({ prompt, prereqReady }: Props) {
  const [tool, setTool] = useState<AiToolPref>("chatgpt");
  const [copied, setCopied] = useState(false);

  // 讀 / 寫 user_pref.ai_tool（純偏好記錄）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(AI_TOOL_PREF_KEY);
    if (saved && AI_TOOL_OPTIONS.some((o) => o.id === saved)) {
      setTool(saved as AiToolPref);
    }
  }, []);

  const pickTool = (id: AiToolPref) => {
    setTool(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AI_TOOL_PREF_KEY, id);
    }
  };

  const current = AI_TOOL_OPTIONS.find((o) => o.id === tool)!;

  async function handleCopy() {
    if (!prereqReady) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降級：使用者可手動選取 pre 內文字 Cmd+C
    }
  }

  return (
    <section
      aria-labelledby="step-2-label"
      className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-4"
    >
      <header>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-secondary">
          Step 2
        </p>
        <h2 id="step-2-label" className="mt-1 text-[20px] font-bold text-text-primary leading-[1.35]">
          複製這段 prompt 到 ChatGPT / Claude / Gemini
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary leading-[1.6]">
          AI 在這張卡的角色：<span className="font-semibold text-text-primary">把你寫的抱怨整理成卡關公式句型</span>，並列出「需要再問清楚」的 3 個問題（不會替你回答）。
        </p>
      </header>

      {/* tool picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] text-text-secondary mr-1">你常用的 AI：</span>
        {AI_TOOL_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => pickTool(o.id)}
            aria-pressed={tool === o.id}
            className={cn(
              "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tool === o.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-surface text-text-secondary border border-border hover:border-secondary/40",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* prereq missing */}
      {!prereqReady && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-caution/50 bg-caution/5 px-3 py-2.5 text-[13px] leading-[1.55] text-text-primary"
        >
          <ShieldAlert className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
          <span>
            請先完成卡 1（抱怨原句）與卡 2（背景）— prompt 才能正確帶入主人翁資訊。
          </span>
        </div>
      )}

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={handleCopy}
          disabled={!prereqReady}
          className={cn(
            "h-9 bg-accent text-accent-foreground hover:bg-accent/90",
            !prereqReady && "opacity-60",
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1.5" /> 已複製 ✓
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1.5" /> 複製 prompt
            </>
          )}
        </Button>
        <Button
          asChild
          size="default"
          variant="outline"
          className="h-9"
        >
          <a href={current.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1.5" />
            在新分頁開啟 {current.label}
          </a>
        </Button>
      </div>

      {/* prompt body */}
      <pre
        aria-label="校對 prompt 全文"
        className="font-mono text-[12.5px] sm:text-[13px] bg-muted-bg/70 border border-border rounded-md p-4 max-h-96 overflow-auto whitespace-pre-wrap text-text-primary leading-[1.65]"
      >
        {prompt}
      </pre>

      <p className="text-[11.5px] text-text-muted">
        Prompt 來源：worksheet 卡片 3 「🤖 AI 幫你校對」段落（逐字引用，禁止改寫）。
      </p>
    </section>
  );
}
