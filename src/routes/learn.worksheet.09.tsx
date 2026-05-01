import { createFileRoute } from "@tanstack/react-router";
import { CardStub } from "@/components/worksheet/CardStub";

export const Route = createFileRoute("/learn/worksheet/09")({
  head: () => ({
    meta: [{ title: "卡 9 真假判斷 — PainMap" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <CardStub
      cardNumber={9}
      title="真假判斷"
      goal="你自己判斷：這是真痛點、假痛點、還是要先訪談再說？寫下 100 字以上的書面理由。"
      fields={[
        "5 維度自我反思（教學模式內部使用，不對外輸出）",
        "判斷（judgment）— 真痛點 / 假痛點 / 待訪談",
        "100 字以上的判斷理由（reason_100w）",
        "你最有信心的證據 / 最沒信心的部分",
        "下一步行動（next_action）— 訪談 / 補證據 / 換題目",
      ]}
      checks={[
        "已選擇判斷結果",
        "理由至少 100 字",
        "已選擇下一步行動",
      ]}
    />
  ),
});
