/**
 * ExportActions — Markdown / JSON / PDF 三種匯出
 */
import { useState } from "react";
import { FileJson, FileText, FileType2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePainCardStore } from "@/store/painCard";
import { useDisplayModeStore } from "@/store/displayMode";
import {
  buildMarkdown,
  downloadBlob,
  exportFilename,
  exportPdf,
} from "@/lib/cardTenExport";

export function ExportActions() {
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const mode = useDisplayModeStore((s) => s.mode);
  const [pdfLoading, setPdfLoading] = useState(false);

  const recordExport = (fmt: "markdown" | "json" | "pdf") => {
    updateField("exported.exported_at", new Date().toISOString());
    updateField(
      "exported.formats",
      Array.from(new Set([...card.exported.formats, fmt])),
    );
  };

  const handleMarkdown = () => {
    const filename = exportFilename(card, "md");
    downloadBlob(filename, "text/markdown", buildMarkdown(card, mode));
    recordExport("markdown");
    toast.success(`已下載 ${filename}`);
  };

  const handleJson = () => {
    const filename = exportFilename(card, "json");
    downloadBlob(filename, "application/json", JSON.stringify(card, null, 2));
    recordExport("json");
    toast.success(`已下載 ${filename}`);
  };

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      await exportPdf(card, mode);
      recordExport("pdf");
      toast.success(`已下載 ${exportFilename(card, "pdf")}`);
    } catch (err) {
      toast.error("PDF 生成失敗，請改用 Markdown 匯出");
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary">匯出你的身份證</h2>
        <p className="text-sm text-text-secondary mt-1">
          資料只在你本機。匯出後請自己保存。
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Button
          onClick={handleMarkdown}
          variant="outline"
          aria-label="匯出為 Markdown 檔案"
          className="h-auto flex-col gap-1.5 py-5 hover:border-secondary"
        >
          <FileText className="h-6 w-6 text-secondary" aria-hidden />
          <span className="font-semibold text-base">📄 Markdown</span>
          <span className="text-xs text-text-muted text-center">
            給 Notion / GitHub / 部落格用
          </span>
        </Button>
        <Button
          onClick={handleJson}
          variant="outline"
          aria-label="匯出為 JSON 檔案"
          className="h-auto flex-col gap-1.5 py-5 hover:border-secondary"
        >
          <FileJson className="h-6 w-6 text-secondary" aria-hidden />
          <span className="font-semibold text-base">🔧 JSON</span>
          <span className="text-xs text-text-muted text-center">
            跨工具搬移、備份、給開發者用
          </span>
        </Button>
        <Button
          onClick={handlePdf}
          disabled={pdfLoading}
          variant="outline"
          aria-label="匯出為 PDF 檔案"
          className="h-auto flex-col gap-1.5 py-5 hover:border-secondary"
        >
          {pdfLoading ? (
            <Loader2 className="h-6 w-6 text-secondary animate-spin" aria-hidden />
          ) : (
            <FileType2 className="h-6 w-6 text-secondary" aria-hidden />
          )}
          <span className="font-semibold text-base">📑 PDF</span>
          <span className="text-xs text-text-muted text-center">列印、面對面討論</span>
        </Button>
      </div>

      <p className="text-xs text-text-muted">
        檔名：paincard-{"{slug}"}-{"{YYYY-MM-DD}"}.{"{ext}"}
      </p>

      {/* 隱私聲明 — 強制顯示，不可關閉 */}
      <aside className="rounded-lg border border-border bg-muted-bg/40 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-text-primary text-sm">
          <Lock className="h-4 w-4 text-secondary" aria-hidden />
          你的資料主權
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary list-disc list-inside">
          <li>所有資料只在你的瀏覽器 LocalStorage</li>
          <li>我們沒有伺服器收集你的痛點</li>
          <li>不需要登入、不需要帳號、不需要 Email</li>
          <li>匯出後你完全自管</li>
        </ul>
      </aside>
    </section>
  );
}
