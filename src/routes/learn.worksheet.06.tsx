import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/06")({
  head: () => ({
    meta: [{ title: "卡 6 AI 證據蒐集 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={6}
      title="AI 證據蒐集"
      goal="拿內建的 prompt 去問 AI，把回覆的 8 題答案整理回來。要警覺 AI 會不會偷偷推銷產品。"
      fields={[
        "選擇 AI 工具（ChatGPT DR / Claude / Perplexity / Gemini）",
        "為什麼選這個工具（1 句話）",
        "AI 回覆原文（raw_response）",
        "8 題答案：人群 / 場景 / workaround / 不滿 / 證據 / JTBD / 假痛點 / 訪談對象",
        "確認 AI 沒進入「設計產品」模式",
      ]}
      checks={[
        "8 題答案全部填寫",
        "已確認 AI 沒在推銷解決方案",
      ]}
    />
  ),
});
