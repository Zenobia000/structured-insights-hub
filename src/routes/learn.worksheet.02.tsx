import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/02")({
  head: () => ({
    meta: [{ title: "卡 2 三個有名字的人 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={2}
      title="三個有名字的人"
      goal="列出 3 個你身邊真實認識、可能也遇到這個問題的人。每個人都要有名字、聯絡方式、你跟他的關係。"
      fields={[
        "大概是什麼背景（background）— 年齡 / 職業 / 地點",
        "人 1：姓名 + 聯絡方式（LINE/Email/電話）+ 關係",
        "人 2：姓名 + 聯絡方式 + 關係",
        "人 3：姓名 + 聯絡方式 + 關係",
      ]}
      checks={[
        "正好填寫 3 位",
        "每位都有真實姓名（不是「補習班老師 A」）",
        "每位都有可聯絡到的方式",
      ]}
    />
  ),
});
