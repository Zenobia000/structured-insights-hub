import { Check, ChevronDown, Sparkles, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  CONTACT_MIN,
  PERSONA_MIN,
  PLANNED_MIN,
  TARGETS_MAX,
  TARGETS_MIN,
} from "@/lib/cardEightValidators";
import { TARGET_TEMPLATES, type TargetTemplate } from "./TargetTemplates";

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
  onAddFromTemplate?: (template: TargetTemplate) => void;
  onRemove: (index: number) => void;
};

export function TargetsForm({
  targets,
  highlightIndex,
  onUpdate,
  onAdd,
  onAddFromTemplate,
  onRemove,
}: Props) {
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
                  aria-describedby={`contact-${i}-counter`}
                  className={cn(
                    "min-h-[56px] transition-all",
                    isHl && !contactOk &&
                      "border-secondary ring-2 ring-secondary/40 bg-secondary/5 animate-pulse",
                  )}
                />
                {(() => {
                  const len = t.contact_info.trim().length;
                  const remaining = Math.max(0, CONTACT_MIN - len);
                  return (
                    <div
                      id={`contact-${i}-counter`}
                      aria-live="polite"
                      className={cn(
                        "text-[11.5px] tabular-nums flex items-center gap-1.5",
                        contactOk ? "text-verified" : "text-text-muted",
                      )}
                    >
                      {contactOk ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>已達 {CONTACT_MIN} 字 ✓ 可勾選</span>
                          <span className="text-text-muted">（目前 {len} 字）</span>
                        </>
                      ) : (
                        <>
                          <span>
                            還差 <span className="font-semibold text-secondary">{remaining}</span> 字可通過
                          </span>
                          <span className="text-text-muted">
                            （{len} / {CONTACT_MIN}）
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}
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
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onAdd}
            className="text-secondary hover:text-secondary/80"
          >
            + 加第 {targets.length + 1} 位（最多 {TARGETS_MAX}）
          </Button>

          {onAddFromTemplate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-secondary/40 bg-secondary/5 text-secondary hover:bg-secondary/10 hover:text-secondary"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  從範本快速新增
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px]">
                <DropdownMenuLabel className="text-[12px] text-text-secondary font-normal">
                  選一個情境,自動填好欄位骨架(再改成你的真實資料)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TARGET_TEMPLATES.map((tpl) => (
                  <DropdownMenuItem
                    key={tpl.id}
                    onSelect={() => onAddFromTemplate(tpl)}
                    className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
                  >
                    <span className="text-[13px] font-medium text-text-primary">
                      {tpl.label}
                    </span>
                    <span className="text-[11.5px] text-text-secondary leading-snug">
                      {tpl.description}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
}
