/**
 * SectionShell — 統一的 Grok-style 區段容器
 *
 * 處理：
 * - 垂直 section padding (sm/md/lg/xl)
 * - 水平 container padding (mobile/tablet/desktop)
 * - max-width 控制 (default 1280 / narrow 768 / wide 1440)
 * - 可選背景效果 (dot grid / spotlight)
 * - hairline divider (top/bottom/both)
 *
 * Usage:
 *   <SectionShell padding="lg" maxWidth="default" bg="dot-dim">
 *     <Eyebrow>...</Eyebrow>
 *     <h2>...</h2>
 *   </SectionShell>
 */
import { cn } from "@/lib/utils";
import type { ElementType, ReactNode, Ref } from "react";

type SectionPadding = "none" | "sm" | "md" | "lg" | "xl";
type SectionMaxWidth = "narrow" | "default" | "wide" | "full";
type SectionBg =
  | "none"
  | "base"
  | "raised"
  | "sunken"
  | "dot-dim"
  | "dot-default"
  | "dot-dense"
  | "spotlight-top"
  | "spotlight-center"
  | "spotlight-dual";
type SectionDivider = "none" | "top" | "bottom" | "both";

type SectionShellProps = {
  as?: ElementType;
  children: ReactNode;
  padding?: SectionPadding;
  maxWidth?: SectionMaxWidth;
  bg?: SectionBg;
  divider?: SectionDivider;
  className?: string;
  innerClassName?: string;
  id?: string;
  ariaLabelledBy?: string;
  ref?: Ref<HTMLElement>;
};

const paddingMap: Record<SectionPadding, string> = {
  none: "py-0",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
};

const maxWidthMap: Record<SectionMaxWidth, string> = {
  narrow: "max-w-3xl", // 768px
  default: "max-w-7xl", // 1280px
  wide: "max-w-[1440px]",
  full: "max-w-none",
};

const bgMap: Record<SectionBg, string> = {
  none: "",
  base: "bg-canvas-base",
  raised: "bg-canvas-raised",
  sunken: "bg-canvas-sunken",
  "dot-dim": "bg-canvas-base bg-dot-dim",
  "dot-default": "bg-canvas-base bg-dot-default",
  "dot-dense": "bg-canvas-base bg-dot-dense",
  "spotlight-top": "bg-canvas-base bg-spotlight-top",
  "spotlight-center": "bg-canvas-base bg-spotlight-center",
  "spotlight-dual": "bg-canvas-base bg-spotlight-dual",
};

const dividerMap: Record<SectionDivider, string> = {
  none: "",
  top: "border-t border-border-hairline",
  bottom: "border-b border-border-hairline",
  both: "border-y border-border-hairline",
};

export function SectionShell({
  as: Tag = "section",
  children,
  padding = "lg",
  maxWidth = "default",
  bg = "none",
  divider = "none",
  className,
  innerClassName,
  id,
  ariaLabelledBy,
  ref,
}: SectionShellProps) {
  return (
    <Tag
      id={id}
      ref={ref as Ref<HTMLElement>}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "relative w-full",
        bgMap[bg],
        dividerMap[divider],
        paddingMap[padding],
        className,
      )}
    >
      <div
        className={cn(
          "relative mx-auto w-full px-5 sm:px-8 lg:px-12",
          maxWidthMap[maxWidth],
          innerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
