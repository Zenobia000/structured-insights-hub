/**
 * NextStepCta — 依 verdict.judgment 的三變體 CTA
 */
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { usePainCardStore } from "@/store/painCard";
import { cn } from "@/lib/utils";

export function NextStepCta() {
  const card = usePainCardStore((s) => s.card);
  const j = card.verdict.judgment;

  const wrapClass = cn(
    "max-w-3xl mx-auto rounded-lg p-8 sm:p-10 border",
    j === "true_pain" && "bg-verified-light border-verified/30",
    j === "pending_interview" && "bg-accent-light border-caution/30",
    j === "fake_pain" && "bg-muted border-border",
    !j && "bg-surface border-border",
  );

  return (
    <section className={wrapClass}>
      <h2 className="text-xl font-bold text-text-primary mb-4">那麼，接下來呢？</h2>
      {j === "true_pain" && <TruePainVariant />}
      {j === "pending_interview" && <PendingInterviewVariant />}
      {j === "fake_pain" && <FakePainVariant />}
      {!j && (
        <p className="text-text-secondary text-sm">
          卡 9 的真假判斷還沒寫，
          <Link to="/learn/worksheet/09" className="text-secondary underline">
            回去寫一下
          </Link>
        </p>
      )}
    </section>
  );
}

function TruePainVariant() {
  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">你寫下了：這是真痛點。</p>
      <p className="mt-2 text-text-secondary text-[15px] leading-relaxed">
        把卡 8 的訪談對象一個一個約起來、現場再確認一次。確認沒問題之後，可以進階段二：PainMap
        App，再往「能不能賺到錢」走一步。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
          <a href="/app/start" rel="noopener">
            進入 PainMap App →
          </a>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link to="/learn/worksheet/08">先去訪談（卡 8 名單）</Link>
        </Button>
      </div>
      <Link
        to="/learn/worksheet/01"
        className="inline-block mt-3 text-sm text-text-secondary hover:text-secondary underline"
      >
        我想從頭再讀一次
      </Link>
    </>
  );
}

function PendingInterviewVariant() {
  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你還拿不準 — 這是最常見的結果，很正常，不用為此焦慮。
      </p>
      <p className="mt-2 text-text-secondary text-[15px] leading-relaxed">
        去找 2-3 個真人聊一聊再回來。通常聊完之後，真假會自己浮出來。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
          <Link to="/learn/worksheet/08">看看要找誰聊 →</Link>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link to="/learn/worksheet/09">聊完之後回來再判一次</Link>
        </Button>
      </div>
    </>
  );
}

function FakePainVariant() {
  const reset = usePainCardStore((s) => s.reset);
  const handleNew = () => {
    if (confirm("要新寫一張嗎？這張會被新的覆蓋掉（建議先匯出 .md 留個備份）。")) {
      reset();
      window.location.href = "/learn/worksheet/01";
    }
  };

  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">你寫下了：這是假痛點。</p>
      <p className="mt-2 text-text-secondary text-[15px] leading-relaxed">
        <strong className="text-text-primary">
          不要覺得可惜。這就是這份填空簿真正的價值 — 它幫你省下了 3 個月走錯路的時間。
        </strong>{" "}
        換個題目，從卡 1 重新走一遍。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button size="lg" onClick={handleNew} className="bg-secondary hover:bg-secondary/90">
          換個題目，從卡 1 開始 →
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link to="/learn/worksheet/09">回卡 9 重看一次判斷</Link>
        </Button>
      </div>
      <p className="mt-4 text-xs text-text-muted">
        這張已經幫你封存起來了 — 匯出之後，當作一次經驗留下來也很值得。
      </p>
    </>
  );
}
