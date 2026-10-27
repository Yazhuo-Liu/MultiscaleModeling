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
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith(prefix)) return void res.writeHead(404).end();
    const file = resolve(root, pathname.slice(prefix.length) || "index.html");
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
  "why-multiscale",
  "scales-and-limits",
  "error-propagation",
  "electronic-structure",
  "atomic-orbitals",
  "bonding",
  "band-structure",
  "formation-energy",
];
const errors = [];
const failures = [];
let browser;
async function language(page, locale) {
  const expected = locale === "zh" ? "zh-CN" : "en";
  if ((await page.locator("html").getAttribute("lang")) !== expected) {
    await page
      .getByRole("button", {
        name: locale === "zh" ? "Switch to Chinese" : "Switch to English",
        exact: true,
      })
      .click();
  }
  await page.waitForFunction(
    (lang) => document.documentElement.lang === lang,
    expected,
  );
}
async function chapter(page, id) {
  await page.evaluate((id) => {
    location.hash = `/foundation/${id}`;
  }, id);
  await page
    .locator(`[data-foundation="${id}"] .foundation-references`)
    .waitFor();
  if (id === "atomic-orbitals")
    await page.locator(".orbital-explorer").waitFor();
  if (["error-propagation", "band-structure", "formation-energy"].includes(id))
    await page.locator(".foundation-lab").waitFor();
}
async function overflow(page, label) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    `${label}: page-wide overflow`,
  );
}
async function inspect(page, id, locale, viewport) {
  assert.ok(
    (await page.locator(".foundation-section").count()) >= 5,
    `${id}: sections`,
  );
  assert.ok(
    (await page.locator(".foundation-derivation .derivation-step").count()) >=
      3,
    `${id}: explained derivation`,
  );
  assert.equal(
    await page.locator(".katex-error").count(),
    0,
    `${id}/${locale}: invalid formula`,
  );
  assert.ok(
    (await page.locator(".foundation-reading math").count()) > 3,
    `${id}: accessible mathematics`,
  );
  const prose = await page.locator("main").evaluate((node) => {
    const clone = node.cloneNode(true);
    clone.querySelectorAll(".katex, svg, canvas").forEach((el) => el.remove());
    return clone.textContent || "";
  });
  assert.doesNotMatch(
    prose,
    /\$|\\(?:frac|begin|sigma|psi|partial)\b/,
    `${id}/${locale}: unrendered math`,
  );
  if (locale === "en")
    assert.doesNotMatch(
      prose,
      /[\u3400-\u9fff]/,
      `${id}: untranslated Chinese`,
    );
  await overflow(page, `${id}/${locale}/${viewport}`);
  const firstParagraph = page
    .locator(".foundation-section .math-prose p")
    .first();
  assert.ok(
    (await firstParagraph.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize),
    )) >= 16,
    "reading font is at least 16px",
  );
}
try {
  browser = await chromium.launch({
    executablePath,
    args: [
      "--no-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (req) =>
    failures.push(`${req.url()}: ${req.failure()?.errorText}`),
  );
  await page.goto(`${base}#/foundations`);
  await page.locator(".foundation-card").first().waitFor();
  assert.equal(await page.locator(".foundation-card").count(), 8);
  await mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/foundations-index-zh.png",
    fullPage: true,
  });
  for (const locale of ["zh", "en"]) {
    await language(page, locale);
    for (const id of ids) {
      await chapter(page, id);
      await inspect(page, id, locale, "desktop");
    }
  }
  await chapter(page, "band-structure");
  assert.equal(await page.getByTestId("band-gap").textContent(), "0.80 eV");
  await page.getByTestId("band-hopping").fill("1");
  assert.equal(await page.getByTestId("band-gap").textContent(), "0.00 eV");
  await language(page, "zh");
  assert.equal(
    await page.getByTestId("band-hopping").inputValue(),
    "1",
    "language preserves band parameter",
  );
  assert.equal(await page.getByTestId("band-gap").textContent(), "0.00 eV");
  await page.getByTestId("band-hopping").fill("0.6");
  await page.locator('[data-testid="band-explorer"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/foundations-bands-zh.png" });
  await chapter(page, "formation-energy");
  assert.equal(
    await page.getByTestId("formation-above-hull").textContent(),
    "0.050 eV/atom",
  );
  await page.getByTestId("formation-energy").fill("-0.2");
  assert.equal(
    await page.getByTestId("formation-above-hull").textContent(),
    "0.000 eV/atom",
  );
  await page.getByTestId("formation-energy").fill("0.1");
  assert.equal(
    await page.getByTestId("formation-above-hull").textContent(),
    "0.250 eV/atom",
  );
  await chapter(page, "error-propagation");
  assert.equal(
    await page.getByTestId("uncertainty-product-independent").textContent(),
    "70.71 N",
  );
  await page.getByTestId("uncertainty-cv").fill("10");
  assert.equal(
    await page.getByTestId("uncertainty-product-independent").textContent(),
    "141.42 N",
  );
  assert.equal(
    await page.getByTestId("uncertainty-product-correct").textContent(),
    "0 N",
  );
  await chapter(page, "atomic-orbitals");
  const explorer = page.locator(".orbital-explorer");
  assert.equal(await explorer.getAttribute("data-orbital-level"), "shells");
  await explorer
    .getByRole("button", { name: "Fe 铁原子", exact: true })
    .click();
  assert.equal(await page.locator(".orbital-shell").count(), 4);
  assert.deepEqual(
    await page.locator(".orbital-shell strong").allTextContents(),
    ["2 e⁻", "8 e⁻", "14 e⁻", "2 e⁻"],
  );
  await page.locator(".orbital-shell").nth(2).click();
  assert.equal(await explorer.getAttribute("data-orbital-level"), "subshells");
  assert.match(await page.locator(".orbital-subshells").textContent(), /3d/);
  await page.locator(".orbital-stage-tabs button").nth(2).click();
  await explorer.getByLabel("选择轨道", { exact: true }).selectOption("dz2");
  await explorer.getByRole("button", { name: "3D", exact: true }).click();
  await page.locator('.orbital-scene[data-ready="true"] canvas').waitFor();
  await page.locator(".orbital-scene").scrollIntoViewIfNeeded();
  await page.locator(".orbital-scene").focus();
  const canvasBefore = await page.locator(".orbital-scene canvas").screenshot();
  const cameraBefore = await page
    .locator(".orbital-scene")
    .getAttribute("data-camera");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("+");
  const canvasMoved = await page.locator(".orbital-scene canvas").screenshot();
  const cameraMoved = await page
    .locator(".orbital-scene")
    .getAttribute("data-camera");
  assert.ok(cameraMoved);
  assert.notEqual(
    cameraMoved,
    cameraBefore,
    "rotation and zoom change the camera pose",
  );
  assert.notDeepEqual(
    canvasMoved,
    canvasBefore,
    "3D keyboard rotation and zoom change the rendered view",
  );
  await page.locator(".orbital-scene canvas").evaluate((el) => {
    window.__foundationCanvas = el;
  });
  await language(page, "en");
  assert.equal(
    await page
      .locator(".orbital-scene canvas")
      .evaluate((el) => el === window.__foundationCanvas),
    true,
    "language does not recreate the 3D canvas",
  );
  // Translation changes the document's fractional scroll position, so PNG
  // element screenshots need not have identical rasterized edge pixels.
  // Check the rendered camera pose, after pending resize/paint callbacks.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  assert.equal(
    await page.locator(".orbital-scene").getAttribute("data-camera"),
    cameraMoved,
    "language preserves the actual camera pose",
  );
  assert.equal(await explorer.getAttribute("data-orbital-atom"), "Fe");
  assert.equal(
    await explorer
      .getByLabel("Select an orbital", { exact: true })
      .inputValue(),
    "dz2",
  );
  await page.locator(".orbital-shape-controls").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/foundations-fe-3d-en.png" });
  await explorer
    .getByRole("button", { name: "H Hydrogen", exact: true })
    .click();
  await explorer
    .getByLabel("Select an orbital", { exact: true })
    .selectOption("2pz");
  await page.locator('.orbital-scene[data-ready="true"] canvas').waitFor();
  await explorer.getByRole("button", { name: "2D", exact: true }).click();
  await page.locator(".orbital-slice").waitFor();
  await page.locator(".orbital-shape-controls").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/foundations-h-2p-en.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ["en", "zh"]) {
    await language(page, locale);
    for (const id of ids) {
      await chapter(page, id);
      await inspect(page, id, locale, "mobile");
    }
  }
  await chapter(page, "atomic-orbitals");
  await page.locator(".orbital-stage-tabs button").nth(2).click();
  await explorer.getByLabel("选择轨道", { exact: true }).selectOption("2s");
  await overflow(page, "H 2s mobile controls");
  await page.locator(".orbital-shape-controls").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/foundations-h-2s-mobile.png" });
  await chapter(page, "scales-and-limits");
  const table = page.locator(".foundation-table-scroll").first();
  if (await table.count()) {
    assert.ok(
      await table.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
        return el.scrollLeft > 0;
      }),
      "mobile table can scroll",
    );
  }
  await language(page, "en");
  await page.reload();
  assert.equal(
    await page.locator("html").getAttribute("lang"),
    "en",
    "language preference survives reload",
  );
  await page.locator(".foundation-references").waitFor();
  await page.locator(".foundation-connections a").first().click();
  await page.locator(".method-page").waitFor();
  assert.ok(
    (await page.locator(".foundation-prerequisites a").count()) >= 2,
    "methods link back to foundations",
  );
  await page.locator(".foundation-prerequisites a").first().click();
  await page.locator(".foundation-lesson").waitFor();
  assert.deepEqual(errors, [], "browser runtime errors");
  assert.deepEqual(failures, [], "asset requests");

  const fallback = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).includes("webgl")
        ? null
        : original.call(this, type, ...args);
    };
  });
  await fallback.goto(`${base}#/foundation/atomic-orbitals`);
  await fallback.locator(".orbital-stage-tabs button").nth(2).click();
  await fallback
    .locator(".orbital-explorer")
    .getByRole("button", { name: "3D", exact: true })
    .click();
  await fallback.locator('.orbital-explorer [role="status"]').waitFor();
  assert.equal(
    await fallback
      .locator(".orbital-explorer")
      .getAttribute("data-orbital-view"),
    "2d",
    "no-WebGL fallback uses 2D",
  );
  await overflow(fallback, "no-WebGL mobile");
  console.log(
    "PASS: all 16 bilingual foundation lessons on desktop and mobile, rendered math, model controls, H/Fe hierarchy, 2D/3D, language persistence, links and WebGL fallback.",
  );
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
}
