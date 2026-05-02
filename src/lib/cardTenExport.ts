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
      reason: `資料不完整，請先完成卡 ${card.current_step}`,
    };
  }
  if (!card.verdict.judgment) {
    return { ok: false, redirect: "/learn/worksheet/09", reason: "請先完成真假判斷" };
  }
  if ((card.verdict.reason_100w || "").length < 100) {
    return { ok: false, redirect: "/learn/worksheet/09", reason: "判斷理由需 100 字以上" };
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
  return lines.join("\n");
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
