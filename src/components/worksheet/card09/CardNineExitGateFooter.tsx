import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ReflectionHint,
  type ReflectionHintState,
} from "@/components/worksheet/ReflectionHint";
import { usePersistedToggle } from "@/hooks/usePersistedToggle";
import type { Judgment } from "@/types/painCard";

type Props = {
  judgmentChosen: boolean;
  reasonPassed: boolean;
  nextActionChosen: boolean;
  reasonLen: number;
  reasonMin: number;
  judgment: Judgment | null;
  blockedMessage: string | null;
  submitting: boolean;
  onAdvance: () => void;
  onBack: () => void;
};

const STATUS_LABEL: Record<string, string> = {
  true_pain: "structured（已結構化）",
  pending_interview: "pending_interview（待訪談）",
  fake_pain: "archived_fake（封存為假痛點）",
};

export function CardNineExitGateFooter({
  judgmentChosen,
  reasonPassed,
  nextActionChosen,
  reasonLen,
  reasonMin,
  judgment,
  blockedMessage,
  submitting,
  onAdvance,
  onBack,
}: Props) {
  // 蘇格拉底問句版本(與 Card 1-8 共用 ReflectionHint 格式)
  const reflections: Array<{
    question: string;
    state: ReflectionHintState;
    hint?: string;
    done: boolean;
  }> = [
    {
      question: "你選了哪一種判斷?真痛、假痛、還是要先去訪談?",
      state: judgmentChosen ? "ok" : "pending",
      done: judgmentChosen,
    },
    {
      question: "你的書面理由,能不能讓另一個人讀完就懂你為什麼這樣判?",
      state: reasonPassed ? "ok" : reasonLen > 0 ? "thinking" : "pending",
      hint: !reasonPassed ? `至少 ${reasonMin} 字才算寫清楚(目前 ${reasonLen} 字)。` : undefined,
      done: reasonPassed,
    },
    {
      question: "判完之後,你接下來最想做的那件事是什麼?",
      state: nextActionChosen ? "ok" : "pending",
      done: nextActionChosen,
    },
  ];
  const allDone = reflections.every((h) => h.done);
  const remaining = reflections.filter((h) => !h.done).length;
  const statusPreview = judgment ? STATUS_LABEL[judgment] : null;

  // 預設摺疊,避免提示遮擋主畫面;有 blockedMessage 時自動展開;狀態持久化
  const [expanded, setExpanded] = usePersistedToggle("painmap:card9:reflection-expanded", false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const keyboardOpenRef = useRef(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const blockedRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  // panel 動態 max-height(px);null 時 fallback 到 className 內的 dvh-based 值
  const [panelMaxH, setPanelMaxH] = useState<number | null>(null);

  // 即時計算 panel 可用高度:viewport - 上下其他元素 - 安全邊距
  // 監聽:window resize、visualViewport resize(行動瀏覽器 URL bar 收放)、
  //       ResizeObserver(blockedMessage 文字換行、按鈕在窄螢幕變兩列)
  useLayoutEffect(() => {
    if (!expanded) return;

    const MIN_PX = 80; // 與 className min-h-[5rem] 對齊
    const MAX_PX = 384; // 24rem 上限,大螢幕也不浪費空間
    const SAFETY = 16; // viewport 邊緣安全邊距

    function recompute() {
      const vv = window.visualViewport;
      const vh = vv ? vv.height : window.innerHeight;
      const headerH = headerRef.current?.getBoundingClientRect().height ?? 0;
      const blockedH = blockedRef.current?.getBoundingClientRect().height ?? 0;
      const actionsH = actionsRef.current?.getBoundingClientRect().height ?? 0;
      // 外層容器有 py-2.5 sm:py-3 + space-y-2 sm:space-y-2.5,加總 ~32px
      const chrome = 32 + SAFETY;
      // 讓 panel 至多吃掉 viewport 的 50%,避免完全蓋住主畫面
      const halfVh = Math.floor(vh * 0.5);
      const available = vh - headerH - blockedH - actionsH - chrome;
      const next = Math.max(MIN_PX, Math.min(MAX_PX, halfVh, available));
      setPanelMaxH(next);
    }

    recompute();
    window.addEventListener("resize", recompute);
    window.visualViewport?.addEventListener("resize", recompute);
    window.visualViewport?.addEventListener("scroll", recompute);

    // 觀察 blockedMessage / actions 高度變化(換行、按鈕變多列)
    const ro = new ResizeObserver(recompute);
    if (headerRef.current) ro.observe(headerRef.current);
    if (blockedRef.current) ro.observe(blockedRef.current);
    if (actionsRef.current) ro.observe(actionsRef.current);

    return () => {
      window.removeEventListener("resize", recompute);
      window.visualViewport?.removeEventListener("resize", recompute);
      window.visualViewport?.removeEventListener("scroll", recompute);
      ro.disconnect();
    };
  }, [expanded, blockedMessage]);

  useEffect(() => {
    if (expanded && keyboardOpenRef.current) {
      keyboardOpenRef.current = false;
      requestAnimationFrame(() => {
        panelRef.current?.focus({ preventScroll: true });
      });
    }
  }, [expanded]);

  function handleToggleClick(e: React.MouseEvent | React.KeyboardEvent) {
    const isKeyboard =
      "detail" in e && (e as React.MouseEvent).detail === 0;
    if (isKeyboard && !expanded) keyboardOpenRef.current = true;
    setExpanded((v) => !v);
  }
  useEffect(() => {
    if (blockedMessage) setExpanded(true);
  }, [blockedMessage, setExpanded]);

  // 找第一個沒想清楚的反思題,跳到對應欄位
  function jumpToFirstUnmet() {
    // 優先順序: 判斷 → 書面理由 → 下一步
    const targetId = !judgmentChosen
      ? "j-true_pain"
      : !reasonPassed
        ? "reason-100w"
        : !nextActionChosen
          ? "na-interview"
          : null;
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => (el as HTMLElement).focus({ preventScroll: true }), 350);
    }
  }

  // Esc 收合,並把焦點還給 header toggle
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        document.getElementById("card9-reflection-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, setExpanded]);

  // 主畫面內的 inline hint 點擊 → 展開,並嘗試跳到第一個未過項目
  useEffect(() => {
    const onExpand = (e: Event) => {
      setExpanded(true);
      const detail = (e as CustomEvent<{ targetIndex?: number }>).detail;
      if (typeof detail?.targetIndex === "number") {
        setTimeout(() => jumpToFirstUnmet(), 200);
      }
    };
    window.addEventListener("painmap:card9:expand-reflection", onExpand);
    return () => window.removeEventListener("painmap:card9:expand-reflection", onExpand);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [judgmentChosen, reasonPassed, nextActionChosen]);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.08)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2 sm:space-y-2.5">
        {/* 摺疊 header */}
        <div ref={headerRef} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleClick}
            aria-expanded={expanded}
            aria-controls="card9-reflection-panel"
            id="card9-reflection-toggle"
            className="flex flex-1 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-hover focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-sm font-semibold text-text-primary shrink-0">反思問題</h3>
              {allDone ? (
                <span className="text-[12px] text-verified inline-flex items-center gap-1">
                  <span aria-hidden>✓</span>3 題都已過
                </span>
              ) : (
                <span className="text-[12px] text-text-secondary truncate">
                  還有 <span className="font-semibold text-secondary">{remaining}</span> 題沒過
                  {!expanded && <span className="text-text-muted">,點開看細節</span>}
                </span>
              )}
            </div>
            <span className="shrink-0 text-text-muted" aria-hidden>
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
            <span className="sr-only">
              {expanded ? "收合反思問題(Esc)" : "展開反思問題"}
            </span>
          </button>
          {!allDone && (
            <button
              type="button"
              onClick={jumpToFirstUnmet}
              className="shrink-0 inline-flex items-center gap-1 rounded-md border border-secondary/40 bg-secondary/10 px-2.5 py-1.5 text-[12px] font-medium text-secondary transition-colors hover:bg-secondary/20 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="跳到第一個沒想清楚的反思題對應欄位"
            >
              <span aria-hidden>↑</span> 帶我去填
            </button>
          )}
        </div>

        {/* 反思內容 — 摺疊區,加上 max-h + overflow-auto 避免吃掉主畫面 */}
        {expanded && (
          <div
            ref={panelRef}
            id="card9-reflection-panel"
            role="region"
            aria-labelledby="card9-reflection-toggle"
            tabIndex={-1}
            className="min-h-[5rem] max-h-[min(38dvh,18rem)] sm:max-h-[min(44dvh,24rem)] overflow-y-auto overscroll-contain pr-1 -mr-1 space-y-2 sm:space-y-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-md"
            style={panelMaxH != null ? { maxHeight: `${panelMaxH}px` } : undefined}
          >
            <ul className="space-y-1.5">
              {hints.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-text-secondary leading-[1.55]"
                >
                  <span
                    aria-hidden
                    className={
                      h.done
                        ? "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[12px] leading-none text-verified"
                        : "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[12px] leading-none text-text-muted"
                    }
                  >
                    {h.done ? "✓" : "○"}
                  </span>
                  <span className={h.done ? "text-text-primary" : ""}>{h.label}</span>
                </li>
              ))}
            </ul>

            {statusPreview && allDone && (
              <p className="text-[12.5px] text-text-secondary">
                <span className="text-text-primary font-medium">送出後 status 將寫入：</span>{" "}
                {statusPreview}
              </p>
            )}
          </div>
        )}

        {blockedMessage && (
          <div
            ref={blockedRef}
            className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary"
          >
            <span className="font-medium text-text-primary">還缺什麼：</span> {blockedMessage}
          </div>
        )}

        <div
          ref={actionsRef}
          className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary"
          >
            ← 回去把卡 8 想清楚再來
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allDone || submitting}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "查看你的痛點身份證 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
