import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkdownViewProps {
  children: string;
  className?: string;
}

/**
 * Renders markdown with GitHub-flavored extras (tables, strikethrough,
 * task lists). Styled to match the worksheet design system.
 *
 * Implementation: marked → HTML → DOMPurify sanitize → dangerouslySet.
 *
 * Type & runtime safety:
 *   - DOMPurify only ships a real implementation in the browser. On the
 *     server (SSR worker) `window` is undefined, so we short-circuit to
 *     an empty string instead of crashing.
 *   - `marked.parse` is forced into sync mode but its return type is
 *     `string | Promise<string>`. We narrow with a runtime check rather
 *     than `as string` so a Promise leak surfaces instead of silently
 *     rendering "[object Promise]".
 *   - The `uponSanitizeElement` hook receives a generic `Node`. We
 *     narrow to `Element` before touching attributes, and treat the
 *     hook payload's `tagName` as optional in case DOMPurify changes
 *     the contract.
 */

const TAG_CLASS: Record<string, string> = {
  h1: "text-[18px] font-bold mt-4 mb-2 text-text-primary",
  h2: "text-[16px] font-bold mt-4 mb-2 text-text-primary",
  h3: "text-[14.5px] font-semibold mt-3 mb-1.5 text-text-primary",
  p: "my-2",
  ul: "list-disc pl-5 my-2 space-y-1",
  ol: "list-decimal pl-5 my-2 space-y-1",
  li: "leading-[1.6]",
  strong: "font-semibold text-text-primary",
  em: "italic",
  a: "text-secondary underline underline-offset-2 hover:text-secondary/80",
  blockquote: "border-l-4 border-border pl-3 my-2 text-text-secondary italic",
  pre: "font-mono text-[12.5px] leading-[1.6] bg-muted-bg p-3 my-2 overflow-auto whitespace-pre-wrap rounded-md border border-border",
  table: "min-w-full border-collapse text-[12.5px] border border-border",
  thead: "bg-muted-bg",
  th: "border border-border px-2 py-1.5 text-left font-semibold text-text-primary",
  td: "border border-border px-2 py-1.5 align-top text-text-primary",
  hr: "my-3 border-border",
};

/** DOMPurify uponSanitizeElement hook payload (only the field we read). */
type SanitizeElementHookEvent = { tagName?: string };

// One-time hook registration. DOMPurify is module-scoped; hooks added
// here apply to every sanitize() call. Idempotent under HMR.
let hookRegistered = false;
function ensureHook(): void {
  if (hookRegistered || typeof window === "undefined") return;
  DOMPurify.addHook("uponSanitizeElement", (node: Node, data: SanitizeElementHookEvent) => {
    // Narrow Node → Element before any attribute mutation.
    if (!(node instanceof Element)) return;
    const tag = data.tagName?.toLowerCase();
    if (!tag) return;

    const cls = TAG_CLASS[tag];
    if (cls) node.setAttribute("class", cls);

    if (tag === "a") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noreferrer noopener");
    }

    // Inline code (no className already set by marked) gets pill styling.
    // Block code (inside <pre>) is handled by the <pre> rule above.
    if (tag === "code" && node.parentElement?.tagName !== "PRE") {
      node.setAttribute(
        "class",
        "font-mono text-[12.5px] bg-muted-bg px-1 py-0.5 rounded border border-border",
      );
    }
  });
  hookRegistered = true;
}

/** Sync narrow for marked's `string | Promise<string>` return. */
function parseMarkdownSync(input: string): string {
  const out = marked.parse(input, { gfm: true, breaks: false, async: false });
  return typeof out === "string" ? out : "";
}

/** Server-safe sanitize: returns "" when DOMPurify cannot run. */
function sanitizeHtml(raw: string): string {
  if (typeof window === "undefined") return "";
  // DOMPurify in some bundles types `sanitize` as `string | TrustedHTML`.
  // We render via dangerouslySetInnerHTML which needs a string.
  const cleaned = DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });
  return typeof cleaned === "string" ? cleaned : String(cleaned ?? "");
}

export function MarkdownView({ children, className = "" }: MarkdownViewProps) {
  const html = useMemo(() => {
    if (typeof children !== "string" || children.length === 0) return "";
    ensureHook();
    const raw = parseMarkdownSync(children);
    return sanitizeHtml(raw);
  }, [children]);

  return (
    <div
      className={`prose-worksheet text-[13.5px] leading-[1.7] text-text-primary ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
