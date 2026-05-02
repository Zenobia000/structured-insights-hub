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
 * Why not react-markdown:
 *   - react-markdown + remark-gfm + micromark add ~30 KB gz to the chunk
 *     that imports them (Card 7 today). marked alone is ~12 KB gz and
 *     we already ship it for PDF export.
 *   - DOMPurify is already in deps (jsPDF transitive), zero net cost.
 *
 * Tailwind classes are injected post-parse via a tiny element-class map
 * applied during DOMPurify's `uponSanitizeElement` hook. This keeps the
 * styling collocated and avoids a global `prose` stylesheet.
 *
 * Safety: external sources of markdown (AI completions, user paste)
 * pass through DOMPurify with the default safe profile. We only allow
 * a small whitelist of tags.
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

// One-time hook registration. DOMPurify is module-scoped; hooks added
// here apply to every sanitize() call. Idempotent under HMR.
let hookRegistered = false;
function ensureHook() {
  if (hookRegistered || typeof window === "undefined") return;
  DOMPurify.addHook("uponSanitizeElement", (node: Node, data: { tagName: string }) => {
    if (!(node instanceof Element)) return;
    const tag = data.tagName;
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

export function MarkdownView({ children, className = "" }: MarkdownViewProps) {
  const html = useMemo(() => {
    ensureHook();
    const raw = marked.parse(children, { gfm: true, breaks: false, async: false }) as string;
    return DOMPurify.sanitize(raw, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target", "rel"],
    });
  }, [children]);

  return (
    <div
      className={`prose-worksheet text-[13.5px] leading-[1.7] text-text-primary ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
