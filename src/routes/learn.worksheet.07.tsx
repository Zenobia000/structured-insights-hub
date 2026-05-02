import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Brain, AlertCircle, RotateCcw } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { useSavedAgo } from "@/hooks/useSavedAgo";
import { usePainCardStore } from "@/store/painCard";
import {
  evaluateCheckpoints,
  evaluateDeltas,
  evaluatePhaseA,
  evaluateTable,
  TABLE_MIN,
  type CheckpointKey,
  type DeltaKey,
  type GuessKey,
} from "@/lib/cardSevenValidators";
import { ContextSummary } from "@/components/worksheet/card07/ContextSummary";
import { MarkdownView } from "@/components/worksheet/MarkdownView";
import { PhaseAGuessForm } from "@/components/worksheet/card07/PhaseAGuessForm";
import { PhaseBLockedPreview } from "@/components/worksheet/card07/PhaseBLockedPreview";
import { CheckpointList } from "@/components/worksheet/card07/CheckpointList";
import { SecondRoundPromptBlock } from "@/components/worksheet/card07/SecondRoundPromptBlock";
import { DeltasForm } from "@/components/worksheet/card07/DeltasForm";
import { CardSevenExitGateFooter } from "@/components/worksheet/card07/CardSevenExitGateFooter";

export const Route = createFileRoute("/learn/worksheet/07")({
  head: () => ({
    meta: [
      { title: "卡 7 自己先猜，再讀 AI — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "兩段式練習：你先寫下對痛點主人翁的 4 欄猜測，再讀 AI 回覆，看看差在哪。AI 是來補強的，不是替你想的。",
      },
    ],
  }),
  component: CardSevenPage,
});

function CardSevenPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const sg = card.self_guess;
  const rawAi = card.ai_evidence.raw_response.trim();

  // Phase A 解鎖：state-driven，初始值依「已存在 phase_a_completed_at」
  const [unlocked, setUnlocked] = useState<boolean>(Boolean(sg.phase_a_completed_at));

  // hydrate 完成後，若偵測到任何已存在的 Card 7 草稿，顯示「已恢復」橫幅
  const hasDraft = useMemo(() => {
    const anyGuess = Object.values(sg.guesses).some((v) => v.trim().length > 0);
    const anyCheckpoint = Object.values(sg.ai_checkpoints_passed).some(Boolean);
    const anyDelta = Object.values(sg.deltas).some((v) => v.trim().length > 0);
    const anyTable = sg.pain_judgment_table.trim().length > 0;
    return anyGuess || anyCheckpoint || anyDelta || anyTable;
  }, [sg]);
  const [draftBannerDismissed, setDraftBannerDismissed] = useState(false);
  const showDraftBanner = hydrated && hasDraft && !draftBannerDismissed;

  // 同步 store 變化（當 reset / 退回時清空）
  useEffect(() => {
    if (!sg.phase_a_completed_at && unlocked) {
      // 資料被清空但 state 仍 unlocked — 重置
      setUnlocked(false);
    }
  }, [sg.phase_a_completed_at, unlocked]);

  const phaseA = evaluatePhaseA(sg);
  const cp = evaluateCheckpoints(sg);
  const deltas = evaluateDeltas(sg);
  const tablePassed = evaluateTable(sg);

  const setGuess = (key: GuessKey, v: string) => updateField(`self_guess.guesses.${key}`, v);
  const setCheckpoint = (key: CheckpointKey, v: boolean) =>
    updateField(`self_guess.ai_checkpoints_passed.${key}`, v);
  const setDelta = (key: DeltaKey, v: string) => updateField(`self_guess.deltas.${key}`, v);
  const setTable = (v: string) => updateField("self_guess.pain_judgment_table", v);

  function handleUnlock() {
    if (!phaseA.allFilled) return;
    updateField("self_guess.phase_a_completed_at", new Date().toISOString());
    setUnlocked(true);
  }

  // exit gate
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBlockedMessage(null);
  }, [sg.guesses, sg.ai_checkpoints_passed, sg.deltas, sg.pain_judgment_table]);

  function handleAdvance() {
    if (!unlocked || !phaseA.allFilled) {
      setBlockedMessage("Phase A 還沒寫完 — 先自己猜過一輪，再進 Phase B 對照");
      return;
    }
    if (!cp.allPassed) {
      setBlockedMessage(
        `還有 ${4 - cp.passedCount} 個 checkpoint 沒過，可以用第二輪 prompt 補一下`,
      );
      return;
    }
    if (!tablePassed) {
      setBlockedMessage("把第二輪 prompt 的回覆（痛點判斷表）貼上來吧（≥ 100 字）");
      return;
    }
    if (!deltas.allFilled) {
      setBlockedMessage("把「你跟 AI 的差異」寫下來 — 這是這張卡最重要的東西");
      return;
    }
    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(8);
      navigate({ to: "/learn/worksheet/08" });
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackToCard6() {
    const ok = window.confirm(
      "回卡 6 重來會清掉卡 7 寫的內容（猜測、checkpoint、判斷表、差異）。要回去嗎？",
    );
    if (!ok) return;
    // 清空 self_guess
    (
      [
        "most_painful_person",
        "most_common_scene",
        "biggest_dissatisfaction",
        "possible_fake_pain",
      ] as GuessKey[]
    ).forEach((k) => updateField(`self_guess.guesses.${k}`, ""));
    (
      [
        "people_segmented",
        "scenes_observable",
        "workaround_dissatisfactions_listed",
        "fake_pains_flagged",
      ] as CheckpointKey[]
    ).forEach((k) => updateField(`self_guess.ai_checkpoints_passed.${k}`, false));
    updateField("self_guess.pain_judgment_table", "");
    (["biggest_diff", "ai_added", "guess_unsupported"] as DeltaKey[]).forEach((k) =>
      updateField(`self_guess.deltas.${k}`, ""),
    );
    updateField("self_guess.phase_a_completed_at", null);
    setUnlocked(false);
    advanceStep(6);
    navigate({ to: "/learn/worksheet/06" });
  }

  // autosave indicator
  const savedAgo = useSavedAgo(card.updated_at);

  const guessValues = useMemo(
    () => ({
      most_painful_person: sg.guesses.most_painful_person,
      most_common_scene: sg.guesses.most_common_scene,
      biggest_dissatisfaction: sg.guesses.biggest_dissatisfaction,
      possible_fake_pain: sg.guesses.possible_fake_pain,
    }),
    [sg.guesses],
  );

  const deltaValues = useMemo(
    () => ({
      biggest_diff: sg.deltas.biggest_diff,
      ai_added: sg.deltas.ai_added,
      guess_unsupported: sg.deltas.guess_unsupported,
    }),
    [sg.deltas],
  );

  const cpValues = useMemo(
    () => ({
      people_segmented: sg.ai_checkpoints_passed.people_segmented,
      scenes_observable: sg.ai_checkpoints_passed.scenes_observable,
      workaround_dissatisfactions_listed:
        sg.ai_checkpoints_passed.workaround_dissatisfactions_listed,
      fake_pains_flagged: sg.ai_checkpoints_passed.fake_pains_flagged,
    }),
    [sg.ai_checkpoints_passed],
  );

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
        <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 space-y-6">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-32 w-full bg-muted rounded animate-pulse" />
          <div className="h-64 w-full bg-muted rounded animate-pulse" />
          <p className="text-[12px] text-text-muted text-center">
            正在從你的瀏覽器把上次的內容找回來…
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-40 space-y-8">
        {/* card_intro */}
        <header>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 7 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-verified/50 bg-verified/5 px-2 py-1 text-[11px] font-bold text-verified"
              aria-label="這張卡 AI 介入：第二輪追問 prompt"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              AI 介入：✅ 第二輪追問 prompt
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            你先自己猜，再讀 AI 怎麼說
          </h1>
          <p className="mt-3 text-[16px] leading-[1.65] text-text-secondary">
            如果你一開始就看 AI 回覆，會不知不覺被它牽著走 — 你的判斷力就交出去了。
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-lg border-2 border-secondary/40 bg-secondary/5 p-4">
            <Brain className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[14.5px] leading-[1.6] text-text-primary space-y-1">
              <p className="font-semibold">為什麼要先自己猜？</p>
              <p>
                先寫下你的猜測，再對照 AI 回覆。差異的地方，就是你要學的地方。AI
                不是給你答案，是讓你看見自己的盲區。
              </p>
            </div>
          </div>

          <p className="mt-3 text-[12.5px] text-text-secondary italic">
            在你填完下面 4 欄之前，AI 回覆會先被遮住 — 這不是限制，是給你的空間，讓你的判斷不被 AI
            蓋過去。
          </p>
        </header>

        {!rawAi && (
          <div className="flex items-start gap-2.5 rounded-md border-2 border-caution/50 bg-caution/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary">
            <AlertCircle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
            <span>
              卡 6 還沒貼上 AI 回覆。Phase B 解鎖後仍可繼續，但 AI 回覆區會空白。建議先回卡 6 補完。
            </span>
          </div>
        )}

        {showDraftBanner && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-md border-2 border-verified/50 bg-verified/5 px-3 py-2.5 text-[13.5px] leading-[1.55] text-text-primary"
          >
            <RotateCcw className="h-4 w-4 text-verified shrink-0 mt-0.5" aria-hidden />
            <div className="flex-1">
              <p className="font-semibold">幫你從瀏覽器把上次寫的找回來了</p>
              <p className="text-text-secondary mt-0.5">
                Phase A 的猜測、checkpoint 勾選、痛點判斷表與 3 個差異都還在。接著寫就好。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDraftBannerDismissed(true)}
              className="text-[12px] text-text-muted hover:text-text-primary px-2 py-1 -my-1"
              aria-label="關閉恢復提示"
            >
              知道了
            </button>
          </div>
        )}

        <ContextSummary card={card} />

        {/* Phase A */}
        <PhaseAGuessForm
          guesses={guessValues}
          onChange={setGuess}
          filled={phaseA.filled}
          allFilled={phaseA.allFilled}
          readonly={unlocked}
          unlocked={unlocked}
          onUnlock={handleUnlock}
        />

        {/* Phase B */}
        {!unlocked ? (
          <PhaseBLockedPreview />
        ) : (
          <section
            className="rounded-lg bg-surface border border-border border-l-4 border-l-verified p-6 sm:p-8 space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300"
            aria-label="Phase B AI 對照"
          >
            <header className="space-y-1">
              <h2 className="text-[22px] font-bold text-text-primary">
                Phase B：讀 AI 回覆 + 對照差異
              </h2>
              <p className="text-[15px] text-text-secondary leading-[1.6]">
                不是看 AI 對不對，是看 AI 看到了什麼你沒看到 / 漏了什麼你看到了。
              </p>
            </header>

            {/* AI response display */}
            <div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-2">
                AI 第一輪回覆（從卡 6 帶入）
              </h3>
              {rawAi ? (
                <div className="bg-muted-bg p-4 max-h-96 overflow-auto rounded-md border border-border">
                  <MarkdownView>{rawAi}</MarkdownView>
                </div>
              ) : (
                <p className="text-[13px] text-text-secondary italic">（卡 6 尚未貼上 AI 回覆）</p>
              )}
            </div>

            {/* Checkpoints */}
            <CheckpointList values={cpValues} onChange={setCheckpoint} />

            {/* Second round prompt */}
            <SecondRoundPromptBlock />

            {/* Pain judgment table input */}
            <div className="space-y-1.5">
              <label
                htmlFor="pain-judgment-table"
                className="text-[15px] font-semibold text-text-primary block"
              >
                貼上 AI 整理的痛點判斷表
              </label>
              <p className="text-[12.5px] text-text-secondary leading-[1.55]">
                把第二輪 prompt 跑出來的判斷表整段貼進來（≥ {TABLE_MIN} 字）。
              </p>
              <Textarea
                id="pain-judgment-table"
                value={sg.pain_judgment_table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="貼上 AI 給的痛點判斷表..."
                className="min-h-[200px] font-mono text-[13px]"
              />
              <p className="text-[11.5px] text-text-muted">
                {sg.pain_judgment_table.trim().length} 字（最少 {TABLE_MIN}）
              </p>
              {sg.pain_judgment_table.trim().length > 0 && (
                <div className="mt-3">
                  <p className="text-[12px] font-semibold text-text-secondary mb-1.5">預覽（Markdown 渲染）</p>
                  <div className="bg-muted-bg p-4 max-h-96 overflow-auto rounded-md border border-border">
                    <MarkdownView>{sg.pain_judgment_table}</MarkdownView>
                  </div>
                </div>
              )}
            </div>

            {/* Deltas */}
            <DeltasForm values={deltaValues} filled={deltas.filled} onChange={setDelta} />
          </section>
        )}

        <p className="text-[12px] text-text-muted" aria-live="polite">
          {hydrated && savedAgo ? `已悄悄存進你的瀏覽器 · ${savedAgo}` : "還沒開始寫"}
        </p>
      </main>

      <CardSevenExitGateFooter
        phaseAComplete={unlocked && phaseA.allFilled}
        checkpointsAllPassed={cp.allPassed}
        checkpointsPassedCount={cp.passedCount}
        tablePassed={tablePassed}
        deltasAllFilled={deltas.allFilled}
        blockedMessage={blockedMessage}
        submitting={submitting}
        onAdvance={handleAdvance}
        onBack={handleBackToCard6}
      />
    </div>
  );
}
