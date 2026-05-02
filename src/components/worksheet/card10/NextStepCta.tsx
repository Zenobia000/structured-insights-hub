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
      <h2 className="text-xl font-bold text-text-primary mb-4">下一步去哪？</h2>
      {j === "true_pain" && <TruePainVariant />}
      {j === "pending_interview" && <PendingInterviewVariant />}
      {j === "fake_pain" && <FakePainVariant />}
      {!j && (
        <p className="text-text-secondary text-sm">
          尚未完成真假判斷。<Link to="/learn/worksheet/09" className="text-secondary underline">
            回到卡 9
          </Link>
        </p>
      )}
    </section>
  );
}

function TruePainVariant() {
  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你判定這是真痛點。
      </p>
      <p className="mt-2 text-text-secondary text-[15px] leading-relaxed">
        卡 8 的訪談對象排起來，現場確認後，可以進入 PainMap App
        進階版繼續分析。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
          <a href="/app/start" rel="noopener">
            進入 PainMap App →
          </a>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link to="/learn/worksheet/08">先去訪談（卡 8 對象）</Link>
        </Button>
      </div>
      <Link
        to="/learn/worksheet/01"
        className="inline-block mt-3 text-sm text-text-secondary hover:text-secondary underline"
      >
        我想再回顧一次
      </Link>
    </>
  );
}

function PendingInterviewVariant() {
  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你還無法判斷，這是最常見的結果，很正常。
      </p>
      <p className="mt-2 text-text-secondary text-[15px] leading-relaxed">
        訪談 2-3 人後回來重新打分。通常訪談完，真假就會浮出來。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
          <Link to="/learn/worksheet/08">查看訪談對象 →</Link>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link to="/learn/worksheet/09">訪談完後回來重打分</Link>
        </Button>
      </div>
    </>
  );
}

function FakePainVariant() {
  const reset = usePainCardStore((s) => s.reset);
  const handleNew = () => {
    if (
      confirm(
        "建立新的痛點身份證？目前這張將被覆蓋（建議先匯出 .md 保存後再繼續）。",
      )
    ) {
      reset();
      window.location.href = "/learn/worksheet/01";
    }
  };

  return (
    <>
      <p className="text-base sm:text-lg font-medium text-text-primary">
        你判定這是假痛點。
      </p>
      <p className="mt-2 text-text-secondary text-[15px] leading-relaxed">
        <strong className="text-text-primary">
          不要難過。這就是這份卡片的價值 — 幫你省下 3 個月走錯路的時間。
        </strong>{" "}
        換題目，從卡 1 重新填。
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          onClick={handleNew}
          className="bg-secondary hover:bg-secondary/90"
        >
          換題目，從卡 1 開始 →
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link to="/learn/worksheet/09">回到卡 9 修改判斷</Link>
        </Button>
      </div>
      <p className="mt-4 text-xs text-text-muted">
        這張身份證已標記為「假痛點封存」，匯出後可作為學習紀錄保留。
      </p>
    </>
  );
}
