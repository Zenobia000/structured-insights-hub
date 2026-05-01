/**
 * ExampleReferenceCard2 — 摺疊式範例（卡 2 林老師 3 位補教老師）。
 * 直接引用 worksheet 原文。
 */
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PEOPLE = [
  ["1", "林老師", "LINE", "我表妹的數學老師"],
  ["2", "王老師", "FB Messenger", "林老師介紹的同業"],
  ["3", "陳老師", "電話", "我國中同學的爸爸"],
] as const;

export function ExampleReferenceCard2() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-page">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="example-content-card2"
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        <span className="text-[15px] font-semibold text-text-primary">
          📖 看 worksheet 林老師範例
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-secondary transition-transform shrink-0",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div id="example-content-card2" className="px-5 pb-5">
          <blockquote className="border-l-2 border-secondary pl-4 space-y-2 text-[14px] leading-[1.7]">
            <p>
              <span className="font-semibold text-text-primary">大概是什麼背景：</span>
              <span className="text-text-secondary">
                30–50 歲、台灣中小型補習班老師、每週要做家長溝通
              </span>
            </p>
            {PEOPLE.map(([n, name, contact, relation]) => (
              <p key={n} className="text-text-secondary">
                <span className="font-semibold text-text-primary">{n}.</span>{" "}
                {name}｜{contact}｜{relation}
              </p>
            ))}
          </blockquote>
          <p className="mt-3 text-[12.5px] leading-[1.55] text-text-secondary">
            注意：3 個人的關係都很<span className="font-semibold">具體</span>
            （表妹的老師 / 林介紹的同業 / 國中同學的爸爸）— 這代表填寫者真的能找到他們。
          </p>
          <p className="mt-3 text-[12px] text-text-muted">
            來自{" "}
            <code className="font-mono text-text-secondary">
              docs/workshop/painpoint_beginner_worksheet.md
            </code>{" "}
            卡片 2
          </p>
        </div>
      )}
    </div>
  );
}
