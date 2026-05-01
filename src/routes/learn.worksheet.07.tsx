import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/07")({
  head: () => ({
    meta: [{ title: "卡 7 自己先猜 + 讀 AI — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={7}
      title="自己先猜 + 讀 AI"
      goal="讀 AI 之前，先憑直覺寫下你的猜測。讀完之後比對差異，看看自己的盲點在哪。"
      fields={[
        "4 項猜測：最痛的人 / 最常場景 / 最大不滿 / 可能假痛點",
        "4 個讀 AI 檢查點（人群分群 / 場景可觀察 / workaround 不滿列出 / 假痛點標記）",
        "AI 整理的痛點判斷表（pain_judgment_table）",
        "差異分析：最大差異 / AI 補了什麼 / 你的猜測沒證據支撐的",
      ]}
      checks={[
        "4 項猜測已填寫",
        "4 個 AI 檢查點全部通過",
        "差異分析 3 欄已填寫",
      ]}
    />
  ),
});
