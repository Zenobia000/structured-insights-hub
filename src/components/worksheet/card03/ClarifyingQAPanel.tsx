/**
 * Step 4：逐題回答 AI 列的「需要再問清楚」的問題。
 *
 * 設計（2026-05 重構）：
 * - 若 AI 沒列任何問題 → 綠色通過狀態，免填，自動放行
 * - 若有問題 → 每題一個 textarea，至少 10 字才算「已回答」
 * - 每題提供 checkbox：「答不出來，已預約找主人翁問」(reserved)
 *   勾選後 textarea disabled、不必填，視為已處理
 * - 底部進度提示：已處理 X / N 題
 * - 仍提供退路：退回卡 1 重聊（卡 3 已填內容會保留）
 */
import { Link } from "@tanstack/react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { ANSWER_MIN, type ClarifyingItemStatus } from "@/lib/cardThreeValidators";

type Props = {
  questions: string[];
  items: ClarifyingItemStatus[];
  resolvedCount: number;
  totalCount: number;
  onAnswerChange: (question: string, answer: string) => void;
  onReservedChange: (question: string, reserved: boolean) => void;
  highlight?: boolean;
};

export function ClarifyingQAPanel({
  questions,
  items,
  resolvedCount,
  totalCount,
  onAnswerChange,
  onReservedChange,
  highlight,
}: Props) {
  const empty = questions.length === 0;

  return (
    <section
      aria-labelledby="step-4-label"
      className={cn(
        "rounded-lg border bg-surface p-5 sm:p-6 space-y-4 transition-colors",
        highlight ? "border-secondary ring-2 ring-secondary/30" : "border-border",
      )}
    >
      <header>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-secondary">
          Step 4
        </p>
        <h2 id="step-4-label" className="mt-1 text-[20px] font-bold text-text-primary leading-[1.35]">
          回答 AI 列的「需要再問清楚」
        </h2>
        <p className="mt-1.5 text-[13.5px] text-text-secondary leading-[1.6]">
          這些問題就是 AI 看出你描述還含糊的地方。把答案寫下來——這就是把抱怨變成可驗證痛點的關鍵。如果某題你答不出來，勾選「已預約找主人翁問」也可以過關。
        </p>
      </header>

      {empty ? (
        <div className="flex items-start gap-2.5 rounded-md border border-verified/40 bg-verified/5 px-3.5 py-3">
          <CheckCircle2 className="h-5 w-5 text-verified shrink-0 mt-0.5" aria-hidden />
          <div className="text-[14px] leading-[1.55] text-text-primary">
            <p className="font-semibold">AI 沒列出需要再問清楚的問題</p>
            <p className="text-[13px] text-text-secondary mt-0.5">
              代表你 Step 1 寫得夠具體，可以直接進入卡 4。如果 AI 其實有列問題、但你沒貼到 Step 3，請補上。
            </p>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item, idx) => {
              const a = item.question;
              const answer =
                items[idx].answered || items[idx].reserved
                  ? // 取目前 textarea 文字（透過下方 onChange 回傳；此處只決定狀態樣式）
                    undefined
                  : undefined;
              void answer;
              return (
                <ClarifyingItem
                  key={`${a}-${idx}`}
                  index={idx + 1}
                  status={item}
                  onAnswerChange={(v) => onAnswerChange(item.question, v)}
                  onReservedChange={(v) => onReservedChange(item.question, v)}
                />
              );
            })}
          </ul>

          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 rounded-md bg-page/60 border border-border px-3.5 py-2.5 text-[13px]"
          >
            <span className="text-text-secondary">
              已處理 <span className="font-semibold text-text-primary">{resolvedCount}</span> / {totalCount} 題
              <span className="text-text-muted">（每題答 ≥ {ANSWER_MIN} 字、或勾選預約問）</span>
            </span>
            {resolvedCount === totalCount && (
              <span className="inline-flex items-center gap-1 text-verified font-semibold">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                全部完成
              </span>
            )}
          </div>
        </>
      )}

      <p className="text-[12.5px] text-text-secondary">
        全部都答不出來？{" "}
        <Link
          to="/learn/worksheet/01"
          className="text-secondary underline-offset-2 hover:underline font-medium"
        >
          退回卡 1 再聊一次 →
        </Link>{" "}
        （卡 3 已填內容會保留）
      </p>
    </section>
  );
}

function ClarifyingItem({
  index,
  status,
  onAnswerChange,
  onReservedChange,
}: {
  index: number;
  status: ClarifyingItemStatus & { _answer?: string };
  onAnswerChange: (v: string) => void;
  onReservedChange: (v: boolean) => void;
}) {
  // 我們不在這層保管 textarea value（由父層 store 為 SSOT），
  // 但 ClarifyingItemStatus 沒帶 answer 文字。為避免雙寫，這裡接受 uncontrolled 行為：
  // 父層每次 evaluate 都重新傳入 status；textarea 用 defaultValue 風險高，因此
  // 我們改成 controlled — 從 store 讀取 answer 透過外部傳入。
  // 為保持簡潔，這裡讓父層直接傳 textarea value via DOM data attr 略嫌繁瑣；
  // 改成：父層在傳入 items 時順便附上 answer 文字（透過 status 物件的擴充欄位）。
  return (
    <li className="rounded-md border border-border bg-page/40 p-3.5 space-y-2.5">
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className={cn(
            "shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full text-[12px] font-bold mt-0.5",
            status.resolved
              ? "bg-verified text-verified-foreground"
              : "bg-muted text-text-secondary border border-border",
          )}
        >
          {status.resolved ? "✓" : index}
        </span>
        <p className="text-[14.5px] leading-[1.55] text-text-primary font-medium">
          {status.question}
        </p>
      </div>

      <Textarea
        value={status._answer ?? ""}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={status.reserved}
        rows={2}
        placeholder={
          status.reserved
            ? "已標記為「預約找主人翁問」"
            : `你的回答（至少 ${ANSWER_MIN} 字）…`
        }
        className={cn(
          status.reserved && "opacity-60 cursor-not-allowed",
        )}
      />

      <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer">
        <Checkbox
          checked={status.reserved}
          onCheckedChange={(v) => onReservedChange(v === true)}
        />
        <span>答不出來，已預約找主人翁問</span>
      </label>
    </li>
  );
}
