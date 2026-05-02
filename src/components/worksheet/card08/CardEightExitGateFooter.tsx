import { useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ReflectionHint,
  type ReflectionExample,
  type ReflectionHintState,
} from "@/components/worksheet/ReflectionHint";
import { usePersistedToggle } from "@/hooks/usePersistedToggle";

/**
 * 「聯絡方式 / 你打算去哪找他」欄的填寫範例
 * 涵蓋三種真實場景：認識的人 / 弱連結 / 完全陌生
 * 全部都 ≥ 5 字（CONTACT_MIN）以保證一貼上就過驗證
 */
const CONTACT_EXAMPLES: ReflectionExample[] = [
  { label: "LINE", text: "林老師(認識) / LINE: teacher_lin / 0912-345-678" },
  { label: "IG", text: "IG @some_user / DM 約週末咖啡聊 30 分鐘" },
  { label: "Email", text: "王經理 wang@example.com / 上週研討會交換名片" },
  { label: "社群", text: "去家長社團 PO 文徵 3 位願意聊 20 分鐘的家長" },
  { label: "場合", text: "下週三晚上補習班接小孩時間,直接問 2-3 位家長" },
];


type Props = {
  hasContact: boolean;
  questionsAllFilled: boolean;
  taboosUnderstood: boolean;
  blockedMessage: string | null;
  submitting: boolean;
  noContactAtAll: boolean;
  onAdvance: () => void;
  onBackToCard2: () => void;
  /** 跳到第一個缺『聯絡方式』的訪談對象,做高亮 + 捲動 + focus */
  onJumpToMissingContact?: () => void;
};

export function CardEightExitGateFooter({
  hasContact,
  questionsAllFilled,
  taboosUnderstood,
  blockedMessage,
  submitting,
  noContactAtAll,
  onAdvance,
  onBackToCard2,
  onJumpToMissingContact,
}: Props) {
  const contactState: ReflectionHintState = hasContact ? "ok" : "pending";
  const questionsState: ReflectionHintState = questionsAllFilled ? "ok" : "pending";
  const taboosState: ReflectionHintState = taboosUnderstood ? "ok" : "pending";

  const allPassed = hasContact && questionsAllFilled && taboosUnderstood;

  // 4 個反思問題裡有幾個還沒過 → 用在 collapsed summary
  const reflections = [hasContact && questionsAllFilled, questionsAllFilled, taboosUnderstood, hasContact];
  const remaining = reflections.filter((p) => !p).length;

  // 預設摺疊,避免反思內容遮擋主畫面;有 blockedMessage 時自動展開;狀態持久化
  const [expanded, setExpanded] = usePersistedToggle("painmap:card8:reflection-expanded", false);
  useEffect(() => {
    if (blockedMessage) setExpanded(true);
  }, [blockedMessage, setExpanded]);

  // 找第一個未過的反思題,定義跳轉動作
  function jumpToFirstUnmet() {
    if (!hasContact && onJumpToMissingContact) {
      onJumpToMissingContact();
      return;
    }
    const targetId = !questionsAllFilled
      ? "card8-questions"
      : !taboosUnderstood
        ? "card8-rules"
        : null;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // focus 第一個 input/textarea/button 讓鍵盤使用者也能銜接
        setTimeout(() => {
          const focusable = el.querySelector<HTMLElement>(
            "textarea, input, button, [tabindex]:not([tabindex='-1'])",
          );
          focusable?.focus({ preventScroll: true });
        }, 350);
      }
    }
  }

  // Esc 收合;只在 expanded 時生效,且不影響其他 input 的 Esc
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, setExpanded]);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.08)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">
        {/* 摺疊 header — 永遠顯示,壓縮高度 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="card8-reflection-panel"
            id="card8-reflection-toggle"
            className="flex flex-1 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-hover focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-sm font-semibold text-text-primary shrink-0">反思問題</h3>
              {allPassed ? (
                <span className="text-[12px] text-verified inline-flex items-center gap-1">
                  <span aria-hidden>✓</span>4 題都已過
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
          {!allPassed && (
            <button
              type="button"
              onClick={jumpToFirstUnmet}
              className="shrink-0 inline-flex items-center gap-1 rounded-md border border-secondary/40 bg-secondary/10 px-2.5 py-1.5 text-[12px] font-medium text-secondary transition-colors hover:bg-secondary/20 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="跳到第一個未過的反思題對應欄位"
            >
              <span aria-hidden>↑</span> 帶我去填
            </button>
          )}
        </div>

        {/* 反思內容 — 摺疊區,加上 max-h + overflow-auto 避免吃掉主畫面 */}
        {expanded && (
          <div
            id="card8-reflection-panel"
            role="region"
            aria-labelledby="card8-reflection-toggle"
            className="max-h-[40vh] overflow-y-auto pr-1 -mr-1 space-y-3"
          >
            <ul className="flex flex-col gap-2">
              <ReflectionHint
                question="這 3 道題,你今晚就能傳給其中一個人嗎?"
                state={hasContact && questionsAllFilled ? "ok" : "pending"}
                hint={
                  !hasContact && !questionsAllFilled
                    ? "還沒寫完 3 題訪談題,且至少 1 位訪談對象的「聯絡方式 / 去哪找他」欄要填 ≥ 5 字。"
                    : !hasContact
                      ? "回到第一步「訪談對象」卡片,至少 1 位的「聯絡方式」或「你打算去哪找他」欄要填 ≥ 5 字。"
                      : !questionsAllFilled
                        ? "3 題訪談題還沒寫完(每題 ≥ 15 字)。"
                        : undefined
                }
                examples={!hasContact ? CONTACT_EXAMPLES : undefined}
              />
              <ReflectionHint
                question="你寫的題,是在問他「怎麼做的」,還是在誘導他說「想用你的解法」?"
                state={questionsState}
                hint={
                  !questionsAllFilled
                    ? "每題 ≥ 15 字才算寫完。好題的關鍵描述:① 問「上次/最近一次」的具體經驗(過去式),② 聚焦「怎麼做、用什麼、花多久、卡在哪」,③ 不出現你的產品名 / 解法 / 「會不會想用」這類引導詞。避免:假設性問題(「如果有 XX 你會用嗎」)、是非題、推銷式描述。"
                    : undefined
                }
              />
              <ReflectionHint question="訪談時哪些事不要做,你有清楚嗎?" state={taboosState} />
              <ReflectionHint
                question="你已經有能訪談的人了嗎?"
                state={contactState}
                hint={
                  !hasContact
                    ? "回到第一步「訪談對象」,把至少 1 位的「聯絡方式 / 去哪找他」欄填上(≥ 5 字)。直接複製下方範例貼進去再改成你的真實資料。"
                    : undefined
                }
                examples={!hasContact ? CONTACT_EXAMPLES : undefined}
              />
            </ul>

            {!hasContact && onJumpToMissingContact && (
              <button
                type="button"
                onClick={onJumpToMissingContact}
                className="inline-flex items-center gap-1.5 self-start rounded-md border border-secondary/40 bg-secondary/10 px-3 py-1.5 text-[12.5px] font-medium text-secondary transition-colors hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              >
                ↑ 帶我去填「聯絡方式」欄
              </button>
            )}
          </div>
        )}

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還可以再想想:</span> {blockedMessage}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant={noContactAtAll ? "default" : "ghost"}
            onClick={onBackToCard2}
            size="sm"
            className={
              noContactAtAll
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                : "text-text-secondary hover:text-text-primary"
            }
          >
            ← 回去把卡 2 想清楚再來{noContactAtAll ? "（你還沒接觸這群人）" : ""}
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allPassed || submitting}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "繼續到卡 9：真假判斷 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
