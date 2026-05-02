/**
 * Card 2 anti-fake validators —
 * R2.2 強化版：people.list[*].name 不是「老師 A / persona 1 / A / B / C」這類代稱
 * Contactable check：至少 1 個 contact 包含可立即傳訊的關鍵字 + 使用者勾選自我承諾
 * Background check：>= 10 字 且 至少 2 個具體屬性類別關鍵字（年齡 / 職業 / 地點）
 *
 * 純函式，無副作用。
 */

import type { CheckStatus } from "./cardOneValidators";

export type Person = { name: string; contact: string; relation: string };

/** R2.2 禁用代稱清單（單獨/包含偵測） */
const FORBIDDEN_NAME_PATTERNS: RegExp[] = [
  /^老師\s*[A-Za-z]$/i, // 老師 A / 老師B
  /^同學\s*[A-Za-z]$/i, // 同學 A
  /^學生\s*[A-Za-z]$/i,
  /^[A-Za-z]$/, // A、B、C 單字母
  /^persona\s*\d+$/i, // persona 1
  /^user\s*\d+$/i, // User 1
  /^客戶\s*[A-Za-z\d]$/i,
  /^某位?(老師|同學|學生|客戶|人)$/, // 某老師、某位老師
  /^(他|她|某人|某位)$/,
];

/** 可聯絡關鍵字（contact 欄位包含其一即視為「今天能傳訊息」） */
const CONTACTABLE_KEYWORDS = [
  "LINE",
  "line",
  "電話",
  "手機",
  "Email",
  "email",
  "mail",
  "Messenger",
  "messenger",
  "FB",
  "fb",
  "facebook",
  "IG",
  "ig",
  "Instagram",
  "instagram",
  "WhatsApp",
  "whatsapp",
  "WeChat",
  "wechat",
  "微信",
  "Telegram",
  "telegram",
  "簡訊",
  "SMS",
  "sms",
  "Discord",
  "discord",
  "Slack",
  "slack",
  "Teams",
  "@", // 含 @ 的視為 email/handle
];

/** 背景具體性 — 三個類別關鍵字（命中 >= 2 類即通過） */
const BACKGROUND_CATEGORY_KEYWORDS: Record<"age" | "occupation" | "location", string[]> = {
  age: [
    "歲",
    "代",
    "年級",
    "後",
    "中年",
    "青年",
    "退休",
    "20",
    "30",
    "40",
    "50",
    "60",
    "year old",
    "years old",
    "yo",
    "yrs",
    "20s",
    "30s",
    "40s",
    "50s",
    "60s",
  ],
  occupation: [
    "老師",
    "教師",
    "醫師",
    "護理",
    "工程師",
    "設計師",
    "業務",
    "經理",
    "主管",
    "創業",
    "店長",
    "店主",
    "老闆",
    "員工",
    "助理",
    "顧問",
    "律師",
    "會計",
    "學生",
    "家長",
    "媽媽",
    "爸爸",
    "工程",
    "行銷",
    "業者",
    "從業",
    "職人",
    "RD",
    "PM",
    "HR",
    "QA",
    "客服",
    "廚師",
    "司機",
    "保全",
    "leader",
    "leaders",
    "business leader",
    "business leaders",
    "manager",
    "managers",
    "founder",
    "founders",
    "owner",
    "owners",
    "entrepreneur",
    "entrepreneurs",
    "executive",
    "executives",
    "ceo",
    "cto",
    "operator",
    "operators",
    "sales",
    "marketing",
    "ops",
  ],
  location: [
    "台北",
    "新北",
    "桃園",
    "台中",
    "台南",
    "高雄",
    "新竹",
    "基隆",
    "宜蘭",
    "花蓮",
    "台東",
    "屏東",
    "嘉義",
    "雲林",
    "彰化",
    "苗栗",
    "南投",
    "台灣",
    "北部",
    "中部",
    "南部",
    "東部",
    "市區",
    "鄉下",
    "永和",
    "板橋",
    "海外",
    "美國",
    "日本",
    "香港",
    "中國",
    "大陸",
    "東南亞",
    "taipei",
    "taipei city",
    "taiwan",
    "new taipei",
    "taichung",
    "tainan",
    "kaohsiung",
    "hsinchu",
    "tokyo",
    "hong kong",
    "japan",
    "usa",
    "us",
    "america",
    "china",
    "sea",
  ],
};

export function isForbiddenPersonName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  return FORBIDDEN_NAME_PATTERNS.some((re) => re.test(trimmed));
}

export function hasContactableKeyword(contact: string): boolean {
  if (!contact) return false;
  return CONTACTABLE_KEYWORDS.some((k) => contact.includes(k));
}

export function backgroundCategoriesHit(text: string): Array<"age" | "occupation" | "location"> {
  const normalized = text.toLowerCase();
  const hit: Array<"age" | "occupation" | "location"> = [];
  (
    Object.keys(BACKGROUND_CATEGORY_KEYWORDS) as Array<keyof typeof BACKGROUND_CATEGORY_KEYWORDS>
  ).forEach((k) => {
    if (BACKGROUND_CATEGORY_KEYWORDS[k].some((w) => normalized.includes(w.toLowerCase()))) hit.push(k);
  });
  return hit;
}

export type CardTwoChecks = {
  /** check_1 — 3 個都是真名（不是代稱） */
  realNames: CheckStatus;
  /** check_2 — 至少 1 個 contact 含可聯絡關鍵字（自我承諾 checkbox 另計） */
  contactableExists: CheckStatus;
  /** check_3 — background 具體性 */
  specificBackground: CheckStatus;
  /** 全欄位皆非空（background + 3 組 name/contact/relation） */
  allRequiredFilled: CheckStatus;
};

export type CardTwoInput = {
  background: string;
  list: Person[]; // 必為 3 筆
};

export function evaluateCardTwo(input: CardTwoInput): CardTwoChecks {
  const list = input.list;
  const background = input.background.trim();

  // realNames
  const filledNames = list.filter((p) => p.name.trim().length > 0);
  const anyForbidden = list.some((p) => isForbiddenPersonName(p.name));
  const realNames: CheckStatus =
    filledNames.length === 0
      ? "pending"
      : anyForbidden || filledNames.length < 3
        ? "warning"
        : "pass";

  // contactableExists
  const filledContacts = list.filter((p) => p.contact.trim().length > 0);
  const contactablePerson = list.find(
    (p) => hasContactableKeyword(p.contact) && p.relation.trim().length > 0,
  );
  const contactableExists: CheckStatus =
    filledContacts.length === 0 ? "pending" : contactablePerson ? "pass" : "warning";

  // specificBackground
  const cats = backgroundCategoriesHit(background);
  const specificBackground: CheckStatus =
    background.length === 0
      ? "pending"
      : background.length >= 10 && cats.length >= 2
        ? "pass"
        : "warning";

  // allRequiredFilled — 全部 minLength 1 + background >= 10
  const everyPersonFilled = list.every(
    (p) => p.name.trim().length > 0 && p.contact.trim().length > 0 && p.relation.trim().length > 0,
  );
  const allRequiredFilled: CheckStatus =
    background.length >= 10 && everyPersonFilled ? "pass" : "pending";

  return { realNames, contactableExists, specificBackground, allRequiredFilled };
}

/** Card 2 是否可進入卡 3（不含 commitment checkbox — 由 page 自行 AND） */
export function canAdvanceCardTwo(checks: CardTwoChecks): boolean {
  return (
    checks.allRequiredFilled === "pass" &&
    checks.realNames === "pass" &&
    checks.contactableExists === "pass" &&
    checks.specificBackground === "pass"
  );
}

export const CARD_TWO_CONTACTABLE_KEYWORDS = CONTACTABLE_KEYWORDS;
