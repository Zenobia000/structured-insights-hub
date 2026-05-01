import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/03")({
  head: () => ({
    meta: [{ title: "卡 3 卡關公式 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={3}
      title="卡關公式"
      goal="用「我每次要 X，都會卡在 Y」的格式把問題定型。AI 會幫你校對是否還夠模糊。"
      fields={[
        "你的初稿（user_draft）— 我每次要 X，都會卡在 Y",
        "AI 校對後的版本（ai_polished）— 可選",
        "AI 列出需要再問清楚的問題（ai_clarifying_questions）",
        "確認此版本（confirmed）",
      ]}
      checks={[
        "user_draft 已填寫",
        "已確認 AI 校對版本",
      ]}
    />
  ),
});
