import test from "node:test";
import assert from "node:assert/strict";
import { methods } from "./methods";
import { methodsEn } from "./methods.en";
import { getTheory } from "./theory";
import { uiEn } from "./ui-en";
import { readFileSync } from "node:fs";

test("Both languages cover the same eleven methods and scientific links", () => {
  assert.equal(methods.length, 11);
  assert.deepEqual(
    methodsEn.map((m) => m.id),
    methods.map((m) => m.id),
  );
  for (const [i, m] of methodsEn.entries()) {
    const zh = methods[i];
    assert.equal(m.scale, zh.scale);
    assert.equal(m.short, zh.short);
    assert.deepEqual(
      m.connections.map((x) => x.id),
      zh.connections.map((x) => x.id),
    );
    assert.deepEqual(
      m.references.map((x) => x.url),
      zh.references.map((x) => x.url),
    );
    assert.ok(
      !/\p{Script=Han}/u.test(JSON.stringify(m)),
      m.id + " has untranslated course content",
    );
  }
});
for (const method of methods)
  test(`${method.id}: complete parallel deeper lessons and worked examples`, () => {
    const zh = getTheory(method.id, "zh"),
      en = getTheory(method.id, "en");
    for (const lesson of [zh, en]) {
      assert.equal(lesson.sections.length, 3);
      assert.equal(lesson.objectives.length, 3);
      assert.ok(
        lesson.sections.every(
          (s) =>
            s.paragraphs.length >= 2 &&
            s.paragraphs.every((p) => p.length > 70),
        ),
      );
      assert.ok(
        lesson.sections.some(
          (s) => s.formula && s.symbols && s.symbols.length >= 3,
        ),
      );
      assert.ok(
        lesson.workedExample.steps.length >= 3 &&
          lesson.workedExample.result.length > 20,
      );
      assert.ok(lesson.question.answer.length > 40);
      assert.equal(lesson.pitfalls.length, 3);
    }
    assert.ok(
      !/\p{Script=Han}/u.test(JSON.stringify(en)),
      method.id + " has untranslated deeper theory",
    );
    assert.equal(zh.sections.length, en.sections.length);
  });
test("Every literal UI translation key has an English entry", () => {
  const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
  for (const match of app.matchAll(/\bui\(\s*("(?:[^"\\]|\\.)*")\s*\)/g)) {
    const key = JSON.parse(match[1]);
    assert.ok(uiEn[key], `Missing interface translation: ${key}`);
  }
});
