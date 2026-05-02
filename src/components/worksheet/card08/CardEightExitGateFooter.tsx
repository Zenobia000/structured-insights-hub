import { Button } from "@/components/ui/button";
import {
  ReflectionHint,
  type ReflectionExample,
  type ReflectionHintState,
} from "@/components/worksheet/ReflectionHint";

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

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">反思問題</h3>
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

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還可以再想想:</span> {blockedMessage}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant={noContactAtAll ? "default" : "ghost"}
            onClick={onBackToCard2}
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
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "繼續到卡 9：真假判斷 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
