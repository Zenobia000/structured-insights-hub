import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GUESS_FIELDS,
  GUESS_MIN,
  GUESS_MAX,
  type GuessKey,
} from "@/lib/cardSevenValidators";

type Props = {
  guesses: Record<GuessKey, string>;
  onChange: (key: GuessKey, value: string) => void;
  filled: Record<GuessKey, boolean>;
  allFilled: boolean;
  readonly?: boolean;
  onUnlock: () => void;
  unlocked: boolean;
};

export function PhaseAGuessForm({
  guesses,
  onChange,
  filled,
  allFilled,
  readonly,
  onUnlock,
  unlocked,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-lg bg-surface border border-border border-l-4 border-l-secondary p-6 sm:p-8 space-y-5 max-w-3xl",
        readonly && "opacity-70",
      )}
      aria-label="Phase A 自我猜測"
    >
      <header className="space-y-1">
        <h2 className="text-[22px] font-bold text-text-primary">
          Phase A：先寫你的猜測（不要偷看下面）
        </h2>
        <p className="text-[15px] text-text-secondary leading-[1.6]">
          花 2 分鐘寫，不要超過 5 分鐘。沒有對錯，怎麼猜都過關。
        </p>
        <p className="text-[12px] text-text-muted">建議花 2-5 分鐘</p>
      </header>

      <div className="space-y-5">
        {GUESS_FIELDS.map((f) => {
          const value = guesses[f.key] ?? "";
          const isFilled = filled[f.key];
          return (
            <div key={f.key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`guess-${f.key}`}
                  className="text-[14.5px] font-semibold text-text-primary"
                >
                  {f.label}
                </label>
                {isFilled && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-verified">
                    <Check className="h-3 w-3" /> 已寫
                  </span>
                )}
              </div>
              <p className="text-[12.5px] text-text-secondary leading-[1.55]">
                {f.hint}
              </p>
              <Textarea
                id={`guess-${f.key}`}
                value={value}
                onChange={(e) => onChange(f.key, e.target.value.slice(0, GUESS_MAX))}
                placeholder="寫你最直覺的猜測，10 字以上即可"
                className="min-h-[88px]"
                readOnly={readonly}
                disabled={readonly}
                maxLength={GUESS_MAX}
              />
              <div className="flex items-center justify-between text-[11.5px] text-text-muted">
                <span>
                  {value.trim().length} / {GUESS_MAX} 字（最少 {GUESS_MIN}）
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!unlocked && (
        <div className="pt-2">
          <Button
            type="button"
            onClick={onUnlock}
            disabled={!allFilled}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-muted disabled:text-text-muted"
          >
            我猜完了，解鎖 Phase B →
          </Button>
          {!allFilled && (
            <p className="mt-2 text-[12.5px] text-text-secondary">
              4 欄都寫完才可解鎖（每欄 ≥ {GUESS_MIN} 字）。
            </p>
          )}
        </div>
      )}

      {unlocked && readonly && (
        <p className="text-[12.5px] text-text-secondary italic">
          Phase A 已鎖定。解鎖後不可修改猜測 — 這是設計上的刻意，避免你看到 AI 後回頭改。
        </p>
      )}
    </section>
  );
}
