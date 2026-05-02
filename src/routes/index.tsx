import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PainMap Worksheet — 把一句抱怨聽進去，再判斷它是不是真痛點",
      },
      {
        name: "description",
        content:
          "9 張卡片陪你走過一次真痛點判斷。從一句抱怨開始，找出說這句話的人，再用 AI 找證據對照。30 分鐘後，你會帶走一張自己寫完的痛點身份證。資料只在你的瀏覽器，不上傳、不註冊。",
      },
      {
        property: "og:title",
        content: "PainMap Worksheet · 9 張卡走完一次真痛點判斷",
      },
      {
        property: "og:description",
        content: "從一句抱怨開始，走完 9 張卡片，寫下一張屬於你自己的痛點身份證。",
      },
    ],
  }),
  component: LandingPage,
});
