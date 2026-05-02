import { Checkbox } from "@/components/ui/checkbox";
import { CHECKPOINT_FIELDS, type CheckpointKey } from "@/lib/cardSevenValidators";

type Props = {
  values: Record<CheckpointKey, boolean>;
  onChange: (key: CheckpointKey, value: boolean) => void;
};

export function CheckpointList({ values, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-[18px] font-semibold text-text-primary">
        4 個 AI checkpoint（自己判斷 AI 回覆品質）
      </h3>
      <p className="text-[13px] text-text-secondary leading-[1.55]">
        不會自動評估。讓你練習自己判斷 AI 給的東西夠不夠具體。
      </p>
      <ul className="space-y-2">
        {CHECKPOINT_FIELDS.map((f) => {
          const checked = !!values[f.key];
          return (
            <li
              key={f.key}
              className="rounded-md border border-border bg-surface p-3 flex items-start gap-3"
            >
              <Checkbox
                id={`cp-${f.key}`}
                checked={checked}
                onCheckedChange={(v) => onChange(f.key, v === true)}
                className="mt-0.5"
              />
              <label
                htmlFor={`cp-${f.key}`}
                className="cursor-pointer flex-1 space-y-0.5"
              >
                <p className="text-[14.5px] font-semibold text-text-primary">
                  {f.question}
                </p>
                <p className="text-[12.5px] text-text-secondary leading-[1.55]">
                  通過條件：{f.criterion}
                </p>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
