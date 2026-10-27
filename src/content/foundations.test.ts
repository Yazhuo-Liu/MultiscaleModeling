import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import { foundations, getFoundation } from "./foundations";
import { foundationIndex, foundationPrerequisites } from "./foundation-index";
import type { FoundationId, FoundationLesson } from "./foundations-types";
import { methods } from "./methods";

const ids: FoundationId[] = [
  "why-multiscale",
  "scales-and-limits",
  "error-propagation",
  "electronic-structure",
  "atomic-orbitals",
  "bonding",
  "band-structure",
  "formation-energy",
];
const locales = ["zh", "en"] as const;
const methodIds = new Set(methods.map((method) => method.id));
const parser = unified().use(remarkParse).use(remarkMath);
// Newlines may format authored Markdown or aligned equations. Tabs, carriage
// returns and other controls often indicate an accidentally escaped TeX command.
const forbiddenControls = /[\u0000-\u0009\u000b-\u001f\u007f]/;

function textPresent(
  value: unknown,
  location: string,
): asserts value is string {
  assert.equal(typeof value, "string", `${location}: expected text`);
  assert.ok((value as string).trim(), `${location}: empty text`);
}

function checkLesson(lesson: FoundationLesson, location: string) {
  for (const field of ["title", "subtitle", "lead"] as const)
    textPresent(lesson[field], `${location}.${field}`);
  assert.ok(
    Number.isFinite(lesson.readMinutes) && lesson.readMinutes > 0,
    `${location}: invalid reading time`,
  );
  assert.ok(lesson.objectives.length >= 3, `${location}: learning objectives`);
  assert.ok(lesson.sections.length >= 4, `${location}: progressive sections`);
  const sectionIds = lesson.sections.map((section) => section.id);
  assert.equal(
    new Set(sectionIds).size,
    sectionIds.length,
    `${location}: duplicate section anchors`,
  );
  for (const section of lesson.sections) {
    assert.match(
      section.id,
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      `${location}: invalid section anchor`,
    );
    textPresent(section.title, `${location}/${section.id}.title`);
    assert.ok(
      section.paragraphs.length > 0,
      `${location}/${section.id}: missing explanation`,
    );
    if (section.table) {
      assert.ok(
        section.table.headers.length >= 2,
        `${location}/${section.id}: table headers`,
      );
      assert.ok(
        section.table.rows.length > 0,
        `${location}/${section.id}: empty table`,
      );
      for (const row of section.table.rows)
        assert.equal(
          row.length,
          section.table.headers.length,
          `${location}/${section.id}: misaligned table row`,
        );
    }
  }
  textPresent(lesson.derivation.title, `${location}.derivation.title`);
  textPresent(lesson.derivation.intro, `${location}.derivation.intro`);
  assert.ok(
    lesson.derivation.steps.length >= 3,
    `${location}: intermediate derivation steps`,
  );
  for (const [i, step] of lesson.derivation.steps.entries()) {
    textPresent(step.title, `${location}.derivation[${i}].title`);
    textPresent(step.explanation, `${location}.derivation[${i}].explanation`);
    textPresent(step.formula, `${location}.derivation[${i}].formula`);
  }
  textPresent(lesson.example.title, `${location}.example.title`);
  textPresent(lesson.example.problem, `${location}.example.problem`);
  textPresent(lesson.example.result, `${location}.example.result`);
  assert.ok(
    lesson.example.solution.length >= 3,
    `${location}: worked example steps`,
  );
  assert.ok(
    lesson.misconceptions.length >= 2,
    `${location}: scientific misconceptions`,
  );
  assert.ok(lesson.questions.length >= 2, `${location}: self-check questions`);
  assert.ok(lesson.connections.length > 0, `${location}: method connections`);
  for (const connection of lesson.connections) {
    assert.ok(
      methodIds.has(connection.method),
      `${location}: unknown method ${connection.method}`,
    );
    textPresent(
      connection.reason,
      `${location}.connections.${connection.method}`,
    );
  }
  assert.ok(lesson.references.length > 0, `${location}: references`);
  for (const reference of lesson.references) {
    textPresent(reference.label, `${location}.references.label`);
    textPresent(reference.detail, `${location}.references.detail`);
    const url = new URL(reference.url);
    assert.equal(
      url.protocol,
      "https:",
      `${location}: reference must use HTTPS`,
    );
    assert.ok(url.hostname.includes("."), `${location}: reference hostname`);
    assert.equal(
      url.username + url.password,
      "",
      `${location}: reference contains credentials`,
    );
  }
}

function checkLatex(source: string, location: string, displayMode: boolean) {
  textPresent(source, location);
  assert.doesNotMatch(
    source,
    forbiddenControls,
    `${location}: corrupted JavaScript escape in TeX`,
  );
  assert.doesNotMatch(
    source,
    /\$/,
    `${location}: raw formula contains Markdown delimiters`,
  );
  assert.doesNotMatch(
    source,
    /(?<!\\)\b(?:mathrm|mathbf|mathsf|mathcal|operatorname|text|textrm|begin|end|frac|sqrt|underbrace|overbrace)\s*\{/,
    `${location}: a TeX command is missing its backslash`,
  );
  assert.doesNotMatch(
    source,
    /\n(?:abla|u|eq|ot|otin)\b/,
    `${location}: possible newline escape in a TeX command`,
  );
  try {
    const rendered = katex.renderToString(source, {
      displayMode,
      throwOnError: true,
      strict: "error",
      trust: false,
      output: "htmlAndMathml",
    });
    assert.match(
      rendered,
      /<math[\s>]/,
      `${location}: missing accessible mathematics`,
    );
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
  textPresent(source, location);
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
        `${location}: unpaired mathematical delimiter`,
      );
      assert.doesNotMatch(
        node.value ?? "",
        /\\(?:frac|sqrt|partial|sigma|varepsilon|psi|phi|rho|hbar|int|sum|begin|mathbf|mathrm)\b/,
        `${location}: TeX command outside mathematical delimiters`,
      );
    }
    node.children?.forEach(visit);
  };
  visit(parser.parse(source) as MarkdownNode);
  return count;
}

function checkMathematics(value: unknown, path: string, key = ""): number {
  if (typeof value === "string") {
    if (key === "formula" || key === "equation") {
      checkLatex(value, path, true);
      return 1;
    }
    return checkMarkdown(value, path);
  }
  if (Array.isArray(value))
    return value.reduce(
      (count, item, i) => count + checkMathematics(item, `${path}[${i}]`),
      0,
    );
  if (value && typeof value === "object")
    return Object.entries(value).reduce(
      (count, [field, item]) =>
        count + checkMathematics(item, `${path}.${field}`, field),
      0,
    );
  return 0;
}

test("The foundation directory and lessons cover all eight bilingual chapters", () => {
  assert.deepEqual(
    foundationIndex.map((entry) => entry.id),
    ids,
  );
  assert.deepEqual(Object.keys(foundations).sort(), [...ids].sort());
  for (const entry of foundationIndex) {
    assert.deepEqual(
      Object.keys(foundations[entry.id]).sort(),
      [...locales].sort(),
    );
    for (const locale of locales) {
      textPresent(entry.title[locale], `${entry.id}/${locale}.directory.title`);
      textPresent(
        entry.summary[locale],
        `${entry.id}/${locale}.directory.summary`,
      );
      checkMarkdown(
        entry.title[locale],
        `${entry.id}/${locale}.directory.title`,
      );
      checkMarkdown(
        entry.summary[locale],
        `${entry.id}/${locale}.directory.summary`,
      );
      assert.equal(
        getFoundation(entry.id, locale),
        foundations[entry.id][locale],
      );
    }
    assert.doesNotMatch(
      entry.title.en + entry.summary.en,
      /\p{Script=Han}/u,
      `${entry.id}: untranslated directory text`,
    );
  }
});

test("All eleven method prerequisites point to existing foundation chapters", () => {
  assert.deepEqual(
    Object.keys(foundationPrerequisites).sort(),
    [...methodIds].sort(),
  );
  for (const [method, prerequisites] of Object.entries(
    foundationPrerequisites,
  )) {
    assert.ok(
      prerequisites.length > 0,
      `${method}: missing foundation entry point`,
    );
    assert.equal(
      new Set(prerequisites).size,
      prerequisites.length,
      `${method}: duplicate prerequisite`,
    );
    for (const id of prerequisites)
      assert.ok(ids.includes(id), `${method}: unknown foundation ${id}`);
  }
});

for (const id of ids) {
  test(`${id}: complete and structurally parallel Chinese and English lessons`, () => {
    const zh = getFoundation(id, "zh");
    const en = getFoundation(id, "en");
    for (const [locale, lesson] of [
      ["zh", zh],
      ["en", en],
    ] as const)
      checkLesson(lesson, `${id}/${locale}`);
    assert.doesNotMatch(
      JSON.stringify(en),
      /\p{Script=Han}/u,
      `${id}: untranslated English lesson`,
    );
    assert.equal(
      zh.objectives.length,
      en.objectives.length,
      `${id}: objective coverage differs`,
    );
    assert.deepEqual(
      zh.sections.map((section) => section.id),
      en.sections.map((section) => section.id),
      `${id}: section coverage differs`,
    );
    for (const [index, section] of zh.sections.entries()) {
      const translated = en.sections[index];
      assert.equal(
        section.paragraphs.length,
        translated.paragraphs.length,
        `${id}/${section.id}: paragraph coverage differs`,
      );
      assert.equal(
        Boolean(section.equation),
        Boolean(translated.equation),
        `${id}/${section.id}: missing equation`,
      );
      assert.equal(
        section.bullets?.length ?? 0,
        translated.bullets?.length ?? 0,
        `${id}/${section.id}: bullet coverage differs`,
      );
      assert.deepEqual(
        section.table
          ? [section.table.headers.length, section.table.rows.length]
          : null,
        translated.table
          ? [translated.table.headers.length, translated.table.rows.length]
          : null,
        `${id}/${section.id}: table coverage differs`,
      );
    }
    assert.equal(
      zh.derivation.steps.length,
      en.derivation.steps.length,
      `${id}: derivation coverage differs`,
    );
    assert.equal(
      zh.example.solution.length,
      en.example.solution.length,
      `${id}: worked example coverage differs`,
    );
    assert.equal(
      zh.misconceptions.length,
      en.misconceptions.length,
      `${id}: misconception coverage differs`,
    );
    assert.equal(
      zh.questions.length,
      en.questions.length,
      `${id}: self-check coverage differs`,
    );
    assert.deepEqual(
      zh.connections.map((connection) => connection.method),
      en.connections.map((connection) => connection.method),
      `${id}: method connections differ`,
    );
    assert.deepEqual(
      zh.references.map((reference) => reference.url),
      en.references.map((reference) => reference.url),
      `${id}: scientific references differ`,
    );
  });
  for (const locale of locales)
    test(`${id}/${locale}: all display and Markdown mathematics compile strictly`, () => {
      const count = checkMathematics(
        getFoundation(id, locale),
        `${id}/${locale}`,
      );
      assert.ok(count >= 3, `${id}/${locale}: missing mathematical derivation`);
    });
}
