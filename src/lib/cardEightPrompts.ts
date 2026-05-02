/**
 * cardEightPrompts — 卡 8 三階段虛擬訪談的 prompt builder
 *
 * 三階段：
 *   Stage 1: simulation — AI 扮演主人翁回答 3 題（熱身、找回答風格）
 *   Stage 2: audit — UX researcher 視角檢視 stage 1，找誘導/盲點/follow-up
 *   Stage 3: guide — 整理出符合 UX 標準的訪綱（暖場/主軸/probe/結尾/備忘）
 *
 * 原則：
 * - 全部 copy-paste pattern（外部 ChatGPT / Claude），與 Iron Law #5 一致
 * - 每個 prompt 都明示 brand 鐵律：不推銷、不誘導、AI 不取代真人訪談
 * - Stage 3 產出符合 UX research 經典框架（rapport / topic / probe / closing）
 */

import type { PainCard } from "@/types/painCard";

const RULES_BLOCK = `寫作原則（這是嚴格的鐵律）：
- 不要美化、不要奉承
- 不要假裝自己會付錢買產品
- 不要建議我做新工具、App、SaaS
- 用真實生活的口吻
- 如果現況其實沒那麼痛，請直接說`;

/**
 * Stage 1：AI 扮演主人翁回答 3 題訪談題
 */
export function buildSimulationPrompt(input: {
  persona: string;
  stuckFormula: string;
  questions: string[];
}): string {
  const { persona, stuckFormula, questions } = input;
  const q = (i: number) => questions[i]?.trim() || `（請先填第 ${i + 1} 題）`;

  return `我準備訪談一個：${persona || "（請先填上方第 1 位 persona）"}
我的痛點假設是：${stuckFormula || "（請先到卡 3 填卡關公式）"}

請扮演這個受訪者，根據常見現況回答我這 3 題：

1. ${q(0)}
2. ${q(1)}
3. ${q(2)}

${RULES_BLOCK}

請用以下格式回答（讓我之後好整理）：

【Q1 回答】
…

【Q2 回答】
…

【Q3 回答】
…

【你（受訪者）的內心 OS】
（你回答時心裡其實在想什麼？哪些話你不會說出口？哪些是「禮貌性」回答？）
`;
}

/**
 * Stage 2：UX researcher 視角檢視 stage 1，找誘導 / 盲點 / 缺的 follow-up
 */
export function buildAuditPrompt(input: {
  simulationResponse: string;
  questions: string[];
}): string {
  const { simulationResponse, questions } = input;
  const q = (i: number) => questions[i]?.trim() || `（第 ${i + 1} 題未填）`;

  return `你現在是一位資深的 UX researcher，專長是質性訪談設計。

我剛剛用以下 3 題訪談題，跑了一輪 AI 模擬訪談：

【我的訪談題】
1. ${q(0)}
2. ${q(1)}
3. ${q(2)}

【AI 扮演受訪者的完整回答】
${simulationResponse.trim() || "（尚未填入 stage 1 的模擬回覆）"}

請以 UX researcher 的專業眼光，幫我審視這份訪談紀錄，並用以下格式回答：

【1. 誘導性檢查】
逐題檢視，哪幾題暗示了預期答案 / 推銷了某個解法 / 用了二選一框架？
（請具體指出哪一句話、為什麼有問題、改成什麼開放式版本。如果沒問題就寫「Q1 / Q2 / Q3 OK」。）

【2. 受訪者「太完美」的訊號】
真人訪談時，人會猶豫、跳針、答非所問、給社會認可的答案。AI 在哪邊給了「太完美」的回答？
（具體點出哪些片段不像真人會說的話。這提醒我去真人訪談時要特別追問。）

【3. 缺的 follow-up probe】
針對每一題，給 2-3 個建議的追問句（probe），引導受訪者往「具體經驗、最近一次、實際做了什麼」的方向走。

格式：
- Q1 follow-up:
  - probe 1
  - probe 2
- Q2 follow-up:
  - probe 1
  - probe 2
- Q3 follow-up:
  - probe 1
  - probe 2

【4. 整體評語】
這份訪談題拿去問真人，預期會遇到的最大風險是什麼？（一段話，30-100 字）

${RULES_BLOCK}
`;
}

/**
 * Stage 3：整理出符合 UX 標準的訪綱（暖場 / 主軸 / probe / 結尾 / 備忘）
 */
export function buildGuidePrompt(input: {
  simulationResponse: string;
  auditFindings: string;
  card: PainCard;
}): string {
  const { simulationResponse, auditFindings, card } = input;
  const persona = card.interview_plan.targets[0]?.persona?.trim() || "（未填）";
  const stuck = card.stuck_formula.ai_polished?.trim() || "（未填）";
  const workaround = card.workaround.tool_name?.trim() || "（未填）";
  const dissatis =
    card.workaround.user_dissatisfactions.filter(Boolean).slice(0, 3).join("、") || "（未填）";
  const sideA = card.contradiction.side_a?.trim() || "（未填）";
  const sideB = card.contradiction.side_b?.trim() || "（未填）";
  const originalQs = card.interview_plan.questions
    .map((qi, i) => `${i + 1}. ${qi.trim() || `（第 ${i + 1} 題未填）`}`)
    .join("\n");

  return `你現在是一位資深的 UX researcher，需要幫我把以下材料整理成一份**正式可帶去現場使用的訪談大綱**。

【受訪者 persona】
${persona}

【我目前的痛點假設】
- 卡關公式：${stuck}
- 他現在用的解法：${workaround}
- 他不滿之處：${dissatis}
- 他想同時要的兩件事：「${sideA}」 vs 「${sideB}」

【我原本寫的 3 題】
${originalQs}

【AI 模擬訪談紀錄】
${simulationResponse.trim() || "（未做 stage 1）"}

【UX researcher 審查發現（stage 2）】
${auditFindings.trim() || "（未做 stage 2）"}

請依照下面的結構，整理出一份完整的訪談大綱（純 Markdown 格式，我會直接列印帶去面對面訪談）：

---

# 訪談大綱：${persona}

## 暖場（rapport building，5 分鐘）
- 2 個輕鬆的開場問題，不直接觸及痛點，先讓受訪者放鬆
- 各附 1 個追問句

## 主軸（核心痛點探索，20 分鐘）
- 重寫原本那 3 題，移除誘導語、改成開放式
- 每題各附 2-3 個 probe（逐字寫出，方便現場照唸）
- probe 要往「最近一次怎麼做」「具體花了多少時間」「實際遇到的後果」這些方向走

## 結尾（snowball + 開放，5 分鐘）
- 1 個 snowball 題（請受訪者推薦同樣遇到問題的另外 1-2 個人）
- 1 個開放結尾（「你還有沒有什麼我沒問到、但你覺得我該知道的？」）

## 訪談者備忘（給我自己看）

### Do（一定要做）
- 至少 3 條（基於 stage 2 的 audit findings 提煉）

### Don't（千萬別做）
- 至少 3 條（含「不要推銷我的解法」「不要問會不會用 App」「不要問願意付多少錢」）

### 預期時長
- 30 分鐘（含 5 分鐘 buffer）

### 紀錄方式
- 建議錄音 + 手寫關鍵字筆記（事先取得受訪者同意）

---

${RULES_BLOCK}

請把整份訪綱以 Markdown 格式輸出，我會直接複製貼回工具。
`;
}
