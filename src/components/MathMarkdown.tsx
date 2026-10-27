import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface Props {
  children: string;
  display?: boolean;
  inlineMath?: boolean;
  inline?: boolean;
  className?: string;
}

/** Authored Markdown only; never infer mathematical syntax from ordinary text. */
function MathMarkdown({
  children,
  display = false,
  inlineMath = false,
  inline = false,
  className = "",
}: Props) {
  const source = display
    ? `$$\n${children}\n$$`
    : inlineMath
      ? `$${children}$`
      : children;
  const isInline = inline || inlineMath;
  const Container = isInline ? "span" : "div";
  return (
    <Container
      className={`math-markdown ${display ? "math-display" : inlineMath ? "math-inline" : isInline ? "math-prose-inline" : "math-prose"} ${className}`}
    >
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkMath]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              strict: "error",
              trust: false,
              throwOnError: false,
              output: "htmlAndMathml",
            },
          ],
        ]}
        components={{
          ...(isInline ? { p: ({ children }) => <span>{children}</span> } : {}),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer noopener">
              {children}
            </a>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </Container>
  );
}
export default memo(MathMarkdown);
