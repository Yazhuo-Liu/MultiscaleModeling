import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import katex from "katex";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import MathMarkdown from "../components/MathMarkdown";
import { methods } from "./methods";
import { methodsEn } from "./methods.en";
import { getTheory } from "./theory";

const parser = unified().use(remarkParse).use(remarkMath);
const forbiddenControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

test("KaTeX renderer matches the release providing site CSS and fonts", () => {
  const require = createRequire(import.meta.url);
  const rendererRequire = createRequire(require.resolve("rehype-katex"));
  const markdownKatex = rendererRequire("katex") as { version: string };
  assert.equal(
    markdownKatex.version,
    katex.version,
    "Markdown-rendered math and the katex/dist CSS imported by main.tsx must use the same release",
  );
});

function checkLatex(source: string, location: string, displayMode = false) {
  assert.ok(source.trim(), `${location}: empty formula`);
  assert.doesNotMatch(
    source,
    forbiddenControls,
    `${location}: JavaScript escape corrupted LaTeX`,
  );
  assert.doesNotMatch(
    source,
    /\$/,
    `${location}: formula fields must not include Markdown delimiters`,
  );
  try {
    const html = katex.renderToString(source, {
      displayMode,
      throwOnError: true,
      strict: "error",
      trust: false,
      output: "htmlAndMathml",
    });
    assert.match(html, /<math[\s>]/, `${location}: no accessible MathML`);
  } catch (error) {
    throw new Error(`${location}: ${(error as Error).message}`, {
      cause: error,
    });
  }
}

interface MarkdownNode {
  type: string;
  value?: string;
  children?: MarkdownNode[];
}
function checkMarkdown(source: string, location: string) {
  assert.doesNotMatch(
    source,
    forbiddenControls,
    `${location}: invalid control escape`,
  );
  let count = 0;
  const visit = (node: MarkdownNode) => {
    if (node.type === "inlineMath" || node.type === "math") {
      checkLatex(node.value ?? "", location, node.type === "math");
      count += 1;
    } else if (node.type === "text") {
      assert.ok(
        !node.value?.includes("$"),
        `${location}: unpaired math delimiter in ${node.value}`,
      );
      assert.doesNotMatch(
        node.value ?? "",
        /\\(?:frac|partial|sigma|varepsilon|int|sum|begin)\b/,
        `${location}: TeX command outside math delimiters`,
      );
    }
    node.children?.forEach(visit);
  };
  visit(parser.parse(source) as MarkdownNode);
  return count;
}

// Formula and symbol fields use raw TeX; authored prose uses Markdown. Executable
// Python strings are deliberately excluded and continue to be rendered as code.
function checkContent(value: unknown, path: string, key = ""): number {
  if (key === "code") return 0;
  if (typeof value === "string") {
    if (key === "formula" || key === "symbol") {
      checkLatex(value, path, key === "formula");
      return 1;
    }
    return checkMarkdown(value, path);
  }
  if (Array.isArray(value)) {
    return value.reduce(
      (count, item, i) => count + checkContent(item, `${path}[${i}]`),
      0,
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).reduce(
      (count, [field, item]) =>
        count + checkContent(item, `${path}.${field}`, field),
      0,
    );
  }
  return 0;
}

for (const locale of ["zh", "en"] as const) {
  for (const method of locale === "zh" ? methods : methodsEn) {
    test(`${method.id}/${locale}: all authored mathematics compiles strictly`, () => {
      const lesson = getTheory(method.id, locale);
      const count =
        checkContent(method, `${method.id}/${locale}/method`) +
        checkContent(lesson, `${method.id}/${locale}/theory`);
      assert.ok(
        count >= 20,
        `${method.id}/${locale}: expected substantive rendered mathematics, found ${count}`,
      );
      assert.deepEqual(
        lesson.derivation.stages.map((stage) => stage.level),
        ["simple", "general", "extension"],
      );
      for (const stage of lesson.derivation.stages) {
        assert.ok(
          stage.assumptions.length > 0,
          `${method.id}/${stage.level}: assumptions missing`,
        );
        assert.ok(
          stage.steps.length >= 3,
          `${method.id}/${stage.level}: derivation jumps directly to a result`,
        );
        assert.ok(
          stage.steps.every(
            (step) =>
              step.explanation.trim().length > 15 &&
              step.formula.trim().length > 0,
          ),
        );
        assert.ok(
          stage.conclusion.trim().length > 20,
          `${method.id}/${stage.level}: missing interpretation`,
        );
      }
    });
  }
}

test("Markdown pipeline renders semantic prose, inline math, display math and symbol MathML", () => {
  const prose = renderToStaticMarkup(
    createElement(MathMarkdown, {
      children: String.raw`The **spring** satisfies $\sigma = E\varepsilon$.

- Positive stiffness stores energy.
- The compliance is $E^{-1}$.`,
    }),
  );
  assert.match(prose, /<strong>spring<\/strong>/);
  assert.match(prose, /<ul>/);
  assert.match(prose, /class="katex"/);
  assert.match(prose, /<math[\s>]/);
  assert.doesNotMatch(prose, /class="katex-error"/);
  const display = renderToStaticMarkup(
    createElement(MathMarkdown, {
      display: true,
      children: String.raw`\begin{aligned}\dot{\sigma}+\frac{\sigma}{\tau}&=0\\\sigma(t)&=\sigma_0 e^{-t/\tau}\end{aligned}`,
    }),
  );
  assert.match(display, /katex-display/);
  assert.match(display, /<math[^>]*display="block"/);
  const symbol = renderToStaticMarkup(
    createElement(MathMarkdown, {
      inlineMath: true,
      children: String.raw`\frac{\partial \phi}{\partial t}`,
    }),
  );
  assert.match(symbol, /class="katex"/);
  assert.doesNotMatch(symbol, /katex-display/);
});

test("Math prose does not interpret raw HTML or enable trusted KaTeX HTML commands", () => {
  const html = renderToStaticMarkup(
    createElement(MathMarkdown, {
      children:
        '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\nA safe $x^2$ term.',
    }),
  );
  assert.doesNotMatch(html, /<script|<img|onerror=/);
  assert.match(html, /class="katex"/);
  const command = renderToStaticMarkup(
    createElement(MathMarkdown, {
      inlineMath: true,
      children: String.raw`\htmlClass{injected-trusted-class}{x}`,
    }),
  );
  assert.doesNotMatch(command, /class="injected-trusted-class"/);
  const links = renderToStaticMarkup(
    createElement(MathMarkdown, {
      children: String.raw`[unsafe](javascript:alert(1)) and $\href{javascript:alert(1)}{x}$`,
    }),
  );
  assert.doesNotMatch(links, /href="javascript:/i);
  assert.doesNotMatch(links, /onclick=/i);
});
