import { useState } from "react";
import { Check, AlertCircle, BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  QUESTION_MAX,
  QUESTION_MIN,
  SAMPLE_QUESTIONS,
  findSellingHits,
} from "@/lib/cardEightValidators";

type Props = {
  questions: string[];
  onChange: (index: number, value: string) => void;
};

export function QuestionForm({ questions, onChange }: Props) {
  const [drawerTarget, setDrawerTarget] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-text-secondary leading-[1.55]">
          建議方向：上次發生 + 怎麼解 + 花多久。每題至少 {QUESTION_MIN} 字。
        </p>
        <Sheet
          open={drawerTarget !== null}
          onOpenChange={(o) => !o && setDrawerTarget(null)}
        >
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDrawerTarget(0)}
              className="h-8"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              範例題庫
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>從範例題庫挑一題</SheetTitle>
              <SheetDescription>
                點選一題會填入第 {(drawerTarget ?? 0) + 1} 題。範例只是參考，建議改寫成你自己的問法。
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              <div className="flex gap-2 text-[12.5px]">
                填入：
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDrawerTarget(i)}
                    className={
                      "px-2 py-0.5 rounded " +
                      (drawerTarget === i
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-text-secondary")
                    }
                  >
                    Q{i + 1}
                  </button>
                ))}
              </div>
              <ul className="space-y-2 mt-2">
                {SAMPLE_QUESTIONS.map((q, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(drawerTarget ?? 0, q);
                        setDrawerTarget(null);
                      }}
                      className="w-full text-left rounded-md border border-border bg-surface p-3 text-[13.5px] text-text-primary hover:border-secondary/60 transition-colors"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {[0, 1, 2].map((i) => {
        const value = questions[i] ?? "";
        const ok = value.trim().length >= QUESTION_MIN;
        const hits = findSellingHits(value);
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`q-${i}`}
                className="text-[14.5px] font-semibold text-text-primary"
              >
                第 {i + 1} 題
              </label>
              {ok && (
                <span className="text-[11.5px] text-verified inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> 已寫
                </span>
              )}
            </div>
            <Textarea
              id={`q-${i}`}
              value={value}
              onChange={(e) => onChange(i, e.target.value.slice(0, QUESTION_MAX))}
              placeholder="例：你最近一次寫家長回報是什麼時候？花多久？發生了什麼？"
              className="min-h-[80px]"
            />
            <div className="flex items-center justify-between text-[11.5px] text-text-muted">
              <span>
                {value.trim().length} / {QUESTION_MAX} 字（最少 {QUESTION_MIN}）
              </span>
            </div>
            {hits.length > 0 && (
              <div className="flex items-start gap-2 rounded-md border-2 border-caution/40 bg-caution/5 p-2.5 text-[12.5px] text-text-primary">
                <AlertCircle
                  className="h-3.5 w-3.5 text-caution shrink-0 mt-0.5"
                  aria-hidden
                />
                <div>
                  <p className="font-semibold">這題像在推銷（命中：{hits.join("、")}）。</p>
                  <p className="text-text-secondary mt-0.5">
                    建議改成「你現在用什麼方法在解這個問題？」這類只問現況的題目。
                    （仍可保留原句，這只是提醒，不會擋過關。）
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
