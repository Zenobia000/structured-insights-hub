/**
 * Card 4 AI 回應解析工具
 *
 * 設計：純函式，無副作用，可測試。
 *
 * 用途：
 * - parseAiAlternatives：把使用者貼回的 AI 回應（bullet / 編號 / 換行任意組合）
 *   解析成乾淨的 string[]，餵給 TagInputField。
 * - detectSolutionModeWords：偵測 AI 回應中誤入「solution mode」的禁詞
 *   （例：「建議你開發 App」「應該做一個」），給 inline warning 用，不擋輸入。
 *
 * 為什麼解析要寬鬆：
 *   ChatGPT / Claude / Perplexity 給的格式各不相同（有的會編號、有的用 bullet、
 *   有的中英括號混用），我們不想為了統一格式逼使用者額外整理 — 直接接受所有合理變體。
 */

/**
 * 把雜亂的 AI 回應切成 array。處理常見格式變體：
 *   - "1. xxx\n2. yyy"           → ["xxx", "yyy"]
 *   - "- xxx\n- yyy"             → ["xxx", "yyy"]
 *   - "• xxx\n* yyy"             → ["xxx", "yyy"]
 *   - "(1) xxx (2) yyy"          → ["xxx", "yyy"]（同一行也支援）
 *   - 多空行、前後空白皆會被 trim
 *   - 過長 (>80 字) 的單項會被截到 80（避免使用者把整段 AI 解釋當一個 tag）
 *   - 空項會被過濾
 *
 * 不做：語意去重（"Notion 模板" vs "用 Notion" 視為不同 — 留給使用者判斷）
 */
export function parseAiAlternatives(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  return rawText
    .split(/\r?\n+/)
    .flatMap((line) => splitInlineNumbered(line))
    .map(stripLeadingMarker)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => (s.length > 80 ? s.slice(0, 80) : s));
}

/**
 * 偵測「solution mode」禁詞 — AI 不該叫使用者「去做新工具」「開發 App」，
 * 那破壞 worksheet 的鐵律（這階段只練判斷，不練做產品）。
 *
 * 命中時回傳清單給 UI 顯示 warning（黃色），不擋繼續。
 */
const SOLUTION_MODE_WORDS = [
  "建議你開發",
  "建議開發",
  "你應該做",
  "你應該開發",
  "可以開發",
  "推薦做",
  "建議做一個",
  "你可以做",
  "建議製作",
  "考慮做",
  "建議推出",
] as const;

export function detectSolutionModeWords(text: string): string[] {
  if (!text) return [];
  const compact = text.replace(/\s/g, "");
  return SOLUTION_MODE_WORDS.filter((w) => compact.includes(w));
}

// ────────────────────────────────────────────────────────────
// internal helpers
// ────────────────────────────────────────────────────────────

/**
 * 把同一行內的編號項拆開，例如 "(1) abc (2) def" → ["(1) abc", "(2) def"]
 * 沒命中編號模式時原樣回傳單元素陣列。
 */
function splitInlineNumbered(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed) return [];
  // (1) (2) (3)... 或 1) 2)... 模式
  const inlineNumbered = trimmed.split(/(?=[（(]?\d+[）)]\s)/g);
  if (inlineNumbered.length > 1) return inlineNumbered;
  return [trimmed];
}

/**
 * 去掉 bullet/編號前綴：
 *   "1. xxx" → "xxx"
 *   "- xxx" → "xxx"
 *   "• xxx" → "xxx"
 *   "(1) xxx" → "xxx"
 *   "**xxx**" → "xxx" (markdown bold)
 */
function stripLeadingMarker(line: string): string {
  return line
    .replace(/^[（(]?\d+[）)]\.?\s*/, "") // (1) / 1. / 1) / （1）
    .replace(/^[-*•·▪▫◦‣⁃]\s*/, "") // bullet
    .replace(/^\*\*(.+?)\*\*\s*[:：-]?\s*/, "$1") // **xxx** prefix → xxx
    .replace(/^\*\*(.+?)\*\*$/, "$1"); // 整段被 ** 包
}
