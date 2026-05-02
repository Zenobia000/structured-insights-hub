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
      persona: "【職業/角色】+【場景】,例:中小型補習班 30-50 歲數學老師",
      contact_known: true,
      contact_info: "【姓名】老師 / LINE: 【LINE ID】 / 0912-345-678",
      planned_time: "2026-05-10 19:00 在【地點/線上】聊 30 分鐘",
    },
  },
  {
    id: "known-email",
    label: "已認識 · Email",
    description: "工作場合認識,用 Email 約時間比較自然。",
    data: {
      persona: "【職業/角色】+【公司規模/產業】,例:50 人新創公司 HR 主管",
      contact_known: true,
      contact_info: "【姓名】 <【name】@【company】.com> / 上週研討會交換名片",
      planned_time: "下週三 14:00-14:30 線上 Google Meet",
    },
  },
  {
    id: "weak-tie-ig",
    label: "弱連結 · IG/FB",
    description: "見過面但不熟,透過社群 DM 開場。",
    data: {
      persona: "【職業/角色】+【生活情境】,例:雙北 25-35 歲健身房常客",
      contact_known: false,
      contact_info: "IG @【帳號】 / DM 約週末咖啡聊 20 分鐘,共同朋友:【誰】",
      planned_time: "本週六 15:00 在【咖啡廳名稱】",
    },
  },
  {
    id: "stranger-community",
    label: "陌生 · 社群徵人",
    description: "完全不認識,去目標社群 PO 文徵願意聊的人。",
    data: {
      persona: "【職業/角色】+【痛點場景】,例:有 3-12 歲孩子的雙薪家長",
      contact_known: false,
      contact_info: "去【社團/論壇名稱】PO 文徵 3 位願意聊 20 分鐘的【角色】",
      planned_time: "PO 文後 3 天內回覆者,週末約線上",
    },
  },
  {
    id: "stranger-onsite",
    label: "陌生 · 線下場合",
    description: "去目標族群實體出沒的場合,當面攔人聊。",
    data: {
      persona: "【職業/角色】+【聚集場合】,例:週末市集擺攤的手作創業者",
      contact_known: false,
      contact_info: "下週【日期】晚上在【地點/活動】,直接問 2-3 位【角色】",
      planned_time: "【日期】19:00-21:00 現場走訪",
    },
  },
];
