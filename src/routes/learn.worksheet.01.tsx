import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/01")({
  head: () => ({
    meta: [{ title: "卡 1 抱怨原句 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={1}
      title="抱怨原句"
      goal="寫下你親耳聽到、親眼看到的那句抱怨原話。不美化、不解釋、不翻譯成你自己的話。"
      fields={[
        "抱怨原句（verbatim）— 一字不漏的原話",
        "誰說的（source_name）— 真名，不可寫「客戶 A」",
        "你跟他的關係（source_relation）",
        "什麼時候說的（datetime）— 日期或情境",
        "當時他在做什麼（scene）— 具體時間+地點+動作",
      ]}
      checks={[
        "寫的是原句，不是你的解釋",
        "至少有 1 個有名字的真人",
        "場景具體（時間 + 地點 + 動作）",
      ]}
    />
  ),
});
