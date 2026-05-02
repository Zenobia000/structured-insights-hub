/**
 * Card 1 表單欄位元件 — Text / Textarea。
 *
 * 規範：
 * - label H3、helper Body SM
 * - focus ring Teal、warning 邊框 Caution Amber（不用紅色）
 * - error（minLength 等系統錯誤）才用 destructive
 * - 自動儲存：每次 onChange 直接寫 store（store 內部已寫 LocalStorage）
 */
import { type ChangeEvent, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type CommonProps = {
  id: string;
  label: string;
  helper: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  /** 已輸入但違反 anti-fake 規則 — 黃色提示，不擋輸入 */
  warning?: ReactNode;
  /** 系統錯誤（minLength 不足等）— 紅色提示，僅在使用者嘗試送出後顯示 */
  error?: ReactNode;
  /** highlight：父層要求高亮（例如 exit gate 失敗時） */
  highlight?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

function fieldClasses(opts: { warning?: boolean; error?: boolean; highlight?: boolean }) {
  return cn(
    "w-full rounded-md border bg-surface px-3.5 py-2.5 text-[15px] leading-[1.55] text-text-primary",
    "placeholder:text-text-muted",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-secondary",
    "transition-colors",
    !opts.warning && !opts.error && !opts.highlight && "border-border",
    opts.highlight && !opts.error && !opts.warning && "border-secondary ring-2 ring-secondary/30",
    opts.warning && !opts.error && "border-caution",
    opts.error && "border-destructive",
  );
}

export function TextField(props: CommonProps) {
  const {
    id,
    label,
    helper,
    value,
    placeholder,
    required,
    warning,
    error,
    highlight,
    onChange,
    onBlur,
  } = props;
  const describedBy = `${id}-helper${warning ? ` ${id}-warning` : ""}${error ? ` ${id}-error` : ""}`;
  return (
    <div className="space-y-1.5">
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
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onBlur={onBlur}
        className={fieldClasses({ warning: !!warning, error: !!error, highlight })}
      />
      {warning && (
        <p
          id={`${id}-warning`}
          role="status"
          className="flex items-start gap-1.5 text-[13px] text-caution leading-[1.5]"
        >
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
          <span>{warning}</span>
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[13px] text-destructive leading-[1.5]">
          {error}
        </p>
      )}
    </div>
  );
}

type TextareaProps = CommonProps & {
  rows?: number;
  maxLength?: number;
};

export function TextareaField(props: TextareaProps) {
  const {
    id,
    label,
    helper,
    value,
    placeholder,
    rows = 4,
    maxLength,
    required,
    warning,
    error,
    highlight,
    onChange,
    onBlur,
  } = props;
  const describedBy = `${id}-helper${warning ? ` ${id}-warning` : ""}${error ? ` ${id}-error` : ""}`;
  return (
    <div className="space-y-1.5">
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
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          fieldClasses({ warning: !!warning, error: !!error, highlight }),
          "resize-y min-h-[6rem]",
        )}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          {warning && (
            <p
              id={`${id}-warning`}
              role="status"
              className="flex items-start gap-1.5 text-[13px] text-caution leading-[1.5]"
            >
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
              <span>{warning}</span>
            </p>
          )}
          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              className="text-[13px] text-destructive leading-[1.5]"
            >
              {error}
            </p>
          )}
        </div>
        {maxLength && (
          <span className="text-[11px] text-text-muted shrink-0 tabular-nums">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
