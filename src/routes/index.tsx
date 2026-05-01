import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PainMap 題眼 — 結構化痛點引擎" },
      {
        name: "description",
        content:
          "把混亂的痛點訊號整理成結構化的問題格式。9 張卡片帶你從「我覺得有問題」走到「我知道問題是什麼、值不值得解」。",
      },
      { property: "og:title", content: "PainMap 題眼 — 結構化痛點引擎" },
      {
        property: "og:description",
        content: "9 張卡片，把抱怨變成可驗證的痛點身份證。",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen bg-page text-text-primary flex items-center">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24 w-full">
        <p className="text-sm font-medium text-secondary tracking-widest uppercase mb-4">
          PainMap · 題眼
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          把抱怨，變成
          <br />
          值得解的問題。
        </h1>
        <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl">
          PainMap 不是想法產生器，也不會幫你打分數。
          它用 9 張卡片帶你把混亂的痛點訊號整理成結構化的「問題格式」——
          從「我覺得有問題」，走到「我知道問題是什麼、誰會遇到、值不值得解」。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/learn/worksheet"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground px-6 py-3 font-semibold transition-colors hover:bg-accent/90"
          >
            開始痛點填空簿
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 py-3 font-medium text-text-primary transition-colors hover:border-secondary/40"
          >
            這是什麼
          </a>
        </div>

        <section
          id="about"
          className="mt-20 grid sm:grid-cols-3 gap-6 border-t border-border pt-10"
        >
          {[
            {
              t: "結構優於裝飾",
              d: "每個欄位都服務於釐清問題，不為了好看而存在。",
            },
            {
              t: "行動優於分析",
              d: "每一張卡都會指出下一步可執行的動作，不是給分數。",
            },
            {
              t: "證據優於意見",
              d: "用具體的人、具體的場景支撐，不靠主觀評等。",
            },
          ].map((p) => (
            <div key={p.t}>
              <h3 className="text-base font-semibold text-text-primary">{p.t}</h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                {p.d}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
