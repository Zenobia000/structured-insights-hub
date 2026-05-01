import { createFileRoute } from "@tanstack/react-router";

import { VerdictExport } from "@/components/worksheet/VerdictExport";

export const Route = createFileRoute("/learn/worksheet/result")({
  head: () => ({
    meta: [
      { title: "痛點身份證 — PainMap" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      <header className="space-y-2 mb-8">
        <p className="text-xs font-medium text-secondary tracking-wider uppercase">
          卡 10 / 結果頁
        </p>
        <h1 className="text-3xl font-bold text-text-primary">
          你的痛點身份證
        </h1>
        <p className="text-text-secondary">
          整合前 9 張卡片的精華。匯出後可以拿去訪談、貼到 Notion，或留著之後再回來看。
        </p>
      </header>
      <VerdictExport />
    </main>
  );
}
