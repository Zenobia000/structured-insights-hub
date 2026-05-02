import type { TargetItem } from "./TargetsForm";

export type TargetTemplate = {
  id: string;
  label: string;
  description: string;
  data: TargetItem;
};

/**
 * 一鍵新增訪談對象範本。
 * 每個範本都已經填好「Persona / 認識與否 / 聯絡方式 / 預計時間」的格式骨架,
 * 使用者只需把【方括號】內的占位字替換成自己真實資料即可。
 * contact_info 一律 ≥ 5 字以保證貼進去就過 CONTACT_MIN 驗證。
 */
export const TARGET_TEMPLATES: TargetTemplate[] = [
  {
    id: "known-line",
    label: "已認識 · LINE",
    description: "你已經認識這個人,有 LINE / 電話可以直接約。",
    data: {
      persona: "中小型補習班 30-50 歲數學老師（在【城市】教【科目/年級】）",
      contact_known: true,
      contact_info:
        "林○○老師｜LINE ID: line_id_here｜0912-345-678｜我表妹的數學老師",
      planned_time: "2026-05-10（六）19:00,在【補習班/咖啡廳名稱】聊 30 分鐘",
    },
  },
  {
    id: "known-email",
    label: "已認識 · Email",
    description: "工作場合認識,用 Email 約時間比較自然。",
    data: {
      persona: "50 人新創公司 HR 主管（負責【招募/績效/制度】）",
      contact_known: true,
      contact_info:
        "王○○（HR Lead）｜name@company.com｜上週 5/2 在【研討會名稱】交換名片",
      planned_time: "下週三（5/13）14:00-14:30 線上 Google Meet",
    },
  },
  {
    id: "weak-tie-ig",
    label: "弱連結 · IG/FB",
    description: "見過面但不熟,透過社群 DM 開場。",
    data: {
      persona: "雙北 25-35 歲一週去健身房 3 次以上的上班族",
      contact_known: false,
      contact_info:
        "IG @account_handle｜共同朋友:陳○○｜DM 開場:『我在做一份運動習慣的訪談,想聊 20 分鐘』",
      planned_time: "本週六（5/9）15:00 在【咖啡廳名稱】或線上",
    },
  },
  {
    id: "stranger-community",
    label: "陌生 · 社群徵人",
    description: "完全不認識,去目標社群 PO 文徵願意聊的人。",
    data: {
      persona: "有 3-12 歲孩子的雙薪家長（家庭月收入 8-15 萬）",
      contact_known: false,
      contact_info:
        "去 FB 社團『【社團名稱】』PO 文,徵 3 位願意聊 20 分鐘的家長,回覆者用 Messenger 約時間",
      planned_time: "PO 文後 3 天內收回覆,週末（5/9-10）線上各約 20 分鐘",
    },
  },
  {
    id: "stranger-onsite",
    label: "陌生 · 線下場合",
    description: "去目標族群實體出沒的場合,當面攔人聊。",
    data: {
      persona: "週末市集擺攤 1 年以內的手作創業者(自己一個人做)",
      contact_known: false,
      contact_info:
        "週六 5/9 晚上 19:00 在【市集/活動名稱】現場,直接走訪 2-3 個攤主,開場:『我在做小型創業者訪談,可以聊 10 分鐘嗎?』",
      planned_time: "5/9（六）19:00-21:00 現場走訪",
    },
  },
];
