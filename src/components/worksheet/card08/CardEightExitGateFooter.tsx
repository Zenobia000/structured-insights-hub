import { Button } from "@/components/ui/button";
import { ReflectionHint, type ReflectionHintState } from "@/components/worksheet/ReflectionHint";

type Props = {
  hasContact: boolean;
  questionsAllFilled: boolean;
  taboosUnderstood: boolean;
  blockedMessage: string | null;
  submitting: boolean;
  noContactAtAll: boolean;
  onAdvance: () => void;
  onBackToCard2: () => void;
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
            question="這 3 道題，你今晚就能傳給其中一個人嗎?"
            state={hasContact && questionsAllFilled ? "ok" : "pending"}
            hint={
              !hasContact && !questionsAllFilled
                ? "還沒寫完 3 題訪談題，且至少 1 位訪談對象的「聯絡方式 / 去哪找他」欄要填 ≥ 5 字。"
                : !hasContact
                  ? "回到第一步「訪談對象」卡片,至少 1 位的「聯絡方式（LINE / 電話 / 名字）」或「你打算去哪找他」欄要填 ≥ 5 字。"
                  : !questionsAllFilled
                    ? "3 題訪談題還沒寫完（每題 ≥ 15 字）。"
                    : undefined
            }
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
                ? "回到第一步「訪談對象」,把至少 1 位的「聯絡方式 / 去哪找他」欄填上（≥ 5 字）。"
                : undefined
            }
          />
        </ul>

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還可以再想想：</span> {blockedMessage}
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
