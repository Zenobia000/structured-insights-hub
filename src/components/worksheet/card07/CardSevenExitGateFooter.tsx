import { Button } from "@/components/ui/button";
import { ReflectionHint, type ReflectionHintState } from "@/components/worksheet/ReflectionHint";

type Props = {
  phaseAComplete: boolean;
  checkpointsAllPassed: boolean;
  checkpointsPassedCount: number;
  tablePassed: boolean;
  deltasAllFilled: boolean;
  blockedMessage: string | null;
  submitting: boolean;
  onAdvance: () => void;
  onBack?: () => void;
};

export function CardSevenExitGateFooter({
  phaseAComplete,
  checkpointsAllPassed,
  checkpointsPassedCount,
  tablePassed,
  deltasAllFilled,
  blockedMessage,
  submitting,
  onAdvance,
  onBack,
}: Props) {
  const phaseAState: ReflectionHintState = phaseAComplete ? "ok" : "pending";
  const checkpointState: ReflectionHintState = checkpointsAllPassed
    ? "ok"
    : checkpointsPassedCount > 0
      ? "thinking"
      : "pending";
  const tableState: ReflectionHintState = tablePassed ? "ok" : "pending";
  const deltasState: ReflectionHintState = deltasAllFilled ? "ok" : "pending";

  const allPassed = phaseAComplete && checkpointsAllPassed && tablePassed && deltasAllFilled;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">反思問題</h3>
        <ul className="flex flex-col gap-2">
          <ReflectionHint
            question="你猜的跟 AI 答的差最多的地方，是因為你想當然了什麼？"
            state={deltasState}
            hint={
              !deltasAllFilled
                ? "3 個 deltas 都填寫完整（每欄 ≥ 20 字），把差異寫具體。"
                : undefined
            }
          />
          <ReflectionHint
            question="你猜之前，是不是已經偷偷套了一個答案？"
            state={phaseAState}
            hint={!phaseAComplete ? "Phase A 4 欄猜測還沒寫完。" : undefined}
          />
          <ReflectionHint
            question="AI 給你的判斷，能不能讓你回去問當事人？"
            state={checkpointState}
            hint={
              !checkpointsAllPassed
                ? `4 個 AI checkpoint 進度 ${checkpointsPassedCount}/4。`
                : undefined
            }
          />
          <ReflectionHint
            question="AI 痛點判斷表你貼回來了嗎？以後要回看的是它，不是你的記憶。"
            state={tableState}
          />
        </ul>

        {blockedMessage && (
          <div className="rounded-md border-2 border-secondary/40 bg-secondary/5 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">還可以再想想：</span> {blockedMessage}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary"
          >
            ← 回去把卡 6 想清楚再來
          </Button>
          <Button
            onClick={onAdvance}
            disabled={!allPassed || submitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            {submitting ? "前往中…" : "繼續到卡 8：真人訪談規劃 →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
