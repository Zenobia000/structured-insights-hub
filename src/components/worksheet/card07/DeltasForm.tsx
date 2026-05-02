import { Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DELTA_FIELDS, DELTA_MIN, type DeltaKey } from "@/lib/cardSevenValidators";

type Props = {
  values: Record<DeltaKey, string>;
  filled: Record<DeltaKey, boolean>;
  onChange: (key: DeltaKey, value: string) => void;
};

export function DeltasForm({ values, filled, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[18px] font-semibold text-text-primary">
          3 個差異對照（卡 7 核心）
        </h3>
        <p className="text-[13px] text-text-secondary leading-[1.55] mt-0.5">
          不是看 AI 對不對，是看 AI 補了什麼、漏了什麼。
        </p>
      </div>
      {DELTA_FIELDS.map((f) => {
        const value = values[f.key] ?? "";
        const isFilled = filled[f.key];
        return (
          <div key={f.key} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`delta-${f.key}`}
                className="text-[14.5px] font-semibold text-text-primary"
              >
                {f.label}
              </label>
              {isFilled && (
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-verified">
                  <Check className="h-3 w-3" /> 已寫
                </span>
              )}
            </div>
            <p className="text-[12.5px] text-text-secondary leading-[1.55]">
              {f.hint}
            </p>
            <Textarea
              id={`delta-${f.key}`}
              value={value}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={`至少 ${DELTA_MIN} 字`}
              className="min-h-[80px]"
            />
            <p className="text-[11.5px] text-text-muted">
              {value.trim().length} 字（最少 {DELTA_MIN}）
            </p>
          </div>
        );
      })}
    </div>
  );
}
