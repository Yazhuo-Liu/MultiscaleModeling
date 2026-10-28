import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";

const root = resolve("dist");
const prefix = "/MultiscaleModeling/";
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!path.startsWith(prefix)) return void res.writeHead(404).end();
    const file = resolve(root, path.slice(prefix.length) || "index.html");
    if (!file.startsWith(root + "/")) return void res.writeHead(403).end();
    await stat(file);
    res.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const base = `http://127.0.0.1:${server.address().port}${prefix}`;
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const ids = [
  "dft",
  "hf",
  "md",
  "mc",
  "dd",
  "kmc",
  "phase-field",
  "crystal-plasticity",
  "constitutive",
  "fem",
  "fdm",
];
const errors = [],
  failures = [];
let scrollableEquationsChecked = 0;
let scriptSizesChecked = 0;
let browser;
const noOverflow = async (page, label) =>
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    `${label}: page-wide overflow`,
  );
async function switchLanguage(page, locale) {
  const lang = locale === "zh" ? "zh-CN" : "en";
  if ((await page.locator("html").getAttribute("lang")) !== lang)
    await page
      .getByRole("button", {
        name: locale === "zh" ? "Switch to Chinese" : "Switch to English",
        exact: true,
      })
      .click();
  await page.waitForFunction(
    (expected) => document.documentElement.lang === expected,
    lang,
  );
}
async function noRawMath(page, label) {
  const text = await page.locator("main").evaluate((node) => {
    const clone = node.cloneNode(true);
    clone
      .querySelectorAll(".katex, pre, code, svg")
      .forEach((element) => element.remove());
    return clone.textContent || "";
  });
  const sourceFragments = [
    ...text.matchAll(/\$|\\(?:frac|partial|begin|varepsilon|sigma)\b/g),
  ]
    .slice(0, 10)
    .map((match) =>
      text.slice(Math.max(0, match.index - 45), match.index + 90),
    );
  assert.deepEqual(
    sourceFragments,
    [],
    `${label}: unrendered mathematics in prose`,
  );
  assert.equal(
    await page.locator(".katex-error").count(),
    0,
    `${label}: math rendering error`,
  );
}
async function inspectScriptSizes(page, label) {
  await page.evaluate(() => document.fonts.ready);
  const measurements = await page
    .locator(".math-markdown .katex .sizing")
    .evaluateAll((nodes) =>
      nodes
        .filter(
          (node) =>
            (node.classList.contains("reset-size6") &&
              node.classList.contains("size3")) ||
            (node.classList.contains("reset-size3") &&
              node.classList.contains("size1")),
        )
        .map((node) => {
          const style = getComputedStyle(node);
          const parent = getComputedStyle(node.parentElement);
          return {
            text: node.textContent.slice(0, 32),
            expected: node.classList.contains("reset-size6") ? 0.7 : 5 / 7,
            ratio: parseFloat(style.fontSize) / parseFloat(parent.fontSize),
          };
        }),
    );
  scriptSizesChecked += measurements.length;
  assert.deepEqual(
    measurements.filter(
      ({ ratio, expected }) => Math.abs(ratio - expected) > 0.002,
    ),
    [],
    `${label}: KaTeX script-size CSS must match the renderer's actual HTML classes`,
  );
}

async function inspectOrbitalFormula(page, locale) {
  await page.goto(`${base}#/foundation/atomic-orbitals`);
  await page.getByTestId("foundation-level-model").click();
  await page.locator(".foundation-section").first().waitFor();
  await page.locator(".foundation-section details").evaluateAll((nodes) =>
    nodes.forEach((node) => {
      node.open = true;
    }),
  );
  const formula = page.locator(".theory-formula").filter({
    has: page.locator("annotation", { hasText: "L_{n-l-1}^{2l+1}" }),
  });
  await formula.waitFor();
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    await page.setViewportSize(viewport);
    await formula.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    const measured = await formula.evaluate((element) => {
      const math = element.querySelector(".katex");
      const baseSize = parseFloat(getComputedStyle(math).fontSize);
      const firstScript = element.querySelector(".sizing.reset-size6.size3");
      const nestedScript = element.querySelector(".sizing.reset-size3.size1");
      const psi = [...element.querySelectorAll(".katex-html .mathnormal")].find(
        (node) => node.textContent === "ψ",
      );
      const index = psi.parentElement.querySelector(".msupsub .sizing");
      const psiBox = psi.getBoundingClientRect();
      const indexBox = index.getBoundingClientRect();
      return {
        baseSize,
        primaryRatio:
          parseFloat(getComputedStyle(firstScript).fontSize) / baseSize,
        nestedRatio:
          parseFloat(getComputedStyle(nestedScript).fontSize) / baseSize,
        font: getComputedStyle(psi).fontFamily,
        baseRight: psiBox.right,
        subLeft: indexBox.left,
        baseCenterY: psiBox.y + psiBox.height / 2,
        subCenterY: indexBox.y + indexBox.height / 2,
        scrollWidth: element.querySelector(".math-display").scrollWidth,
        clientWidth: element.querySelector(".math-display").clientWidth,
      };
    });
    // Keep a screenshot even on failure: matching HTML classes alone cannot
    // prove that the stylesheet actually scaled and positioned the scripts.
    await formula.screenshot({
      path: `test-results/math-${locale}-orbital-scripts-${name}.png`,
    });
    console.log(
      `Orbital scripts ${locale}/${name}: ${JSON.stringify(measured)}`,
    );
    assert.ok(
      Math.abs(measured.primaryRatio - 0.7) < 0.002,
      "Primary subscripts/superscripts are 70% of the base size",
    );
    assert.ok(
      Math.abs(measured.nestedRatio - 0.5) < 0.002,
      "Nested scripts are 50% of the base size",
    );
    assert.match(
      measured.font,
      /KaTeX/,
      "The actual glyph uses bundled math fonts",
    );
    assert.ok(
      measured.subCenterY > measured.baseCenterY,
      "The subscript is visibly below its base glyph",
    );
    assert.ok(
      measured.subLeft >= measured.baseRight - measured.baseSize * 0.2,
      "The subscript follows the base rather than covering it",
    );
    await inspectScriptSizes(page, `atomic-orbitals/${locale}/${name}`);
    await noRawMath(page, `atomic-orbitals/${locale}/${name}`);
    await noOverflow(page, `atomic-orbitals/${locale}/${name}`);
    const scroll = await formula.locator(".math-display").evaluate((node) => {
      const overflow = node.scrollWidth > node.clientWidth + 2;
      node.scrollLeft = node.scrollWidth;
      const reachable = node.scrollLeft > 0;
      node.scrollLeft = 0;
      return { overflow, reachable, mode: getComputedStyle(node).overflowX };
    });
    if (scroll.overflow) {
      scrollableEquationsChecked++;
      assert.ok(
        scroll.reachable && ["auto", "scroll"].includes(scroll.mode),
        "Long orbital formulas retain readable sizing and local horizontal scrolling",
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
}
async function inspectMath(page, label) {
  await page.locator("#tab-theory").click();
  assert.ok(
    (await page.locator(".equation-card .katex-display").count()) > 0,
    `${label}: core equation was not rendered`,
  );
  await noRawMath(page, `${label}/model`);
  await inspectScriptSizes(page, `${label}/model`);
  await noOverflow(page, `${label}/model`);
  await page.locator("#tab-advanced").click();
  await page.locator(".derivation-stage").first().waitFor();
  assert.equal(
    await page.locator(".derivation-stage").count(),
    3,
    `${label}: stage count`,
  );
  assert.ok(
    (await page.locator(".derivation-step").count()) >= 9,
    `${label}: explained steps`,
  );
  assert.ok(
    (await page.locator(".derivation-path .katex-display").count()) >= 9,
    `${label}: derivation equations were not rendered`,
  );
  assert.ok(
    (await page.locator(".symbol-glossary .katex").count()) >= 3,
    `${label}: symbol glossary was not rendered`,
  );
  assert.ok(
    (await page.locator(".katex-mathml math").count()) >= 20,
    `${label}: missing accessible MathML`,
  );
  assert.equal(
    await page.locator(".katex-error").count(),
    0,
    `${label}: KaTeX error`,
  );
  const unrendered = await page.locator(".math-markdown").evaluateAll((nodes) =>
    nodes
      .map((node) => {
        const clone = node.cloneNode(true);
        clone
          .querySelectorAll(".katex, pre, code")
          .forEach((math) => math.remove());
        return clone.textContent || "";
      })
      .filter(
        (text) =>
          text.includes("$") ||
          /\\(?:frac|partial|begin|varepsilon|sigma)\b/.test(text),
      ),
  );
  assert.deepEqual(unrendered, [], `${label}: visible source notation`);
  const displays = await page.locator(".math-display").evaluateAll((nodes) =>
    nodes
      .map((node) => ({
        text: node.textContent,
        rendered: Boolean(node.querySelector(".katex-display")),
      }))
      .filter((node) => node.text?.trim() && !node.rendered),
  );
  assert.deepEqual(displays, [], `${label}: raw display field`);
  await noRawMath(page, label);
  await inspectScriptSizes(page, label);
  await noOverflow(page, label);
  if (page.viewportSize().width <= 700) {
    const scrollChecks = await page
      .locator(".math-display, .math-prose > .katex-display")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.scrollWidth > node.clientWidth + 2)
          .map((node) => {
            const previous = node.scrollLeft;
            node.scrollLeft = node.scrollWidth;
            const reachable = node.scrollLeft > 0;
            const overflow = getComputedStyle(node).overflowX;
            node.scrollLeft = previous;
            return { reachable, overflow };
          }),
      );
    scrollableEquationsChecked += scrollChecks.length;
    assert.deepEqual(
      scrollChecks.filter(
        (item) =>
          !item.reachable || !["auto", "scroll"].includes(item.overflow),
      ),
      [],
      `${label}: long equation cannot be scrolled to its end`,
    );
  }
}
try {
  browser = await chromium.launch({
    executablePath,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await mkdir("test-results", { recursive: true });
  await page.goto(base);
  for (const locale of ["zh", "en"]) {
    await switchLanguage(page, locale);
    await inspectOrbitalFormula(page, locale);
    for (const id of ids) {
      await page.goto(`${base}#/method/${id}`);
      await inspectMath(page, `${id}/${locale}/desktop`);
      const toggle = page.locator(".self-check summary");
      await toggle.click();
      assert.equal(
        await page.locator(".self-check details").getAttribute("open"),
        "",
      );
      assert.equal(await page.locator(".self-check .katex-error").count(), 0);
      if (id === "fem") {
        await page
          .locator(".derivation-stage")
          .first()
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `test-results/math-${locale}-fem-desktop.png`,
        });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await inspectMath(page, `${id}/${locale}/mobile`);
      if (id === "constitutive" || id === "fem") {
        await page
          .locator(".derivation-stage")
          .first()
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `test-results/math-${locale}-${id}-mobile.png`,
        });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const tabName of locale === "zh"
        ? ["应用与延伸", "算法与代码", "交互实验"]
        : ["Applications & links", "Algorithm & code", "Interactive lab"]) {
        await page.getByRole("tab", { name: tabName, exact: true }).click();
        if (tabName === "交互实验" || tabName === "Interactive lab") {
          if (id === "mc") await page.getByTestId("mc-example-ising").click();
          await page
            .locator(".lab-canvas, .lab-spatial canvas, .lab-three canvas")
            .waitFor();
        }
        await noRawMath(page, `${id}/${locale}/${tabName}`);
      }
      console.log(
        `PASS math ${id}/${locale}: core, inline, glossary, three derivation stages, MathML and mobile layout`,
      );
    }
  }
  // Math-rich prose must not leak its source into experimental instructions.
  await page.goto(`${base}#/method/phase-field`);
  await page.getByRole("tab", { name: "Interactive lab", exact: true }).click();
  await page
    .locator(".lab-canvas, .lab-spatial canvas, .lab-three canvas")
    .waitFor();
  await page.getByRole("button", { name: "Step forward", exact: true }).click();
  await noRawMath(page, "phase-field/en/running lab");
  const route = page.url();
  await switchLanguage(page, "zh");
  assert.equal(page.url(), route);
  await page.locator("#tab-advanced").click();
  await inspectMath(page, "phase-field/zh/restored");
  await page.evaluate(() => document.fonts.ready);
  assert.ok(
    await page.evaluate(() =>
      [...document.fonts].some(
        (font) => font.family.includes("KaTeX") && font.status === "loaded",
      ),
    ),
    "Bundled KaTeX fonts loaded",
  );
  assert.ok(
    scrollableEquationsChecked > 0,
    "Long equations exercised within their own mobile scroll containers",
  );
  assert.ok(
    scriptSizesChecked > 100,
    "Computed script sizes were verified across foundation and method formula contexts",
  );
  assert.deepEqual(errors, [], "Browser JavaScript errors");
  assert.deepEqual(failures, [], "Failed static assets");
  console.log(
    "PASS mathematical reading in both languages, accessible notation, preserved labs and local math fonts.",
  );
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
