/**
 * TagInputField — Enter 鍵新增標籤的輸入欄。
 * 用於卡 4 的 ai_alternatives 與 user_dissatisfactions。
 */
import { useState, type KeyboardEvent } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  helper: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  minCount?: number;
  maxCount?: number;
  warning?: string | null;
  highlight?: boolean;
};

export function TagInputField({
  id,
  label,
  helper,
  placeholder,
  values,
  onChange,
  required,
  minCount,
  maxCount = 20,
  warning,
  highlight,
}: Props) {
  const [draft, setDraft] = useState("");
  const [tagsRef] = useAutoAnimate<HTMLUListElement>({ duration: 180 });

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) {
      setDraft("");
      return;
    }
    if (values.length >= maxCount) return;
    onChange([...values, v]);
    setDraft("");
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const countShort = minCount !== undefined && values.length < minCount;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[18px] font-semibold text-text-primary leading-[1.4]"
      >
        {label}
        {required && (
          <span aria-hidden className="text-text-muted ml-1">
            *
          </span>
        )}
      </label>
      <p id={`${id}-helper`} className="text-[13px] leading-[1.5] text-text-secondary">
        {helper}
      </p>

      <div
        className={cn(
          "rounded-md border bg-surface px-2 py-2 transition-colors",
          highlight && "border-secondary ring-2 ring-secondary/30",
          countShort && !highlight && "border-caution",
          !highlight && !countShort && "border-border",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-secondary",
        )}
      >
        <ul ref={tagsRef} className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <li
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1 rounded-md bg-primary-light text-primary px-2 py-1 text-[13px] font-medium"
            >
              <span className="break-all">{v}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`移除 ${v}`}
                className="inline-flex items-center justify-center h-4 w-4 rounded hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
          <li className="flex-1 min-w-[140px]">
            <input
              id={id}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              onBlur={commit}
              placeholder={values.length === 0 ? placeholder : "繼續新增…（Enter）"}
              aria-describedby={`${id}-helper`}
              className="w-full bg-transparent px-1.5 py-1 text-[14.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between text-[12px]">
        <span className={cn("text-text-muted", countShort && "text-caution font-medium")}>
          {minCount !== undefined ? `${values.length} / 至少 ${minCount}` : `${values.length} 個`}
        </span>
        <span className="text-text-muted">按 Enter 新增</span>
      </div>

      {warning && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-caution/50 bg-caution/5 px-3 py-2 text-[13px] leading-[1.5] text-text-primary"
        >
          <AlertTriangle className="h-4 w-4 text-caution shrink-0 mt-0.5" aria-hidden />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
}
