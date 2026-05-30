import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Users, ShieldOff } from "lucide-react";

import { CardHero } from "@/components/worksheet/CardHero";
import { TextareaField } from "@/components/worksheet/card01/FormFields";
import { AiDisabledCallout } from "@/components/worksheet/card02/AiDisabledCallout";
import { AntiFakeCheckPanelCard2 } from "@/components/worksheet/card02/AntiFakeCheckPanelCard2";
import { CardTwoExitGateFooter } from "@/components/worksheet/card02/CardTwoExitGateFooter";
import { ExampleReferenceCard2 } from "@/components/worksheet/card02/ExampleReferenceCard2";
import { PersonGroupRepeater } from "@/components/worksheet/card02/PersonGroupRepeater";
import {
  backgroundCategoriesHit,
  evaluateCardTwo,
  hasContactableKeyword,
  isForbiddenPersonName,
  type Person,
} from "@/lib/cardTwoValidators";
import { judge, toCacheEntry } from "@/lib/llmJudge";
import { useSavedAgo } from "@/hooks/useSavedAgo";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/02")({
  head: () => ({
    meta: [
      { title: "卡 2 三個有名字的人 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "找出 3 個你叫得出名字的真人，且今天就能聯絡到至少 1 位。AI 不能幫忙 — 虛構的人不會付錢，也說不出真話。",
      },
      { property: "og:title", content: '卡 2 三個有名字的人 — PainMap Worksheet' },
      {
        property: "og:description",
        content: '找出 3 個你叫得出名字的真人，且今天就能聯絡到至少 1 位 — 虛構的人不會付錢，也說不出真話。',
      },
    ],
    links: [
      { rel: "canonical", href: "https://structured-insights-hub.lovable.app/learn/worksheet/02" },
    ],
  }),
  component: CardTwoPage,
});

function CardTwoPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const ensurePeopleSlots = usePainCardStore((s) => s.ensurePeopleSlots);
  const markAsDraft = usePainCardStore((s) => s.markAsDraft);

  // 確保 people.list 永遠 3 組
  useEffect(() => {
    if (hydrated) ensurePeopleSlots(3);
  }, [hydrated, ensurePeopleSlots]);

  const people: Person[] = useMemo(() => {
    const list = card.people.list;
    if (list.length >= 3) return list.slice(0, 3);
    const filled = [...list];
    while (filled.length < 3) filled.push({ name: "", contact: "", relation: "" });
    return filled;
  }, [card.people.list]);

  const background = card.people.background;

  // 即時檢核（hardcoded — 仍是 fallback 真相源）
  const checks = useMemo(() => evaluateCardTwo({ background, list: people }), [background, people]);

  // 自我承諾 checkbox（不持久化到 PainCard schema — 僅 page-local）
  const [commitment, setCommitment] = useState(false);

  // 嘗試送出 / blocked / 失敗計數
  const [attempted, setAttempted] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failureCount, setFailureCount] = useState(0);

  // ── LLM 主導的背景具體性判定 ──
  const [bgVerdict, setBgVerdict] = useState<"pass" | "warn" | null>(null);
  const [bgReason, setBgReason] = useState<string | null>(null);
  const [bgAnalyzing, setBgAnalyzing] = useState(false);
  const [bgFallback, setBgFallback] = useState(false);

  // debounce 800ms 後叫 LLM
  useEffect(() => {
    const trimmed = background.trim();
    if (trimmed.length < 10) {
      setBgVerdict(null);
      setBgReason(null);
      setBgAnalyzing(false);
      setBgFallback(false);
      return;
    }
    let cancelled = false;
    setBgAnalyzing(true);
    const timer = setTimeout(async () => {
      try {
        const outcome = await judge(
          "card2.background_specific",
          trimmed,
          undefined,
          card.llm_cache,
        );
        if (cancelled) return;
        if (outcome.source === "fallback") {
          setBgFallback(true);
          setBgVerdict(null);
          setBgReason(null);
        } else {
          setBgFallback(false);
          setBgVerdict(outcome.verdict);
          setBgReason(outcome.reason);
          const entry = toCacheEntry(outcome);
          if (entry) updateField("llm_cache.card2.background_specific", entry);
        }
      } finally {
        if (!cancelled) setBgAnalyzing(false);
      }
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [background, card.llm_cache, updateField]);

  // autosave indicator
  const savedAgo = useSavedAgo(card.updated_at);

  const setPersonField = (i: number, field: keyof Person, value: string) => {
    const next = people.map((p, idx) => (idx === i ? { ...p, [field]: value } : p));
    updateField("people.list", next);
  };

  const setBackground = (v: string) => updateField("people.background", v);

  // 背景具體性「對外」狀態：LLM 有結果 → 用 LLM；否則退回 hardcoded
  const backgroundStatus: typeof checks.specificBackground = (() => {
    if (background.trim().length === 0) return "pending";
    if (bgAnalyzing && bgVerdict === null) return "pending";
    if (bgVerdict === "pass") return "pass";
    if (bgVerdict === "warn") return "warning";
    return checks.specificBackground;
  })();
  const backgroundPass = backgroundStatus === "pass";

  const handleAdvance = async () => {
    setAttempted(true);

    if (checks.allRequiredFilled !== "pass") {
      setBlockedMessage(
        background.trim().length < 10
          ? "背景描述還太簡略。試試寫下年齡、職業、地點這些具體的標記(至少 2 項)。"
          : "每個欄位都先填上吧。需要 3 位真人 + 各自的聯絡方式 + 你跟他的關係。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (checks.realNames !== "pass") {
      const offenders = people
        .filter((p) => isForbiddenPersonName(p.name))
        .map((p) => p.name)
        .join("、");
      setBlockedMessage(
        offenders
          ? `「${offenders}」這種代稱代表你還不夠認識這個人。填一個具體姓名（化名也可以，但要是真人）。`
          : "至少有 1 位還不是具體真人。填一個你聯絡得到的真名。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (checks.contactableExists !== "pass") {
      setBlockedMessage(
        "至少要有 1 位你今天能傳訊息的人（聯絡方式寫 LINE / 電話 / Email / Messenger 都可以）。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    // 背景具體性：等 LLM
    if (bgAnalyzing && bgVerdict === null) {
      setSubmitting(true);
      try {
        const outcome = await judge(
          "card2.background_specific",
          background.trim(),
          undefined,
          card.llm_cache,
        );
        if (outcome.source === "fallback") {
          setBgFallback(true);
          if (checks.specificBackground !== "pass") {
            setBlockedMessage("背景還太籠統。寫 2 個具體標記（年齡、職業、地點都行）就清楚了。");
            setFailureCount((c) => c + 1);
            return;
          }
        } else {
          setBgVerdict(outcome.verdict);
          setBgReason(outcome.reason);
          const entry = toCacheEntry(outcome);
          if (entry) updateField("llm_cache.card2.background_specific", entry);
          if (outcome.verdict !== "pass") {
            setBlockedMessage(`再想想看：${outcome.reason}`);
            setFailureCount((c) => c + 1);
            return;
          }
        }
      } finally {
        setSubmitting(false);
        setBgAnalyzing(false);
      }
    } else if (!backgroundPass) {
      setBlockedMessage(
        bgVerdict === "warn" && bgReason
          ? `再想想看：${bgReason}`
          : "背景還太籠統。寫 2 個具體標記（年齡、職業、地點都行）就清楚了。",
      );
      setFailureCount((c) => c + 1);
      return;
    }
    if (!commitment) {
      setBlockedMessage(
        "最後勾選右側「我確認今天能聯絡到至少 1 位」— 那是你對自己的承諾，不是給我們的。",
      );
      setFailureCount((c) => c + 1);
      return;
    }

    setBlockedMessage(null);
    setSubmitting(true);
    try {
      advanceStep(3);
      navigate({ to: "/learn/worksheet/03" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleParkAndExit = () => {
    markAsDraft();
    navigate({ to: "/learn/worksheet" });
  };

  // background inline warning — LLM reason 優先
  const backgroundWarning = (() => {
    if (!background) return null;
    if (bgAnalyzing && bgVerdict === null) return "AI 正在判讀…";
    if (bgVerdict === "warn") return bgReason ?? "再寫具體一點。";
    if (bgVerdict === "pass") return null;
    if (bgFallback || bgVerdict === null) {
      const cats = backgroundCategoriesHit(background);
      if (background.length >= 10 && cats.length >= 2) return null;
      return "「年輕人」「上班族」太寬。請至少寫 2 個具體屬性（例：30-50 歲、補習班數學老師、台灣）。";
    }
    return null;
  })();

  const contactablePass = checks.contactableExists === "pass";
  const realNamesPass = checks.realNames === "pass";
  const allFilledPass = checks.allRequiredFilled === "pass";
  const canAdvance =
    allFilledPass && realNamesPass && contactablePass && backgroundPass && commitment;

  useEffect(() => {
    setBlockedMessage(null);
  }, [background, JSON.stringify(people), commitment]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-40">
        <CardHero
          illustration="e12-three-named-people"
          alt="三個有名字的姓名牌掛在一條髮絲線上"
        />
        {/* Card intro */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-secondary">
              卡 2 / 9
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-destructive/40 bg-destructive/5 px-2 py-1 text-[11px] font-bold text-destructive"
              aria-label="這張卡禁止使用 AI（鐵律）"
            >
              <ShieldOff className="h-3 w-3" aria-hidden />
              AI 介入：❌ 禁用（鐵律）
            </span>
          </div>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-[1.3] text-text-primary">
            找出 3 個有名字的人
          </h1>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-primary-light/60 p-4">
            <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="text-[15px] leading-[1.6] text-text-primary">
              <span className="font-semibold">規則：</span>
              說那句抱怨的人是誰？像他那樣的人，你能想到 <span className="font-semibold">
                3 個
              </span>{" "}
              嗎？要是 <span className="font-semibold">真名</span>（不是「補習班老師 A」），而且你
              <span className="font-semibold">今天</span>就能聯絡到其中至少 1 位。
            </div>
          </div>

          <p className="mt-4 text-[15px] leading-[1.65] text-text-secondary">
            為什麼一定要 3 個？1 個可能是個案、2 個可能是巧合，要 3 個 — 模式才開始浮現。
          </p>
        </header>

        {/* AI Disabled Callout */}
        <div className="mb-8">
          <AiDisabledCallout />
        </div>

        {/* 70/30 layout */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start">
          <section aria-labelledby="form-title-card2" className="space-y-6">
            <h2 id="form-title-card2" className="sr-only">
              背景 + 3 位真人
            </h2>

            <TextareaField
              id="background"
              label="這群人的特徵（大概是什麼背景）"
              helper="年齡 / 職業 / 地點 / 角色。例：30-50 歲、台灣中小型補習班老師、每週要做家長溝通"
              placeholder="30–50 歲、台灣中小型補習班老師、每週要做家長溝通"
              value={background}
              onChange={setBackground}
              required
              rows={3}
              maxLength={300}
              warning={backgroundWarning}
              highlight={attempted && !backgroundPass}
            />

            <PersonGroupRepeater people={people} attempted={attempted} onChange={setPersonField} />

            <p className="text-[12px] text-text-muted" aria-live="polite">
              {hydrated && savedAgo ? `已悄悄存進你的瀏覽器 · ${savedAgo}` : "還沒開始寫"}
            </p>

            <ExampleReferenceCard2 />

            {/* Mobile: anti-fake panel below form */}
            <div className="lg:hidden">
              <AntiFakeCheckPanelCard2
                checks={checks}
                commitment={commitment}
                onCommitmentChange={setCommitment}
                backgroundStatus={backgroundStatus}
                backgroundHint={bgVerdict === "warn" ? (bgReason ?? undefined) : undefined}
                backgroundAnalyzing={bgAnalyzing && bgVerdict === null}
              />
            </div>
          </section>

          <aside className="hidden lg:block lg:sticky lg:top-6">
            <AntiFakeCheckPanelCard2
              checks={checks}
              commitment={commitment}
              onCommitmentChange={setCommitment}
              backgroundStatus={backgroundStatus}
              backgroundHint={bgVerdict === "warn" ? (bgReason ?? undefined) : undefined}
              backgroundAnalyzing={bgAnalyzing && bgVerdict === null}
            />
            <p className="mt-3 text-[11px] leading-[1.5] text-text-muted">
              偵測到的可聯絡關鍵字：
              <code className="inline-block font-mono mx-0.5 px-1 rounded bg-muted-bg">LINE</code>
              <code className="inline-block font-mono mx-0.5 px-1 rounded bg-muted-bg">電話</code>
              <code className="inline-block font-mono mx-0.5 px-1 rounded bg-muted-bg">Email</code>
              <code className="inline-block font-mono mx-0.5 px-1 rounded bg-muted-bg">
                Messenger
              </code>
              <code className="inline-block font-mono mx-0.5 px-1 rounded bg-muted-bg">FB</code>
              <code className="inline-block font-mono mx-0.5 px-1 rounded bg-muted-bg">IG</code>… 等
            </p>
            <p className="mt-2 text-[11px] leading-[1.5] text-text-muted">
              是否有可聯絡到的真人：
              {(() => {
                const p = people.find(
                  (x) => hasContactableKeyword(x.contact) && x.relation.trim().length > 0,
                );
                return p ? (
                  <span className="text-verified font-semibold ml-1">是（{p.name || "—"}）</span>
                ) : (
                  <span className="text-text-secondary ml-1">尚未確認</span>
                );
              })()}
            </p>
          </aside>
        </div>
      </main>

      <CardTwoExitGateFooter
        realNamesPass={realNamesPass}
        contactablePass={contactablePass}
        backgroundPass={backgroundPass}
        allFilledPass={allFilledPass}
        commitment={commitment}
        submitting={submitting}
        blockedMessage={blockedMessage}
        failureCount={failureCount}
        onAdvance={handleAdvance}
        onParkAndExit={handleParkAndExit}
      />

      <span className="sr-only" aria-live="polite">
        {canAdvance ? "可以走到卡 3 了" : "再多想一下"}
      </span>
    </div>
  );
}
