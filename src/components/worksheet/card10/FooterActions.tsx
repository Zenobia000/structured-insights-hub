/**
 * FooterActions — 重新填一張 / 查看舊身份證 / 分享 / 刪除 (Grok dark)
 *
 * 「刪除本機資料」是本頁唯一允許用 destructive 紅色的按鈕（已明確標記為例外）。
 */
import { useState } from "react";
import { Plus, Library, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePainCardStore } from "@/store/painCard";
import {
  buildMarkdown,
  buildShareableJson,
  downloadBlob,
  exportFilename,
} from "@/lib/cardTenExport";

export function FooterActions() {
  const card = usePainCardStore((s) => s.card);
  const reset = usePainCardStore((s) => s.reset);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleNew = () => {
    if (confirm("建立新的身份證？目前這張會被覆蓋（建議先匯出 .md 備份）。")) {
      reset();
      window.location.href = "/learn/worksheet/01";
    }
  };

  const handleExportBeforeDelete = () => {
    downloadBlob(exportFilename(card, "md"), "text/markdown", buildMarkdown(card));
    toast.success("已下載備份，現在可安全刪除");
  };

  const handleConfirmDelete = () => {
    reset();
    setDeleteOpen(false);
    toast.success("本機資料已清除");
    window.location.href = "/learn/worksheet";
  };

  const handleShareCopyLink = () => {
    const json = buildShareableJson(card);
    navigator.clipboard
      .writeText(json)
      .then(() => toast.success("已複製分享內容到剪貼簿"))
      .catch(() => toast.error("複製失敗，請手動匯出"));
  };

  const handleShareDownloadMd = () => {
    downloadBlob(exportFilename(card, "md"), "text/markdown", buildMarkdown(card));
  };

  return (
    <section className="max-w-4xl mx-auto rounded-lg border border-border-hairline bg-canvas-raised p-6 sm:p-7">
      <Eyebrow variant="numbered" index={3}>
        Manage · session actions
      </Eyebrow>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-hairline border border-border-hairline rounded-md overflow-hidden">
        <ActionButton
          icon={<Plus className="h-4 w-4" />}
          label="重新填一張"
          hint="這張會保留*"
          onClick={handleNew}
        />
        <ActionButton
          icon={<Library className="h-4 w-4" />}
          label="查看舊身份證"
          hint="LocalStorage 歷史"
          onClick={() => toast.info("歷史檢視預計 M2 推出")}
        />
        <ActionButton
          icon={<Share2 className="h-4 w-4" />}
          label="分享身份證"
          hint="複製 / 下載"
          onClick={() => setShareOpen(true)}
        />
        <ActionButton
          icon={<Trash2 className="h-4 w-4" />}
          label="刪除本機資料"
          hint="資料主權"
          onClick={() => setDeleteOpen(true)}
          destructive
        />
      </div>
      <p className="mt-4 font-mono text-[11px] text-text-tertiary leading-[1.55]">
        * 目前 MVP 一張 LocalStorage 只存一張身份證；建立新的請先匯出備份。
      </p>

      {/* 分享 Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md bg-canvas-overlay border-border-default">
          <DialogHeader>
            <DialogTitle className="font-display tracking-[-0.01em]">分享你的痛點身份證</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p className="text-text-secondary">
              選擇分享方式（資料一樣只在你本機，分享 = 你主動傳給對方）：
            </p>

            <div className="space-y-2">
              <Button onClick={handleShareCopyLink} className="w-full" variant="outline">
                複製可分享內容（JSON 文字）
              </Button>
              <Button onClick={handleShareDownloadMd} className="w-full" variant="outline">
                下載 .md 後手動分享
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 刪除確認 */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-canvas-overlay border-border-default">
          <AlertDialogHeader>
            <AlertDialogTitle>真的刪除這份痛點身份證？</AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              資料只在你的本機。刪除後無法復原。建議先匯出再刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleExportBeforeDelete}>
              先匯出 .md 再刪
            </Button>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-status-danger hover:bg-status-danger/90 text-canvas-base"
            >
              我已備份，刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function ActionButton({
  icon,
  label,
  hint,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "group relative bg-canvas-raised p-4 text-left transition-colors flex flex-col gap-1.5 focus-visible:outline-none focus-visible:bg-surface-hover focus-visible:z-10 " +
        (destructive
          ? "text-status-danger hover:bg-status-danger-bg/30"
          : "text-text-primary hover:bg-surface-hover")
      }
    >
      <span className="flex items-center gap-2 text-[14px] font-medium">
        {icon}
        {label}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
        {hint}
      </span>
    </button>
  );
}
