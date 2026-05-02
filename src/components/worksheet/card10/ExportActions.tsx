/**
 * ExportActions — Markdown / JSON / PDF 三種匯出 (Grok dark)
 */
import { useState } from "react";
import {
  ClipboardList,
  Download,
  FileJson,
  FileText,
  FileType2,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { Eyebrow } from "@/components/ui/eyebrow";
import { usePainCardStore } from "@/store/painCard";
import {
  buildMarkdown,
  downloadBlob,
  exportFilename,
  exportInterviewGuide,
  exportPdf,
  interviewGuideFilename,
} from "@/lib/cardTenExport";

export function ExportActions() {
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const [pdfLoading, setPdfLoading] = useState(false);

  const recordExport = (fmt: "markdown" | "json" | "pdf") => {
    updateField("exported.exported_at", new Date().toISOString());
    updateField("exported.formats", Array.from(new Set([...card.exported.formats, fmt])));
  };

  const guideReady = (card.interview_plan.interview_guide_md?.trim().length ?? 0) >= 200;

  const handleMarkdown = () => {
    const filename = exportFilename(card, "md");
    downloadBlob(filename, "text/markdown", buildMarkdown(card));
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
      await exportPdf(card);
      recordExport("pdf");
      toast.success(`已下載 ${exportFilename(card, "pdf")}`);
    } catch (err) {
      toast.error("PDF 生成失敗，請改用 Markdown 匯出");
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  const [guideLoading, setGuideLoading] = useState(false);
  const handleInterviewGuide = async () => {
    setGuideLoading(true);
    try {
      await exportInterviewGuide(card);
      toast.success("已開啟列印視窗，請選擇「另存為 PDF」");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "訪綱匯出失敗";
      toast.error(msg);
      console.error(err);
    } finally {
      setGuideLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto space-y-5">
      <div>
        <Eyebrow variant="numbered" index={1}>
          Export · take it with you
        </Eyebrow>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] text-text-primary">
          匯出你的身份證
        </h2>
        <p className="mt-2 text-[14px] text-text-secondary">資料只在你本機。匯出後請自己保存。</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-px bg-border-hairline border border-border-hairline rounded-lg overflow-hidden">
        <ExportTile
          onClick={handleMarkdown}
          ext="md"
          Icon={FileText}
          title="Markdown"
          subtitle="給 Notion / GitHub / 部落格用"
          ariaLabel="匯出為 Markdown 檔案"
        />
        <ExportTile
          onClick={handleJson}
          ext="json"
          Icon={FileJson}
          title="JSON"
          subtitle="跨工具搬移、備份、給開發者用"
          ariaLabel="匯出為 JSON 檔案"
        />
        <ExportTile
          onClick={handlePdf}
          ext="pdf"
          Icon={pdfLoading ? Loader2 : FileType2}
          spin={pdfLoading}
          disabled={pdfLoading}
          title="PDF"
          subtitle="列印、面對面討論"
          ariaLabel="匯出為 PDF 檔案"
        />
      </div>

      <p className="font-mono text-[11px] text-text-tertiary">
        Filename pattern: paincard-{"{slug}"}-{"{YYYY-MM-DD}"}.{"{ext}"}
      </p>

      {/* 訪綱單獨匯出（卡 8 stage 3 完成才出現） */}
      {guideReady && (
        <aside className="rounded-lg border border-status-success/30 bg-status-success-bg/30 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-status-success-bg text-status-success">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold tracking-[-0.01em] text-text-primary">
                  訪談大綱（單獨匯出）
                </h3>
                <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                  你在卡 8 整理好的訪綱可以單獨下載一份，列印帶去面對面訪談用，不夾雜其他卡片內容。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInterviewGuide}
              disabled={guideLoading}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-status-success px-4 text-[13px] font-medium text-text-inverse transition-colors hover:bg-status-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-success/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {guideLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              下載訪綱 PDF
            </button>
          </div>
        </aside>
      )}

      {/* 隱私聲明 — 強制顯示，不可關閉 */}
      <aside className="rounded-lg border border-border-hairline bg-canvas-raised p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-status-success-bg text-status-success">
            <Lock className="h-3 w-3" />
          </span>
          <h3 className="font-display text-base font-semibold tracking-[-0.01em] text-text-primary">
            你的資料主權
          </h3>
        </div>
        <ul className="space-y-2 text-[13px] text-text-secondary">
          {[
            "你寫的痛點內容只在你的瀏覽器 LocalStorage",
            "我們沒有資料庫收集你的痛點原文",
            "不需要登入、不需要帳號、不需要 Email",
            "少數 AI 語意判定會匿名經 OpenAI（不含個資、不存後端）",
            "匯出後你完全自管",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-status-success shrink-0 mt-0.5">●</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function ExportTile({
  onClick,
  Icon,
  spin,
  disabled,
  ext,
  title,
  subtitle,
  ariaLabel,
}: {
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  spin?: boolean;
  disabled?: boolean;
  ext: string;
  title: string;
  subtitle: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="group relative flex flex-col items-start gap-3 bg-canvas-raised p-6 text-left transition-colors hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:bg-surface-hover focus-visible:z-10"
    >
      <div className="flex w-full items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-electric-subtle text-accent-electric ring-1 ring-accent-electric/20 transition-all group-hover:ring-accent-electric/40">
          <Icon className={spin ? "h-5 w-5 animate-spin" : "h-5 w-5"} strokeWidth={1.5} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          .{ext}
        </span>
      </div>
      <div>
        <p className="font-display text-base font-semibold tracking-[-0.01em] text-text-primary">
          {title}
        </p>
        <p className="mt-1 text-[12.5px] text-text-tertiary leading-[1.55]">{subtitle}</p>
      </div>
      <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-electric opacity-0 group-hover:opacity-100 transition-opacity">
        <Download className="h-3 w-3" /> Download
      </span>
    </button>
  );
}
