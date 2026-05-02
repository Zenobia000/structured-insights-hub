/**
 * PersonGroupRepeater — 卡 2 的 3 組人物輸入區。
 *
 * - 固定 3 組，不可增刪
 * - Mobile: accordion（預設展開第 1 組）
 * - Desktop: 全部展開垂直排列
 */
import { useState } from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";

import { TextField } from "@/components/worksheet/card01/FormFields";
import { hasContactableKeyword, isForbiddenPersonName, type Person } from "@/lib/cardTwoValidators";
import { cn } from "@/lib/utils";

type Props = {
  people: Person[]; // 必為 3 筆
  attempted: boolean;
  onChange: (index: number, field: keyof Person, value: string) => void;
};

export function PersonGroupRepeater({ people, attempted, onChange }: Props) {
  return (
    <div className="space-y-4">
      {people.map((p, i) => (
        <PersonGroup
          key={i}
          index={i}
          person={p}
          attempted={attempted}
          defaultOpen={i === 0}
          onChange={(field, value) => onChange(i, field, value)}
        />
      ))}
    </div>
  );
}

function PersonGroup({
  index,
  person,
  attempted,
  defaultOpen,
  onChange,
}: {
  index: number;
  person: Person;
  attempted: boolean;
  defaultOpen: boolean;
  onChange: (field: keyof Person, value: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const idBase = `person-${index + 1}`;

  const nameWarning =
    person.name && isForbiddenPersonName(person.name)
      ? "「老師 A」這種代稱代表你還不認識這個人。請填具體姓名（可化名但要是真人）。"
      : null;

  const contactHint =
    person.contact && !hasContactableKeyword(person.contact)
      ? "看起來不是你今天就能傳訊息的方式。寫 LINE / 電話 / Email / Messenger 等。"
      : null;

  const filledCount = [person.name, person.contact, person.relation].filter(
    (v) => v.trim().length > 0,
  ).length;

  return (
    <section
      aria-labelledby={`${idBase}-title`}
      className={cn(
        "rounded-lg border bg-surface overflow-hidden transition-colors",
        nameWarning ? "border-caution" : "border-border",
      )}
    >
      {/* Header — Mobile clickable / Desktop static */}
      <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${idBase}-body`}
          className="flex-1 flex items-center justify-between gap-2 text-left md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <span id={`${idBase}-title`} className="text-[16px] font-semibold text-text-primary">
            {`第 ${index + 1} 位`}
            {person.name && (
              <span className="ml-2 text-[13px] font-normal text-text-secondary">
                · {person.name}
              </span>
            )}
          </span>
          <span className="md:hidden flex items-center gap-2">
            <span className="text-[12px] text-text-muted tabular-nums">{filledCount}/3</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-text-secondary transition-transform",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>
      </header>

      <div
        id={`${idBase}-body`}
        className={cn("px-4 sm:px-5 py-4 space-y-5", !open && "hidden md:block")}
      >
        <TextField
          id={`${idBase}-name`}
          label={`${index + 1}. 姓名`}
          helper="真名（可化名但要是你認識的具體一個人）"
          placeholder="林老師"
          value={person.name}
          onChange={(v) => onChange("name", v)}
          required
          warning={nameWarning}
          highlight={attempted && (!person.name.trim() || !!nameWarning)}
        />
        <TextField
          id={`${idBase}-contact`}
          label="聯絡方式"
          helper="LINE / 電話 / Email / Messenger 等 — 你今天就能傳訊息的方式"
          placeholder="LINE"
          value={person.contact}
          onChange={(v) => onChange("contact", v)}
          required
          warning={
            contactHint && (
              <span className="inline-flex items-start gap-1">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
                {contactHint}
              </span>
            )
          }
          highlight={attempted && !person.contact.trim()}
        />
        <TextField
          id={`${idBase}-relation`}
          label="你跟他的關係"
          helper="影響你能不能找他第二次"
          placeholder="我表妹的數學老師"
          value={person.relation}
          onChange={(v) => onChange("relation", v)}
          required
          highlight={attempted && !person.relation.trim()}
        />
      </div>
    </section>
  );
}
