/**
 * Card 1 表單欄位元件 — Text / Textarea (Grok dark theme)。
 *
 * 規範：
 * - label heading.sm (16px semibold)、helper body.sm (13px text-tertiary)
 * - focus glow.focus (electric ring)、warning border-status-warning
 * - error 才用 border-status-danger
 * - 自動儲存：每次 onChange 直接寫 store
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
  warning?: ReactNode;
  error?: ReactNode;
  highlight?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

function fieldClasses(opts: { warning?: boolean; error?: boolean; highlight?: boolean }) {
  return cn(
    "w-full rounded-md border bg-canvas-raised px-3.5 text-[15px] leading-[1.55] text-text-primary",
    "placeholder:text-text-tertiary",
    "transition-all duration-200",
    "focus:outline-none focus:border-accent-electric focus:shadow-[0_0_0_2px_rgba(91,141,239,0.25)]",
    !opts.warning && !opts.error && !opts.highlight && "border-border-default hover:border-border-strong",
    opts.highlight && !opts.error && !opts.warning && "border-accent-electric shadow-[0_0_0_2px_rgba(91,141,239,0.20)]",
    opts.warning && !opts.error && "border-status-warning",
    opts.error && "border-status-danger shadow-[0_0_0_2px_rgba(248,113,113,0.20)]",
  );
}

function FieldLabel({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label
      htmlFor={id}
      className="block text-[15px] font-semibold tracking-[-0.01em] text-text-primary leading-[1.4]"
    >
      {label}
      {required && (
        <span aria-hidden className="text-accent-electric ml-1">
          *
        </span>
      )}
    </label>
  );
}

export function TextField(props: CommonProps) {
  const {
    id, label, helper, value, placeholder, required,
    warning, error, highlight, onChange, onBlur,
  } = props;
  const describedBy = `${id}-helper${warning ? ` ${id}-warning` : ""}${error ? ` ${id}-error` : ""}`;
  return (
    <div className="space-y-2">
      <FieldLabel id={id} label={label} required={required} />
      <p id={`${id}-helper`} className="text-[13px] leading-[1.55] text-text-tertiary">
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
        className={cn(fieldClasses({ warning: !!warning, error: !!error, highlight }), "h-11")}
      />
      {warning && (
        <p
          id={`${id}-warning`}
          role="status"
          className="flex items-start gap-1.5 text-[12.5px] text-status-warning leading-[1.55]"
        >
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
          <span>{warning}</span>
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[12.5px] text-status-danger leading-[1.55]"
        >
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
    id, label, helper, value, placeholder, rows = 4, maxLength, required,
    warning, error, highlight, onChange, onBlur,
  } = props;
  const describedBy = `${id}-helper${warning ? ` ${id}-warning` : ""}${error ? ` ${id}-error` : ""}`;
  return (
    <div className="space-y-2">
      <FieldLabel id={id} label={label} required={required} />
      <p id={`${id}-helper`} className="text-[13px] leading-[1.55] text-text-tertiary">
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
          "py-3 resize-y min-h-[6rem]",
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {warning && (
            <p
              id={`${id}-warning`}
              role="status"
              className="flex items-start gap-1.5 text-[12.5px] text-status-warning leading-[1.55]"
            >
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
              <span>{warning}</span>
            </p>
          )}
          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              className="text-[12.5px] text-status-danger leading-[1.55]"
            >
              {error}
            </p>
          )}
        </div>
        {maxLength && (
          <span className="font-mono text-[11px] text-text-tertiary shrink-0 tabular-nums">
            {value.length}<span className="text-text-tertiary/50"> / {maxLength}</span>
          </span>
        )}
      </div>
    </div>
  );
}
