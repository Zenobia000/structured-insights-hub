import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/04")({
  head: () => ({
    meta: [{ title: "卡 4 現在怎麼解 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={4}
      title="現在怎麼解"
      goal="他現在用什麼工具或方法處理這個痛點？為什麼還是覺得卡？至少寫下 3 個具體不滿。"
      fields={[
        "現有工具/方法的名字（tool_name）— 必須具體",
        "為什麼還是卡（why_still_stuck）",
        "AI 提案的 5 個常見 workaround（ai_alternatives）",
        "至少 3 個具體不滿理由（user_dissatisfactions）",
      ]}
      checks={[
        "tool_name 具體（不是「沒人解過」）",
        "至少 3 個不滿理由",
      ]}
    />
  ),
});
