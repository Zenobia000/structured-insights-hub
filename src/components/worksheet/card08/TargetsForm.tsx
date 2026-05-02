import { Check, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  CONTACT_MIN,
  PERSONA_MIN,
  PLANNED_MIN,
  TARGETS_MAX,
  TARGETS_MIN,
} from "@/lib/cardEightValidators";

export type TargetItem = {
  persona: string;
  contact_known: boolean;
  contact_info: string;
  planned_time: string;
};

type Props = {
  targets: TargetItem[];
  highlightIndex: number | null;
  onUpdate: (index: number, field: keyof TargetItem, value: string | boolean) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function TargetsForm({ targets, highlightIndex, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {targets.map((t, i) => {
          const personaOk = t.persona.trim().length >= PERSONA_MIN;
          const contactOk = t.contact_info.trim().length >= CONTACT_MIN;
          const plannedOk = t.planned_time.trim().length >= PLANNED_MIN;
          const isHl = highlightIndex === i;
          return (
            <div
              key={i}
              className={cn(
                "rounded-lg border bg-surface p-4 sm:p-5 space-y-4 transition-colors",
                isHl ? "border-secondary ring-2 ring-secondary/30" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-text-primary">訪談對象 {i + 1}</h3>
                {targets.length > TARGETS_MIN && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(i)}
                    className="h-7 text-text-muted hover:text-text-primary"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> 移除
                  </Button>
                )}
              </div>

              {/* persona */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`persona-${i}`}
                    className="text-[13.5px] font-semibold text-text-primary"
                  >
                    Persona
                  </label>
                  {personaOk && (
                    <span className="text-[11.5px] text-verified inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> 已寫
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-text-secondary">
                  具體職業 + 場景，例：「中小型補習班 30-50 歲數學老師」
                </p>
                <Textarea
                  id={`persona-${i}`}
                  value={t.persona}
                  onChange={(e) => onUpdate(i, "persona", e.target.value)}
                  placeholder="具體職業 / 角色 / 場景"
                  className="min-h-[64px]"
                />
              </div>

              {/* contact_known */}
              <div className="space-y-1.5">
                <span className="text-[13.5px] font-semibold text-text-primary block">
                  你認識他嗎？
                </span>
                <RadioGroup
                  value={t.contact_known ? "yes" : "no"}
                  onValueChange={(v) => onUpdate(i, "contact_known", v === "yes")}
                  className="flex gap-4"
                >
                  <label className="flex items-center gap-2 text-[13.5px] cursor-pointer">
                    <RadioGroupItem value="yes" id={`know-yes-${i}`} />
                    <span>✓ 認識</span>
                  </label>
                  <label className="flex items-center gap-2 text-[13.5px] cursor-pointer">
                    <RadioGroupItem value="no" id={`know-no-${i}`} />
                    <span>我還不認識</span>
                  </label>
                </RadioGroup>
              </div>

              {/* contact_info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`contact-${i}`}
                    className="text-[13.5px] font-semibold text-text-primary"
                  >
                    {t.contact_known
                      ? "聯絡方式（LINE / 電話 / 名字）"
                      : "你打算去哪找他？（社群 / 場合）"}
                  </label>
                  {contactOk && (
                    <span className="text-[11.5px] text-verified inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> 可聯絡
                    </span>
                  )}
                </div>
                <Textarea
                  id={`contact-${i}`}
                  value={t.contact_info}
                  onChange={(e) => onUpdate(i, "contact_info", e.target.value)}
                  placeholder={
                    t.contact_known
                      ? "例:林老師 / LINE: xxx / 0912-..."
                      : "例:去家長社團 PO 文找 3 位家長"
                  }
                  className={cn(
                    "min-h-[56px] transition-all",
                    isHl && !contactOk &&
                      "border-secondary ring-2 ring-secondary/40 bg-secondary/5 animate-pulse",
                  )}
                />
              </div>

              {/* planned_time */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`planned-${i}`}
                    className="text-[13.5px] font-semibold text-text-primary"
                  >
                    預計時間
                  </label>
                  {plannedOk && (
                    <span className="text-[11.5px] text-verified inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> 已寫
                    </span>
                  )}
                </div>
                <Input
                  id={`planned-${i}`}
                  value={t.planned_time}
                  onChange={(e) => onUpdate(i, "planned_time", e.target.value)}
                  placeholder="2026-05-10 19:00 或「下次他來補習班時」"
                />
              </div>
            </div>
          );
        })}
      </div>

      {targets.length < TARGETS_MAX && (
        <Button
          type="button"
          variant="ghost"
          onClick={onAdd}
          className="text-secondary hover:text-secondary/80"
        >
          + 加第 {targets.length + 1} 位（最多 {TARGETS_MAX}）
        </Button>
      )}
    </div>
  );
}
