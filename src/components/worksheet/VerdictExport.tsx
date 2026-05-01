/**
 * VerdictExport — 卡 10 痛點身份證匯出元件
 *
 * 整合 PainCard 9 個欄位產出 Markdown / JSON / PDF 三種格式。
 *
 * 此元件骨架階段：
 * - Markdown 與 JSON 真的接通（純前端 blob download）
 * - PDF 留 TODO（需要 pdf 套件，骨架階段不裝）
 * - 「下一步去哪」CTA 區只放視覺，不接行動
 */

import { Download, FileJson, FileText, FileType2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePainCardStore } from "@/store/painCard";
import type { PainCard } from "@/types/painCard";
import { cn } from "@/lib/utils";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "untitled"
  );
}

function generateFilename(card: PainCard, ext: "md" | "json" | "pdf"): string {
  const slug = slugify(card.complaint.verbatim.slice(0, 20));
  const date = new Date().toISOString().slice(0, 10);
  return `paincard-${slug}-${date}.${ext}`;
}

function buildMarkdown(card: PainCard): string {
  const firstPerson = card.people.list[0];
  const stuck =
    card.stuck_formula.ai_polished || card.stuck_formula.user_draft || "（未填）";

  return `# 痛點身份證

> 由 PainMap Worksheet v1.0 產出於 ${card.created_at}
> 最後檢核日期：${card.updated_at}

---

## 主人翁

${
  firstPerson
    ? `**${firstPerson.name}**（${firstPerson.relation}）

聯絡方式：${firstPerson.contact}`
    : "（未填寫）"
}

## 場景

> ${card.complaint.verbatim || "（未填）"}

— ${card.complaint.source_name || "（未填）"}（${card.complaint.source_relation || "（未填）"}），${card.complaint.datetime || "（未填）"}，${card.complaint.scene || "（未填）"}

## 卡關公式

「${stuck}」

## 他現在怎麼解

工具：${card.workaround.tool_name || "（未填）"}
為什麼還是卡：${card.workaround.why_still_stuck || "（未填）"}

## 真假判斷

判斷：${card.verdict.judgment ?? "（未判斷）"}
下一步：${card.verdict.next_action ?? "（未決定）"}

${card.verdict.reason_100w || ""}
`;
}

function downloadBlob(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const NEXT_STEPS = [
  {
    icon: "🎤",
    title: "去訪談 5 個人",
    desc: "拿著身份證去找你寫下的訪談對象",
  },
  {
    icon: "🚀",
    title: "進階版 PainMap",
    desc: "把痛點丟進 Pain Collector 做更深的結構化",
  },
  {
    icon: "🔄",
    title: "換個題目",
    desc: "判斷是假痛點？換另一個抱怨重新開始",
  },
  {
    icon: "💭",
    title: "我再想想",
    desc: "存檔離開，過幾天再回來看",
  },
];

export function VerdictExport() {
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);

  const handleExportMarkdown = () => {
    const md = buildMarkdown(card);
    downloadBlob(generateFilename(card, "md"), "text/markdown", md);
    updateField("exported.exported_at", new Date().toISOString());
    updateField("exported.formats", Array.from(new Set([...card.exported.formats, "markdown"])));
  };

  const handleExportJson = () => {
    const json = JSON.stringify(card, null, 2);
    downloadBlob(generateFilename(card, "json"), "application/json", json);
    updateField("exported.exported_at", new Date().toISOString());
    updateField("exported.formats", Array.from(new Set([...card.exported.formats, "json"])));
  };

  const previewMd = buildMarkdown(card);

  return (
    <div className="space-y-6">
      {/* 預覽區 */}
      <section className="rounded-lg border border-border bg-surface shadow-sm">
        <header className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            🪪 你的痛點身份證
          </h2>
          <span className="text-xs text-text-muted">預覽（Markdown）</span>
        </header>
        <pre className="font-mono text-xs sm:text-sm p-4 sm:p-6 max-h-[400px] overflow-auto whitespace-pre-wrap text-text-primary">
          {previewMd}
        </pre>
      </section>

      {/* 匯出按鈕 */}
      <section className="grid sm:grid-cols-3 gap-3">
        <Button
          onClick={handleExportMarkdown}
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
        >
          <FileText className="h-5 w-5 text-secondary" />
          <span className="font-semibold">Markdown</span>
          <span className="text-xs text-text-muted">分享、貼到 Notion</span>
        </Button>
        <Button
          onClick={handleExportJson}
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
        >
          <FileJson className="h-5 w-5 text-secondary" />
          <span className="font-semibold">JSON</span>
          <span className="text-xs text-text-muted">備份、跨工具搬移</span>
        </Button>
        <Button
          disabled
          variant="outline"
          className="h-auto flex-col gap-2 py-4 opacity-50 cursor-not-allowed"
          title="PDF 匯出尚未實作"
        >
          <FileType2 className="h-5 w-5 text-text-muted" />
          <span className="font-semibold">PDF</span>
          <span className="text-xs text-text-muted">即將推出</span>
        </Button>
      </section>

      {/* 下一步去哪 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-text-primary">下一步去哪</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {NEXT_STEPS.map((step) => (
            <button
              key={step.title}
              type="button"
              className={cn(
                "text-left rounded-lg border border-border bg-surface p-4 transition-colors",
                "hover:border-secondary/50 hover:shadow-sm cursor-pointer",
              )}
            >
              <div className="text-2xl mb-2" aria-hidden>
                {step.icon}
              </div>
              <div className="font-semibold text-text-primary">{step.title}</div>
              <div className="text-sm text-text-secondary mt-0.5">{step.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 隱私聲明 */}
      <p className="text-xs text-text-muted text-center pt-4 border-t border-border">
        <Download className="h-3 w-3 inline mr-1" />
        所有資料只存在你的瀏覽器（LocalStorage）。沒有雲端同步、沒有帳號、沒有追蹤。
      </p>
    </div>
  );
}
