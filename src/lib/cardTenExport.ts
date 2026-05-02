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
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC",
      "Microsoft JhengHei", "Heiti TC", "Segoe UI", Roboto, sans-serif;
    color: #111;
    font-size: 12pt;
    line-height: 1.7;
  }
  header {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  header h1 { font-size: 18pt; margin: 0 0 6px; }
  header .meta { font-size: 10pt; color: #666; }
  h1, h2, h3, h4 { line-height: 1.35; margin-top: 1.4em; margin-bottom: 0.5em; }
  h1 { font-size: 16pt; }
  h2 { font-size: 14pt; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  h3 { font-size: 12.5pt; }
  p { margin: 0.6em 0; }
  ul, ol { padding-left: 1.6em; margin: 0.6em 0; }
  li { margin: 0.25em 0; }
  blockquote {
    border-left: 3px solid #ccc;
    color: #444;
    margin: 0.8em 0;
    padding: 0.2em 0.9em;
    background: #fafafa;
  }
  code { font-family: "SFMono-Regular", Menlo, Consolas, monospace; font-size: 10.5pt; background: #f3f3f3; padding: 1px 4px; border-radius: 3px; }
  pre { background: #f6f6f6; padding: 10px; border-radius: 4px; overflow: auto; font-size: 10.5pt; }
  table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 11pt; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f3f3f3; }
  hr { border: none; border-top: 1px solid #ddd; margin: 1.5em 0; }
  footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; font-size: 9.5pt; color: #888; }
  @media print {
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
  <header>
    <h1>訪談大綱</h1>
    <div class="meta">受訪者：${escapeHtml(persona)} · 產生日期：${escapeHtml(created)}</div>
  </header>
  <main>${bodyHtml}</main>
  <footer>
    此訪綱由 PainMap Worksheet 卡 8 三階段虛擬訪談產出，請拿去找真人訪談。AI 模擬不能取代真實對話。
  </footer>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 150);
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
