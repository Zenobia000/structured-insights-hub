import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/05")({
  head: () => ({
    meta: [{ title: "卡 5 矛盾選擇 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={5}
      title="兩件事不能同時要"
      goal="他想要的兩件事，為什麼不能同時達成？從 6 種 TRIZ 矛盾中選一種，不可複選。"
      fields={[
        "TRIZ 類型（triz_id）— 6 選 1（速度 vs 品質、客製 vs 規模 等）",
        "A 端：他想要這個（side_a）",
        "B 端：他也想要這個（side_b）",
        "通常會犧牲哪一邊（sacrificed: a / b）",
      ]}
      checks={[
        "已選擇一種 TRIZ 矛盾",
        "side_a 與 side_b 都已填寫",
        "已標記哪邊通常被犧牲",
      ]}
    />
  ),
});
