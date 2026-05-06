import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GitMerge, AlertCircle } from "lucide-react";

import { CardHero } from "@/components/worksheet/CardHero";
import { TextareaField } from "@/components/worksheet/card01/FormFields";
import { ExampleReferenceCard5 } from "@/components/worksheet/card05/ExampleReferenceCard5";
import { CardFiveExitGateFooter } from "@/components/worksheet/card05/CardFiveExitGateFooter";
import { evaluateCardFive } from "@/lib/cardFiveValidators";
import { useSavedAgo } from "@/hooks/useSavedAgo";
import { usePainCardStore } from "@/store/painCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/worksheet/05")({
  head: () => ({
    meta: [
      { title: "卡 5 兩件事不能同時要 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "用主人翁自己的話，寫出他同時想要的 A、B 兩件事 — 以及他通常會放掉哪一邊、為什麼放得下。",
      },
    ],
  }),
  component: CardFivePage,
});

function CardFivePage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const c = card.contradiction;
  const checks = useMemo(() => evaluateCardFive(c), [c]);

  const stuck = card.stuck_formula.ai_polished?.trim() ?? "";
  const stuckOrWorkaroundMissing = !stuck || !card.workaround.tool_name.trim();

  // 嘗試送出
  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // autosave
  const savedAgo = useSavedAgo(card.updated_at);

  useEffect(() => {
    setBlockedMessage(null);
  }, [c.side_a, c.side_b, c.sacrificed, c.sacrificed_reason]);

  const setSideA = (v: string) => updateField("contradiction.side_a", v);
  const setSideB = (v: string) => updateField("contradiction.side_b", v);
  const setSacrificed = (v: "a" | "b") => updateField("contradiction.sacrificed", v);
  const setSacrificedReason = (v: string) => updateField("contradiction.sacrificed_reason", v);

  const sidesPass = checks.sideAFilled === "pass" && checks.sideBFilled === "pass";
  const sacrificedPass = checks.sacrificedSelected === "pass";
  const sacrificedReasonPass = checks.sacrificedReasonFilled === "pass";

  const handleAdvance = () => {
    setAttempted(true);
    if (checks.sideAFilled !== "pass" || checks.sideBFilled !== "pass") {
      setBlockedMessage(
        "兩端都要寫具體（不是「想要好」「想要快」這種抽象詞）。每端至少 10 字 — 想想他真正想要的是什麼。",
      );
      return;
    }
    if (!sacrificedPass) {
      setBlockedMessage("再想想他通常會放掉哪一邊。");
      return;
    }
    if (!sacrificedReasonPass) {
      setBlockedMessage("為什麼那一邊會被放掉？用一句話描述他實際遇到的情況（至少 10 字）。");
      return;
    }

    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(6);
      navigate({ to: "/learn/worksheet/06" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-40 space-y-8">
        <CardHero
          illustration="e14-contradiction-scale"
          alt="古老天平向一邊傾斜 — TRIZ 矛盾"
        />
        {/* card_intro */}
        <header>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary mb-3">
            卡 5 / 9
          </p>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            兩件他都想要，可是只能選一個
          </h1>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary-light/60 p-4">
            <GitMerge className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[15px] leading-[1.6] text-text-primary">
              <span className="font-semibold">為什麼要看這個：</span>
              很多痛點底下藏的是「他想要兩件事，但只能選一個」。看清這個矛盾，後面才知道訪談該怎麼問、解法該往哪邊切。
            </div>
          </div>

          {/* Socratic prompt — 不再列 6 種分類 */}
          <div className="mt-5 rounded-lg border border-border bg-surface px-4 sm:px-5 py-4">
            <p className="text-[12px] font-semibold tracking-wide uppercase text-text-secondary mb-2">
              先在腦中問自己一遍
            </p>
            <p className="text-[15px] sm:text-[15.5px] leading-[1.7] text-text-primary">
              「他想要 ___，但又同時想要 ___。如果他能放掉其中一邊，他不會卡在這裡——所以他
              <span className="font-semibold">放不下哪邊</span>？為什麼？」
            </p>
          </div>
        </header>

        {stuckOrWorkaroundMissing && (
          <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary">
            <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>
              卡 3「卡關公式」或卡 4「現有解法」尚未填寫，這張卡的描述會缺脈絡。建議先補完。
            </span>
          </div>
        )}

        {/* Section A — 他想要的第一件事 */}
        <section className="space-y-3">
          <h2 className="text-[18px] font-bold text-text-primary">A：他想要這個</h2>
          <TextareaField
            id="side_a"
            label="他想要 A："
            helper="用主人翁自己的話寫具體（≥ 10 字）— 不是抽象詞如「想要好」。"
            placeholder="家長要看見「我的孩子」被個別關照（具體事件、語氣有溫度）"
            value={c.side_a}
            onChange={setSideA}
            required
            rows={3}
            maxLength={300}
            error={
              attempted && checks.sideAFilled !== "pass" ? "請寫具體（至少 10 字）" : undefined
            }
            highlight={attempted && checks.sideAFilled !== "pass"}
          />
        </section>

        {/* Section B — 他同時想要的第二件事 */}
        <section className="space-y-3">
          <h2 className="text-[18px] font-bold text-text-primary">B：他同時又想要這個</h2>
          <TextareaField
            id="side_b"
            label="他同時又想要 B："
            helper="跟 A 對立的另一邊（≥ 10 字）。寫到這兩件事「同時要」會撞在一起。"
            placeholder="老師一週只有 2-3 小時可寫 30 則（每則 < 6 分鐘）"
            value={c.side_b}
            onChange={setSideB}
            required
            rows={3}
            maxLength={300}
            error={
              attempted && checks.sideBFilled !== "pass" ? "請寫具體（至少 10 字）" : undefined
            }
            highlight={attempted && checks.sideBFilled !== "pass"}
          />
        </section>

        {/* Section C — 通常犧牲哪邊 + 為什麼 */}
        <section className="space-y-5">
          <div>
            <h2 className="text-[18px] font-bold text-text-primary">C：通常會犧牲哪邊？為什麼？</h2>
            <p className="mt-1 text-[14px] text-text-secondary leading-[1.6]">
              真實情況中，這 2 件事撞在一起時，他通常先放掉哪邊？
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-[15px] font-semibold text-text-primary">
              通常會犧牲：
              <span aria-hidden className="text-text-muted ml-1">
                *
              </span>
            </legend>
            <div className="flex flex-col sm:flex-row gap-2">
              {(["a", "b"] as const).map((v) => {
                const checked = c.sacrificed === v;
                return (
                  <label
                    key={v}
                    className={cn(
                      "flex-1 flex items-center gap-2 rounded-md border px-3 py-2.5 cursor-pointer",
                      "focus-within:ring-2 focus-within:ring-ring",
                      checked
                        ? "border-secondary bg-secondary/5"
                        : "border-border bg-surface hover:bg-muted-bg/40",
                    )}
                  >
                    <input
                      type="radio"
                      name="sacrificed"
                      value={v}
                      checked={checked}
                      onChange={() => setSacrificed(v)}
                      className="h-4 w-4 accent-secondary cursor-pointer"
                    />
                    <span className="text-[14.5px] text-text-primary font-medium">
                      犧牲 {v.toUpperCase()} 端
                    </span>
                  </label>
                );
              })}
            </div>
            {attempted && !sacrificedPass && (
              <p className="text-[12.5px] text-destructive">請選通常會犧牲哪邊</p>
            )}
          </fieldset>

          <TextareaField
            id="sacrificed_reason"
            label="為什麼那邊會被犧牲？用一句話寫真實情況。"
            helper="不用講大道理，講他實際遇到時會發生什麼事（≥ 10 字）。"
            placeholder="時間到了就用罐頭訊息頂著，家長一看就知道沒在用心，但老師也沒辦法。"
            value={c.sacrificed_reason}
            onChange={setSacrificedReason}
            required
            rows={3}
            maxLength={400}
            error={
              attempted && checks.sacrificedReasonFilled !== "pass"
                ? "請用一句話寫清楚（至少 10 字）"
                : undefined
            }
            highlight={attempted && checks.sacrificedReasonFilled !== "pass"}
          />
        </section>

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo ? `已悄悄存進你的瀏覽器 · ${savedAgo}` : "還沒開始寫"}
        </p>

        <ExampleReferenceCard5 />
      </main>

      <CardFiveExitGateFooter
        sidesPass={sidesPass}
        sacrificedPass={sacrificedPass}
        sacrificedReasonPass={sacrificedReasonPass}
        submitting={submitting}
        blockedMessage={blockedMessage}
        onAdvance={handleAdvance}
      />
    </div>
  );
}
