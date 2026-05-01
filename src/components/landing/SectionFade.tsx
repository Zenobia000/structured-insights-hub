/**
 * SectionFade — 共用包裝：fade-in on scroll + 一致內距。
 */
import type { ElementType, ReactNode } from "react";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** 是否首屏；首屏 section 不做進場動畫，避免 hero 閃爍 */
  eager?: boolean;
  id?: string;
  ariaLabelledBy?: string;
};

export function SectionFade({
  as: Tag = "section",
  children,
  className,
  eager = false,
  id,
  ariaLabelledBy,
}: Props) {
  const { ref, visible } = useFadeInOnScroll<HTMLElement>();
  const show = eager || visible;
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        "transition-all duration-500 ease-out will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
