import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/08")({
  head: () => ({
    meta: [{ title: "卡 8 訪談規劃 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={8}
      title="真人訪談規劃"
      goal="規劃要訪談誰、問哪 3 題、什麼時候約。理解訪談禁忌（不推銷、不問「會付錢嗎」）。"
      fields={[
        "目標訪談對象（targets）— 至少 1 位，含 persona / 是否認識 / 聯絡方式 / 預計時間",
        "訪談題目（questions）— 必須正好 3 題",
        "已理解訪談禁忌（不推銷、不問會不會付錢等）",
        "AI 模擬訪談的熱身產出（可選）",
      ]}
      checks={[
        "至少 1 位訪談對象",
        "正好 3 個訪談問題",
        "已確認理解訪談禁忌",
      ]}
    />
  ),
});
