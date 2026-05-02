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

export function slugify(text: string): string {
  return (
    (text || "")
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "untitled"
  );
}

export function exportFilename(card: PainCard, ext: "md" | "json" | "pdf"): string {
  const slug = slugify(card.complaint.verbatim.slice(0, 20));
  const date = new Date().toISOString().slice(0, 10);
  return `paincard-${slug}-${date}.${ext}`;
}

export function interviewGuideFilename(card: PainCard, ext: "md" | "pdf" = "pdf"): string {
  const slug = slugify(card.complaint.verbatim.slice(0, 20));
  const date = new Date().toISOString().slice(0, 10);
  return `paincard-interview-guide-${slug}-${date}.${ext}`;
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
  /* ---------- Page setup ---------- */
  @page {
    size: A4;
    margin: 20mm 18mm 22mm 18mm;
  }
  @page :first { margin-top: 22mm; }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; }

  /* ---------- Typography base ----------
     Sans 用於正文（中文最佳閱讀）；Serif 給 blockquote 引述塊增加儀式感 */
  :root {
    --ink-900: #0f172a;   /* 主標題 */
    --ink-800: #1e293b;   /* 次標題 */
    --ink-700: #334155;   /* 內文加粗 */
    --ink-600: #475569;   /* 內文 */
    --ink-500: #64748b;   /* 次要說明 */
    --ink-400: #94a3b8;   /* meta / footer */
    --line:    #e2e8f0;   /* 線條 */
    --line-2:  #cbd5e1;   /* 表格線 */
    --tint:    #f8fafc;   /* 表頭 / 引述底 */
    --accent:  #0f766e;   /* 強調色（teal-700, 列印友善）*/
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
  }

  /* ---------- Header ---------- */
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
  }
  main h1 {
    font-size: 16pt;
    margin: 1.6em 0 0.5em;
    padding-bottom: 4px;
    border-bottom: 1.5px solid var(--ink-900);
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

  /* ---------- Paragraphs & inline ---------- */
  main p {
    margin: 0.55em 0;
    orphans: 3;
    widows: 3;
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
  }
  main ol > li::marker {
    color: var(--accent);
    font-weight: 700;
  }
  main li > ul, main li > ol { margin: 0.25em 0; }

  /* ---------- Blockquote (適合引述訪談語錄 / 提示) ---------- */
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
  }
  main pre {
    background: var(--tint);
    border: 1px solid var(--line);
    padding: 10px 12px;
    border-radius: 4px;
    overflow: auto;
    font-size: 9.5pt;
    line-height: 1.55;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  main pre code { border: 0; padding: 0; background: transparent; }

  /* ---------- Tables ---------- */
  main table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    font-size: 10pt;
    page-break-inside: auto;
  }
  main thead { display: table-header-group; }   /* 跨頁時表頭重複 */
  main tfoot { display: table-footer-group; }
  main tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  main th, main td {
    border: 1px solid var(--line-2);
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
    line-height: 1.55;
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

  /* ---------- Misc ---------- */
  main hr {
    border: none;
    border-top: 1px solid var(--line);
    margin: 1.6em 0;
  }
  main a { color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent); }

  /* ---------- Footer ---------- */
  footer.doc-foot {
    margin-top: 32px;
    padding-top: 12px;
    border-top: 1px solid var(--line);
    font-size: 8.5pt;
    color: var(--ink-400);
    line-height: 1.6;
    letter-spacing: 0.02em;
  }

  /* ---------- Print-specific ---------- */
  @media print {
    body { font-size: 10.5pt; }
    a { color: inherit; border-bottom: 0; }
    /* 避免重要區塊被切：已在各元素加 break-inside: avoid */
    /* 確保底色印得出來（Chrome 預設關閉背景圖列印） */
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 200);
    });
  </script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    throw new Error("瀏覽器擋下了新視窗，請允許彈出視窗後再試");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
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
  const blob = typeof content === "string" ? new Blob([content], { type: mime }) : content;
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
