import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewProps {
  children: string;
  className?: string;
}

/**
 * Renders markdown with GitHub-flavored markdown support (tables, strikethrough, task lists).
 * Styled to match the worksheet design system.
 */
export function MarkdownView({ children, className = "" }: MarkdownViewProps) {
  return (
    <div
      className={`prose-worksheet text-[13.5px] leading-[1.7] text-text-primary ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node: _n, ...props }) => (
            <h1 className="text-[18px] font-bold mt-4 mb-2 text-text-primary" {...props} />
          ),
          h2: ({ node: _n, ...props }) => (
            <h2 className="text-[16px] font-bold mt-4 mb-2 text-text-primary" {...props} />
          ),
          h3: ({ node: _n, ...props }) => (
            <h3 className="text-[14.5px] font-semibold mt-3 mb-1.5 text-text-primary" {...props} />
          ),
          p: ({ node: _n, ...props }) => <p className="my-2" {...props} />,
          ul: ({ node: _n, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
          ),
          ol: ({ node: _n, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
          ),
          li: ({ node: _n, ...props }) => <li className="leading-[1.6]" {...props} />,
          strong: ({ node: _n, ...props }) => (
            <strong className="font-semibold text-text-primary" {...props} />
          ),
          em: ({ node: _n, ...props }) => <em className="italic" {...props} />,
          a: ({ node: _n, ...props }) => (
            <a
              className="text-secondary underline underline-offset-2 hover:text-secondary/80"
              target="_blank"
              rel="noreferrer noopener"
              {...props}
            />
          ),
          blockquote: ({ node: _n, ...props }) => (
            <blockquote
              className="border-l-4 border-border pl-3 my-2 text-text-secondary italic"
              {...props}
            />
          ),
          code: ({ node: _n, className: cn, children: c, ...props }) => {
            const isInline = !cn;
            if (isInline) {
              return (
                <code
                  className="font-mono text-[12.5px] bg-muted-bg px-1 py-0.5 rounded border border-border"
                  {...props}
                >
                  {c}
                </code>
              );
            }
            return (
              <code className={`font-mono text-[12.5px] ${cn ?? ""}`} {...props}>
                {c}
              </code>
            );
          },
          pre: ({ node: _n, ...props }) => (
            <pre
              className="font-mono text-[12.5px] leading-[1.6] bg-muted-bg p-3 my-2 overflow-auto whitespace-pre-wrap rounded-md border border-border"
              {...props}
            />
          ),
          table: ({ node: _n, ...props }) => (
            <div className="my-3 overflow-auto">
              <table
                className="min-w-full border-collapse text-[12.5px] border border-border"
                {...props}
              />
            </div>
          ),
          thead: ({ node: _n, ...props }) => <thead className="bg-muted-bg" {...props} />,
          th: ({ node: _n, ...props }) => (
            <th
              className="border border-border px-2 py-1.5 text-left font-semibold text-text-primary"
              {...props}
            />
          ),
          td: ({ node: _n, ...props }) => (
            <td
              className="border border-border px-2 py-1.5 align-top text-text-primary"
              {...props}
            />
          ),
          hr: ({ node: _n, ...props }) => <hr className="my-3 border-border" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
