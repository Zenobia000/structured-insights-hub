/**
 * Card 10 — 痛點身份證匯出工具
 *
 * 匯出工具：純前端、不需登入、不打 API
 * - Markdown template
 * - JSON（完整 PainCard 物件）
 * - PDF（使用 jsPDF 文字版輸出）
 */

import type { PainCard, Judgment, NextAction } from "@/types/painCard";

export const JUDGMENT_LABEL: Record<Judgment, string> = {
  true_pain: "真痛點",
  fake_pain: "假痛點",
  pending_interview: "待訪談",
};

export const NEXT_ACTION_LABEL: Record<NextAction, string> = {
  interview: "訪談卡 8 的對象",
  more_evidence: "再蒐集更多證據",
  change_topic: "換題目，從卡 1 重新填",
};

/**
 * 產生檔名安全的 slug
 * - 保留 ASCII 字母、數字、底線
 * - 保留 CJK 統一漢字（含擴展 A/B/常用補充）與全形假名
 * - 其餘空白與符號 → "-"
 * - 移除作業系統檔名保留字 / 控制碼
 * - 限長 30 字（中英混算字元）
 */
export function slugify(text: string): string {
  const normalized = (text || "")
    .normalize("NFC")
    .toLowerCase()
    // 把所有「非允許字元」換成 -
    // 允許：a-z 0-9 _ + 中日韓統一漢字（基本區 + 擴展 A）+ 注音 + 假名
    .replace(/[^\w\u3400-\u4dbf\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\u3100-\u312f]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return normalized || "untitled";
}

/**
 * 移除作業系統檔名保留字元，避免 Windows / macOS / Linux 任一拒收
 * 保留中文，僅清理 \ / : * ? " < > | 與控制碼
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "untitled";
}

export function exportFilename(card: PainCard, ext: "md" | "json" | "pdf"): string {
  const slug = slugify(card.complaint.verbatim.slice(0, 20));
  const date = new Date().toISOString().slice(0, 10);
  return sanitizeFilename(`paincard-${slug}-${date}.${ext}`);
}

export function interviewGuideFilename(card: PainCard, ext: "md" | "pdf" = "pdf"): string {
  const slug = slugify(card.complaint.verbatim.slice(0, 20));
  const date = new Date().toISOString().slice(0, 10);
  return sanitizeFilename(`paincard-interview-guide-${slug}-${date}.${ext}`);
}

export function sacrificedLabel(card: PainCard): string {
  if (card.contradiction.sacrificed === "a") return `A 端（${card.contradiction.side_a || "—"}）`;
  if (card.contradiction.sacrificed === "b") return `B 端（${card.contradiction.side_b || "—"}）`;
  return "（未選）";
}

/**
 * 完整 PainCard 是否足以進入結果頁（Card 10 prerequisite）
 */
export function isCardCompleteForResult(card: PainCard): {
  ok: boolean;
  redirect: string | null;
  reason: string;
} {
  if (card.current_step < 10) {
    return {
      ok: false,
      redirect: `/learn/worksheet/${String(card.current_step).padStart(2, "0")}`,
      reason: `卡 ${card.current_step} 還沒寫完，先回去把它寫完再來`,
    };
  }
  if (!card.verdict.judgment) {
    return { ok: false, redirect: "/learn/worksheet/09", reason: "卡 9 的真假判斷還沒寫" };
  }
  if ((card.verdict.reason_100w || "").length < 100) {
    return {
      ok: false,
      redirect: "/learn/worksheet/09",
      reason: "判斷理由再多寫一點（至少 100 字）",
    };
  }
  return { ok: true, redirect: null, reason: "" };
}

/**
 * Markdown template — 嚴格遵照 worksheet 順序
 */
export function buildMarkdown(card: PainCard): string {
  const firstPerson = card.people.list[0];
  const stuck = card.stuck_formula.ai_polished || "（未填）";
  const dis = card.workaround.user_dissatisfactions;
  const targets = card.interview_plan.targets;
  const qs = card.interview_plan.questions;
  const j = card.verdict.judgment;
  const judgmentText = j ? JUDGMENT_LABEL[j] : "（未判斷）";
  const nextActionText = card.verdict.next_action
    ? NEXT_ACTION_LABEL[card.verdict.next_action]
    : "（未決定）";

  const lines: string[] = [];
  lines.push(`# 痛點身份證`, ``);
  lines.push(
    `**主人翁**：${firstPerson ? `${firstPerson.name}（${firstPerson.relation}）` : "（未填）"}`,
  );
  lines.push(`**建立日期**：${card.created_at.slice(0, 10)}`);
  lines.push(`**最後更新**：${card.updated_at.slice(0, 16).replace("T", " ")}`);
  lines.push(`**判定**：${judgmentText}`, ``, `---`, ``);

  lines.push(`## 場景`, ``, `> ${card.complaint.verbatim || "（未填）"}`, ``);
  lines.push(`**卡關公式**：${stuck}`, ``);

  lines.push(`## 他現在怎麼解`);
  lines.push(`- 工具/方法：${card.workaround.tool_name || "（未填）"}`);
  lines.push(`- 為什麼還是卡：${card.workaround.why_still_stuck || "（未填）"}`);
  if (dis.length > 0) {
    lines.push(`- 不滿意：`);
    dis.slice(0, 3).forEach((d) => lines.push(`  - ${d}`));
  }
  lines.push(``);

  lines.push(`## 兩件事不能同時要`);
  lines.push(`- A 端：${card.contradiction.side_a || "（未填）"}`);
  lines.push(`- B 端：${card.contradiction.side_b || "（未填）"}`);
  lines.push(`- 通常犧牲：${sacrificedLabel(card)}`);
  lines.push(`- 犧牲理由：${card.contradiction.sacrificed_reason || "（未填）"}`, ``);

  lines.push(`## AI 找到的關鍵證據`, ``);
  lines.push(card.self_guess.pain_judgment_table || "（未填）", ``);
  lines.push(`**AI 工具**：${card.ai_evidence.ai_tool ?? "（未填）"}`, ``);

  lines.push(`## 我自己猜 vs AI 答的差異`);
  lines.push(`- 最大差異：${card.self_guess.deltas.biggest_diff || "（未填）"}`);
  lines.push(`- AI 補了：${card.self_guess.deltas.ai_added || "（未填）"}`);
  lines.push(`- 我猜但 AI 沒支持：${card.self_guess.deltas.guess_unsupported || "（未填）"}`, ``);

  lines.push(`## 我會優先訪談`);
  if (targets[0]) {
    lines.push(`- 對象：${targets[0].persona}`);
    if (targets[0].contact_info) lines.push(`- 聯絡：${targets[0].contact_info}`);
    if (targets[0].planned_time) lines.push(`- 預定時間：${targets[0].planned_time}`);
  } else {
    lines.push(`- （未填）`);
  }
  if (qs.length > 0) {
    lines.push(`- 訪談題：`);
    qs.slice(0, 3).forEach((q, i) => lines.push(`  ${i + 1}. ${q}`));
  }
  lines.push(``);

  lines.push(`## 我的判斷`, ``, `**${judgmentText}**`, ``);
  lines.push(card.verdict.reason_100w || "（未填）", ``);
  lines.push(`- 最有把握：${card.verdict.most_confident_evidence || "（未填）"}`);
  lines.push(`- 最沒把握：${card.verdict.least_confident || "（未填）"}`, ``);

  lines.push(`## 下一步`, ``, nextActionText, ``);

  // 訪談大綱（卡 8 stage 3 產出，存在才附）
  const guide = card.interview_plan.interview_guide_md?.trim();
  if (guide) {
    lines.push(`---`, ``, `## 訪談大綱（你帶走的劇本）`, ``, guide, ``);
  }

  return lines.join("\n");
}

/**
 * 單獨匯出訪綱為 PDF（透過瀏覽器列印對話框 → 另存為 PDF）
 * 採用原生 print 方案：完整支援繁體中文，零字型依賴。
 *
 * 使用情境：印出來面對面訪談時，只需要訪綱不需要前面的整理。
 */
export async function exportInterviewGuide(card: PainCard): Promise<void> {
  const guide = card.interview_plan.interview_guide_md?.trim();
  if (!guide) {
    throw new Error("尚未產出訪綱（卡 8 stage 3 未完成）");
  }
  const persona = card.interview_plan.targets[0]?.persona?.trim() || "受訪者";
  const created = (card.interview_plan.guide_generated_at ?? card.updated_at).slice(0, 10);
  const filename = interviewGuideFilename(card, "pdf");

  // 動態載入 markdown 渲染（與 Card 7 / 8 同套：react-markdown + remark-gfm）
  const [{ marked }] = await Promise.all([import("marked").catch(() => ({ marked: null as never }))]);

  // 若 marked 未安裝則退回單純 <pre>；正常情況下使用 marked 渲染表格 / 清單
  let bodyHtml: string;
  if (marked) {
    bodyHtml = await marked.parse(guide, { gfm: true, breaks: true });
  } else {
    bodyHtml = `<pre>${escapeHtml(guide)}</pre>`;
  }

  const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(filename)}</title>
<style>
  /* ============================================================
     Page setup — A4 + 頁眉頁尾 + 頁碼
     注意：@page margin-box (top-center / bottom-right …) 目前
     主流瀏覽器（Chrome/Edge/Safari/Firefox）的支援度有限。
     我們採「保留 @page 規則 + 同時用 fixed position 模擬頁眉頁尾」雙保險：
       - 列印時 fixed 元素會在每一頁重複（Chrome/Safari 行為）
       - @page 邊距留出空間給它們
     ============================================================ */
  @page {
    size: A4;
    margin: 22mm 18mm 24mm 18mm;
    /* 標準 margin box（部分 print engine 會吃這個） */
    @bottom-center {
      content: "第 " counter(page) " 頁 / 共 " counter(pages) " 頁";
      font-family: "Helvetica Neue", "PingFang TC", sans-serif;
      font-size: 9pt;
      color: #94a3b8;
    }
    @top-right {
      content: "PainMap · 訪談大綱";
      font-family: "Helvetica Neue", "PingFang TC", sans-serif;
      font-size: 8.5pt;
      color: #94a3b8;
    }
  }
  @page :first {
    margin-top: 24mm;
    @top-right { content: ""; }   /* 首頁不顯示頁眉，已有 doc-head */
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; }

  /* ---------- Typography base ----------
     Sans 用於正文（中文最佳閱讀）；Serif 給 blockquote 引述塊增加儀式感 */
  :root {
    --ink-900: #0f172a;
    --ink-800: #1e293b;
    --ink-700: #334155;
    --ink-600: #475569;
    --ink-500: #64748b;
    --ink-400: #94a3b8;
    --line:    #e2e8f0;
    --line-2:  #cbd5e1;
    --tint:    #f8fafc;
    --tint-2:  #f1f5f9;
    --accent:  #0f766e;
  }

  body {
    font-family: "Helvetica Neue", "Segoe UI", -apple-system, BlinkMacSystemFont,
      "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", "Heiti TC", sans-serif;
    color: var(--ink-700);
    font-size: 11pt;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-feature-settings: "kern" 1, "palt" 1;
    /* CJK 友善：允許在中日韓字之間斷行，但英文單字保留不破詞 */
    word-break: normal;
    overflow-wrap: anywhere;        /* 連續長字串（URL / 英文）強制換行 */
    line-break: strict;
    /* 中文標點懸掛（PingFang 等支援） */
    hanging-punctuation: allow-end last;
  }

  /* ---------- Header (首頁文件頭) ---------- */
  header.doc-head {
    border-bottom: 2px solid var(--ink-900);
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  header.doc-head .eyebrow {
    font-size: 8.5pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 6px;
  }
  header.doc-head h1 {
    font-size: 22pt;
    font-weight: 700;
    color: var(--ink-900);
    letter-spacing: -0.01em;
    margin: 0 0 8px;
    line-height: 1.25;
  }
  header.doc-head .meta {
    font-size: 9.5pt;
    color: var(--ink-500);
    letter-spacing: 0.02em;
  }
  header.doc-head .meta b {
    color: var(--ink-700);
    font-weight: 600;
  }

  /* ---------- Headings inside markdown body ---------- */
  main h1, main h2, main h3, main h4, main h5, main h6 {
    color: var(--ink-900);
    font-weight: 700;
    line-height: 1.4;
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  main h1 {
    font-size: 16pt;
    margin: 1.6em 0 0.5em;
    padding-bottom: 4px;
    border-bottom: 1.5px solid var(--ink-900);
    page-break-before: auto;
  }
  main h2 {
    font-size: 13.5pt;
    margin: 1.5em 0 0.45em;
    padding-left: 10px;
    border-left: 3px solid var(--accent);
  }
  main h3 {
    font-size: 11.5pt;
    margin: 1.2em 0 0.35em;
    color: var(--ink-800);
  }
  main h4 {
    font-size: 10.5pt;
    margin: 1em 0 0.3em;
    color: var(--ink-700);
    text-transform: none;
    letter-spacing: 0.02em;
  }
  /* 標題後緊接的段落不要被孤立 */
  main h1 + p, main h2 + p, main h3 + p, main h4 + p {
    page-break-before: avoid;
    break-before: avoid;
  }

  /* ---------- Paragraphs & inline ---------- */
  main p {
    margin: 0.55em 0;
    orphans: 3;
    widows: 3;
    /* 中英文混排時避免英文長字串撐破版面 */
    overflow-wrap: anywhere;
    word-break: normal;
  }
  main strong, main b {
    font-weight: 700;
    color: var(--ink-900);
  }
  main em, main i {
    color: var(--ink-700);
    font-style: italic;
  }

  /* ---------- Lists ---------- */
  main ul, main ol {
    padding-left: 1.5em;
    margin: 0.6em 0;
  }
  main ul { list-style: none; padding-left: 0; }
  main ul > li {
    position: relative;
    padding-left: 1.2em;
    margin: 0.35em 0;
    page-break-inside: avoid;
    break-inside: avoid;
    overflow-wrap: anywhere;
  }
  main ul > li::before {
    content: "";
    position: absolute;
    left: 0.25em;
    top: 0.75em;
    width: 5px;
    height: 5px;
    background: var(--accent);
    border-radius: 50%;
  }
  main ol { list-style: decimal; }
  main ol > li {
    margin: 0.4em 0;
    padding-left: 0.3em;
    page-break-inside: avoid;
    break-inside: avoid;
    overflow-wrap: anywhere;
  }
  main ol > li::marker {
    color: var(--accent);
    font-weight: 700;
  }
  main li > ul, main li > ol { margin: 0.25em 0; }
  /* 巢狀清單超過 3 層 → 不強制 avoid，否則會撐破整頁 */
  main li li li { page-break-inside: auto; break-inside: auto; }

  /* ---------- Blockquote ---------- */
  main blockquote {
    margin: 1em 0;
    padding: 10px 16px;
    background: var(--tint);
    border-left: 3px solid var(--accent);
    color: var(--ink-700);
    font-family: "Georgia", "Songti TC", "PMingLiU", serif;
    font-size: 10.5pt;
    line-height: 1.7;
    page-break-inside: avoid;
    break-inside: avoid;
    overflow-wrap: anywhere;
  }
  main blockquote p { margin: 0.3em 0; }

  /* ---------- Code ---------- */
  main code {
    font-family: "SFMono-Regular", Menlo, Consolas, "Courier New", monospace;
    font-size: 9.5pt;
    background: var(--tint);
    color: var(--ink-800);
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid var(--line);
    /* 行內 code 中文 / 長字串強制換行，避免溢出版心 */
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: pre-wrap;
  }
  main pre {
    background: var(--tint);
    border: 1px solid var(--line);
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 9pt;
    line-height: 1.55;
    /* 列印時不能 overflow:auto（看不到捲軸內容）→ 改為強制換行 */
    overflow: visible;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: anywhere;
    page-break-inside: auto;     /* 長 code 區塊允許跨頁 */
    break-inside: auto;
  }
  main pre code {
    border: 0;
    padding: 0;
    background: transparent;
    white-space: inherit;
  }

  /* ---------- Tables（中文表格防截斷 + 跨頁重複表頭）---------- */
  main table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    font-size: 10pt;
    /* fixed 佈局：每欄等寬，文字會自動換行而不會把欄位撐爆出版心 */
    table-layout: fixed;
    page-break-inside: auto;     /* 允許跨頁 */
    break-inside: auto;
  }
  main thead {
    display: table-header-group;  /* Chrome / Safari / Firefox 跨頁時自動重複表頭 */
  }
  main tfoot { display: table-footer-group; }
  main tr {
    page-break-inside: avoid;     /* 單列不被切成兩半 */
    break-inside: avoid;
    page-break-after: auto;
    break-after: auto;
  }
  main th, main td {
    border: 1px solid var(--line-2);
    padding: 7px 9px;
    text-align: left;
    vertical-align: top;
    line-height: 1.6;
    /* 中文 / 英文混排都能斷行，避免撐破欄寬 */
    overflow-wrap: anywhere;
    word-break: normal;
    line-break: strict;
    /* 安全網：超出仍可被裁切，但 fixed layout + anywhere 已大幅降低機率 */
    overflow: hidden;
  }
  main th {
    background: var(--ink-900);
    color: #fff;
    font-weight: 600;
    font-size: 9.5pt;
    letter-spacing: 0.03em;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  main tbody tr:nth-child(even) td {
    background: var(--tint);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* 表格內的 code / 長字串再加保險 */
  main td code, main td a, main td span {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  /* ---------- 圖片 ---------- */
  main img {
    max-width: 100%;
    height: auto;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* ---------- 其他 ---------- */
  main hr {
    border: none;
    border-top: 1px solid var(--line);
    margin: 1.6em 0;
  }
  main a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--accent);
    overflow-wrap: anywhere;
  }

  /* ---------- 文件尾（首頁底部） ---------- */
  footer.doc-foot {
    margin-top: 32px;
    padding-top: 12px;
    border-top: 1px solid var(--line);
    font-size: 8.5pt;
    color: var(--ink-400);
    line-height: 1.6;
    letter-spacing: 0.02em;
  }

  /* ---------- Utility classes (markdown 內用 HTML 時可選用) ---------- */
  .page-break    { page-break-before: always; break-before: page; }
  .avoid-break   { page-break-inside: avoid; break-inside: avoid; }
  .no-print      { display: none !important; }

  /* ---------- Print-specific overrides ---------- */
  @media print {
    body { font-size: 10.5pt; }
    a { color: inherit; border-bottom: 0; }
    /* Chrome 預設不印背景色 → 強制 */
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    /* 表頭 / blockquote / table tint 都要印得出來 */
    main th, main tbody tr:nth-child(even) td, main blockquote, main code, main pre {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    /* 隱藏螢幕版可能殘留的捲軸 */
    main pre { overflow: visible !important; }
  }

  /* ---------- 螢幕預覽（fallback HTML 直接打開時也好看） ---------- */
  @media screen {
    body {
      max-width: 820px;
      margin: 40px auto;
      padding: 0 32px;
    }
  }
</style>
</head>
<body>
  <header class="doc-head">
    <div class="eyebrow">PainMap · Interview Guide</div>
    <h1>訪談大綱</h1>
    <div class="meta">
      <b>受訪者</b>：${escapeHtml(persona)}　·　<b>產生日期</b>：${escapeHtml(created)}
    </div>
  </header>
  <main>${bodyHtml}</main>
  <footer class="doc-foot">
    此訪綱由 PainMap Worksheet 卡 8 三階段虛擬訪談產出，請拿去找真人訪談。AI 模擬不能取代真實對話。
  </footer>
  <script>
    // 若是 fallback 開新視窗模式才自動 print；
    // iframe 主流程由父頁面控制，避免重複觸發。
    if (window.opener || window.name === "paincard-print-window") {
      window.addEventListener("load", function () {
        setTimeout(function () { window.focus(); window.print(); }, 200);
      });
    }
  </script>
</body>
</html>`;

  // ---- 主流程：隱藏 iframe（不會被 popup blocker 擋）----
  try {
    await printViaIframe(html, filename);
    return;
  } catch (iframeErr) {
    console.warn("[exportInterviewGuide] iframe print failed, fallback to popup", iframeErr);
  }

  // ---- 備援 1：開新視窗 ----
  const win = window.open("", "paincard-print-window");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    return;
  }

  // ---- 備援 2：popup 被擋 → 下載 HTML 檔 + 拋出可讀錯誤 ----
  downloadBlob(
    filename.replace(/\.pdf$/, ".html"),
    "text/html;charset=utf-8",
    html,
  );
  throw new Error(
    "瀏覽器擋下了列印視窗。已改為下載 HTML 檔給你 — 打開後按 Ctrl/Cmd + P 即可另存為 PDF。若想用一鍵列印，請到網址列右側點「允許彈出視窗」後再試一次。",
  );
}

/**
 * 用隱藏 iframe 觸發列印；不會被 popup blocker 擋。
 *
 * 檔名策略（瀏覽器「另存為 PDF」預設檔名來源不一）：
 *   - Chrome / Edge / Firefox：用 iframe 的 contentDocument.title（HTML <title> 已正確設定）
 *   - Safari：用主視窗 document.title
 *   → print() 觸發前暫時改主視窗 title 成不含副檔名的檔名，
 *     對話框關閉後（focus 回主視窗）還原原 title。
 */
function printViaIframe(html: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.title = filename;
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);

    // PDF 預設檔名 = title（去掉 .pdf 副檔名，瀏覽器自動補）
    const printTitle = filename.replace(/\.(pdf|html?)$/i, "");
    const originalTitle = document.title;

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      // 還原主視窗 title
      document.title = originalTitle;
      // 延遲移除 iframe：Safari 若在 print 對話框期間移除會中斷列印
      setTimeout(() => {
        try { iframe.remove(); } catch { /* noop */ }
      }, 1000);
    };

    const onLoad = () => {
      try {
        const cw = iframe.contentWindow;
        const cd = iframe.contentDocument;
        if (!cw || !cd) throw new Error("iframe contentWindow missing");

        // 雙保險：iframe 內部 title + 主視窗 title 都對齊預期檔名
        try { cd.title = printTitle; } catch { /* noop */ }
        document.title = printTitle;

        setTimeout(() => {
          try {
            cw.focus();
            cw.print();
            // 列印對話框關閉時 focus 會回到主視窗 → 收尾還原 title
            const finish = () => {
              window.removeEventListener("focus", finish);
              cleanup();
              resolve();
            };
            window.addEventListener("focus", finish);
            setTimeout(finish, 8000); // 安全網
          } catch (printErr) {
            cleanup();
            reject(printErr);
          }
        }, 250);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    iframe.addEventListener("load", onLoad, { once: true });
    iframe.addEventListener(
      "error",
      () => {
        cleanup();
        reject(new Error("iframe load error"));
      },
      { once: true },
    );

    iframe.srcdoc = html;
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 對外分享連結：直接序列化整張卡
 */
export function buildShareableJson(card: PainCard): string {
  return JSON.stringify(card, null, 2);
}

export function downloadBlob(filename: string, mime: string, content: string | Blob) {
  let blob: Blob;
  if (typeof content === "string") {
    // 確保 mime 帶 charset=utf-8，避免 Windows / 部分編輯器以系統預設編碼開啟造成中文亂碼
    const mimeWithCharset = /charset=/i.test(mime) ? mime : `${mime};charset=utf-8`;
    // 加上 UTF-8 BOM：讓 Windows 記事本 / Excel / 舊版工具能正確辨識為 UTF-8
    // 純文字格式（md / json / txt / csv / html）才加 BOM；二進位格式不要動
    const isText = /^(text\/|application\/(json|xml|javascript|ld\+json))/i.test(mime);
    const parts: BlobPart[] = isText ? ["\uFEFF", content] : [content];
    blob = new Blob(parts, { type: mimeWithCharset });
  } else {
    blob = content;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * PDF 匯出 — 使用 jsPDF 文字版（A4，繁中字體 fallback）
 * 為避免大量字型載入，採用 jsPDF 內建字型 + UTF-8 文字繪製
 */
export async function exportPdf(card: PainCard): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const md = buildMarkdown(card);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const lineHeight = 14;
  const maxWidth = pageWidth - margin * 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  // jsPDF 預設字型不支援繁中，用 splitTextToSize 處理換行；
  // 中文字會呈現為方塊；建議使用者用 Markdown / JSON 取得最佳結果。
  const lines = doc.splitTextToSize(md, maxWidth) as string[];
  let y = margin;
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save(exportFilename(card, "pdf"));
}
