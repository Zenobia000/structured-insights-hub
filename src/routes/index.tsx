import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PainMap Worksheet — 9 張卡片學會判斷一句抱怨是真痛點還是假痛點",
      },
      {
        name: "description",
        content:
          "教學模式痛點填空簿。第一次 90 分鐘，熟練後 30 分鐘。不需要懂創新理論、AI 模型、創業框架；資料只存在你的瀏覽器，不上傳雲端。",
      },
      {
        property: "og:title",
        content: "PainMap Worksheet · 真痛點判斷力訓練器",
      },
      {
        property: "og:description",
        content: "9 張卡片，從一句抱怨到書面判斷的痛點身份證。教學優先、結構化、零遊戲化。",
      },
    ],
  }),
  component: LandingPage,
});
