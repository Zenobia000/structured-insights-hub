/**
 * AIPromptCopyBlock — AI 半自助互動元件
 *
 * MVP 階段：複製 prompt 到外部 ChatGPT/Claude/Perplexity/Gemini，把回覆貼回來。
 * 出現在卡 3, 4, 5, 6, 7, 8。
 *
 * 不負責：
 * - 呼叫 LLM API（M1 階段不做）
 * - 解析 AI 回覆並自動填入 PainCard（另一個元件 AIResponseParser 的事）
 * - Solution mode 偵測（TODO: 等 prompt 模板與規則確定後實作）
 */

import { useState } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AiTool = "chatgpt" | "claude" | "perplexity" | "gemini";

const AI_TOOLS: Array<{ id: AiTool; label: string; url: string }> = [
  { id: "chatgpt", label: "ChatGPT", url: "https://chat.openai.com/" },
  { id: "claude", label: "Claude", url: "https://claude.ai/" },
  { id: "perplexity", label: "Perplexity", url: "https://www.perplexity.ai/" },
  { id: "gemini", label: "Gemini", url: "https://gemini.google.com/" },
];

type Props = {
  /** 預先設計好、變數已填入的 prompt 文字 */
  prompt: string;
  /** AI 回覆文字 */
  response: string;
  onResponseChange: (value: string) => void;
  /** 標題，預設「🤖 AI 幫你校對」 */
  title?: string;
};

export function AIPromptCopyBlock({
  prompt,
  response,
  onResponseChange,
  title = "🤖 AI 幫你校對",
}: Props) {
  const [tool, setTool] = useState<AiTool>("chatgpt");
  const [copied, setCopied] = useState(false);

  const currentTool = AI_TOOLS.find((t) => t.id === tool)!;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降級：選取文字讓使用者手動 Cmd+C（先不做提示）
    }
  }

  return (
    <section className="rounded-lg border border-border bg-surface shadow-sm">
      <header className="px-4 sm:px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      </header>

      {/* AI 工具選擇 */}
      <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted-bg/40">
        <div className="flex flex-wrap items-center gap-2">
          {AI_TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                tool === t.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-surface text-text-secondary border border-border hover:border-secondary/40",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-text-muted">
          AI 不會幫你設計產品。它只幫你整理、校對、找證據。
        </p>
      </div>

      {/* 雙欄：左 prompt，右 response */}
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* 左：Prompt */}
        <div className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              複製這段 prompt
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1" /> 已複製
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" /> 複製
                  </>
                )}
              </Button>
              <Button
                asChild
                size="sm"
                className="h-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <a href={currentTool.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  打開 {currentTool.label}
                </a>
              </Button>
            </div>
          </div>
          <pre className="font-mono text-xs sm:text-sm bg-muted-bg rounded-md p-3 max-h-80 overflow-auto whitespace-pre-wrap text-text-primary">
            {prompt || "（此頁尚未提供 prompt 模板）"}
          </pre>
        </div>

        {/* 右：Response */}
        <div className="p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            貼回 AI 的回覆
          </h3>
          <Textarea
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="把 AI 的完整回覆貼到這裡..."
            className="min-h-[280px] font-mono text-sm"
          />
          {/* TODO: solution mode 偵測 — 當 AI 回覆出現「我建議你做一個 App / SaaS / 產品」等
              關鍵字時顯示警告（規則表待 prompt 模板定案後新增） */}
        </div>
      </div>
    </section>
  );
}
