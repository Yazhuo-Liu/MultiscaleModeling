import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";

// Test the built site at its real Pages subpath, including language changes mid-experiment.
const root = resolve("dist");
const prefix = "/MultiscaleModeling/";
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!path.startsWith(prefix)) {
      res.writeHead(404).end();
      return;
    }
    const file = resolve(root, path.slice(prefix.length) || "index.html");
    if (!file.startsWith(root + "/")) {
      res.writeHead(403).end();
      return;
    }
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
await new Promise((r) => server.listen(0, "127.0.0.1", r));
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
const errors = [];
const failures = [];
const listen = (page) => {
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
};
const noOverflow = async (page, where) =>
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    `Document overflow: ${where}`,
  );
const englishOnly = async (page, where) => {
  const text = await page.locator("main").innerText();
  const chinese = text.match(/[\p{Script=Han}]+/gu);
  assert.equal(
    chinese,
    null,
    `Untranslated text in ${where}: ${chinese?.join(", ")}`,
  );
};
const noClutter = async (page, where) =>
  assert.doesNotMatch(
    await page.locator("main").innerText(),
    /本机计算|浏览器|in-browser|in your browser|local computation/i,
    `Implementation copy in ${where}`,
  );
const switchTo = async (page, locale) => {
  const target = locale === "en" ? "en" : "zh-CN";
  if ((await page.locator("html").getAttribute("lang")) !== target) {
    await page
      .getByRole("button", {
        name: locale === "en" ? "Switch to English" : "Switch to Chinese",
        exact: true,
      })
      .click();
  }
  await page.waitForFunction(
    (lang) => document.documentElement.lang === lang,
    target,
  );
};
let browser;
async function openNumericalView(page) {
  await page.locator(".simulation-lab").waitFor();
  const details = page.getByTestId("lab-numerical-details");
  if (await details.count()) {
    if (!(await details.evaluate((node) => node.open)))
      await details.locator(":scope > summary").click();
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
  listen(page);
  await mkdir("test-results", { recursive: true });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await noClutter(page, "Chinese home");
  await switchTo(page, "en");
  await englishOnly(page, "English home");
  await noClutter(page, "English home");
  assert.equal(await page.locator(".method-card").count(), 11);
  assert.equal(
    await page.evaluate(() => localStorage.getItem("multiscale-language")),
    "en",
  );
  await page.reload();
  await page.locator(".method-card").first().waitFor();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await page.screenshot({
    path: "test-results/bilingual-home-en.png",
    fullPage: true,
  });
  for (const id of ids) {
    await page.goto(`${base}#/method/${id}`);
    await page.locator("#tab-advanced").click();
    await page.locator(".theory-section").first().waitFor();
    assert.equal(
      await page.locator(".theory-section").count(),
      3,
      `${id}: three deeper sections`,
    );
    assert.ok(
      (await page.locator(".theory-section p").count()) >= 6,
      `${id}: substantive paragraphs`,
    );
    assert.equal(
      await page.locator(".theory-figure svg[role=img]").count(),
      1,
      `${id}: scientific figure`,
    );
    assert.ok(
      (await page.locator(".theory-figure svg").getAttribute("aria-labelledby"))
        ?.length > 0,
    );
    assert.equal(await page.locator(".worked-example").count(), 1);
    assert.ok((await page.locator(".worked-example li").count()) >= 3);
    assert.equal(await page.locator(".learning-objectives li").count(), 3);
    const paragraphSize = await page
      .locator(".theory-section p")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    assert.ok(
      paragraphSize >= 16,
      `${id}: theory paragraph is ${paragraphSize}px`,
    );
    await page.getByText("Reveal the explanation", { exact: true }).click();
    assert.equal(
      await page.locator(".self-check details").getAttribute("open"),
      "",
    );
    assert.ok(
      (await page.locator(".self-check details p").innerText()).length > 50,
    );
    await englishOnly(page, `${id} theory`);
    await noClutter(page, `${id} theory`);
    if (id === "fem") {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: "test-results/bilingual-fem-theory-en.png",
        fullPage: true,
      });
    }
    await page
      .getByRole("tab", { name: "Algorithm & code", exact: true })
      .click();
    await englishOnly(page, `${id} code`);
    await noClutter(page, `${id} code`);
    assert.ok(
      (await page.locator("pre code").innerText()).includes("import numpy"),
    );
    await page
      .getByRole("tab", { name: "Applications & links", exact: true })
      .click();
    await englishOnly(page, `${id} references`);
    await page
      .getByRole("tab", { name: "Interactive lab", exact: true })
      .click();
    if (id === "mc") await page.getByTestId("mc-example-ising").click();
    await openNumericalView(page);
    await page.locator(".lab-viewport canvas").waitFor();
    await page
      .getByRole("button", { name: "Step forward", exact: true })
      .click();
    assert.match(await page.locator(".lab-step").innerText(), /1 steps/);
    await page.locator(".lab-model-note summary").click();
    await englishOnly(page, `${id} lab`);
    await noClutter(page, `${id} lab`);
    if (id === "md" || id === "phase-field") {
      await page.locator(".lab-mode button").nth(1).click();
      await openNumericalView(page);
      await page.locator(".lab-viewport canvas").waitFor();
      assert.match(
        await page.locator(".lab-viewport canvas").getAttribute("aria-label"),
        /Three-dimensional/,
      );
    }
    if (id === "md") {
      const slider = page.locator(".lab-controls input[type=range]").first();
      await slider.focus();
      await slider.press("ArrowRight");
      await page
        .getByRole("button", { name: "Step forward", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Step forward", exact: true })
        .click();
      const values = await page
        .locator("input[type=range]")
        .evaluateAll((nodes) => nodes.map((node) => node.value));
      const readouts = await page
        .locator(".lab-metric strong")
        .allTextContents();
      await page.locator(".lab-viewport canvas").evaluate((node) => {
        window.__bilingualCanvas = node;
      });
      await switchTo(page, "zh");
      assert.ok(page.url().endsWith("#/method/md"));
      assert.equal(
        await page
          .getByRole("tab", { name: "交互实验", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      assert.match(await page.locator(".lab-step").innerText(), /2 步/);
      assert.deepEqual(
        await page
          .locator("input[type=range]")
          .evaluateAll((nodes) => nodes.map((node) => node.value)),
        values,
      );
      assert.equal(
        await page
          .locator(".lab-viewport canvas")
          .evaluate((node) => window.__bilingualCanvas === node),
        true,
        "3D canvas survives language switch",
      );
      await switchTo(page, "en");
      assert.match(await page.locator(".lab-step").innerText(), /2 steps/);
      assert.deepEqual(
        await page.locator(".lab-metric strong").allTextContents(),
        readouts,
      );
      assert.equal(
        await page
          .locator(".lab-viewport canvas")
          .evaluate((node) => window.__bilingualCanvas === node),
        true,
      );
      await page.locator(".lab-playback").scrollIntoViewIfNeeded();
      await page
        .getByRole("button", { name: "Run experiment", exact: true })
        .click();
      await page.waitForFunction(() =>
        /Running · [3-9]|Running · [1-9][0-9]/.test(
          document.querySelector(".lab-step").textContent,
        ),
      );
      await switchTo(page, "zh");
      assert.match(await page.locator(".lab-step").innerText(), /运行中/);
      await page.getByRole("button", { name: "暂停", exact: true }).click();
      await switchTo(page, "en");
      assert.match(await page.locator(".lab-step").innerText(), /Paused/);
    }
    console.log(
      `PASS bilingual ${id}: detailed theory, figure, example, self-check, code, references and lab`,
    );
  }
  for (const route of ["path", "compare", "resources"]) {
    await page.goto(`${base}#/${route}`);
    await page.locator("main h1").waitFor();
    await englishOnly(page, route);
    await noClutter(page, route);
  }
  await page.goto(`${base}#/method/md`);
  await switchTo(page, "zh");
  await page.reload();
  await page.locator("#tab-advanced").click();
  await page.locator(".theory-section").first().waitFor();
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
  assert.ok(page.url().endsWith("#/method/md"));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ["zh", "en"]) {
    await switchTo(page, locale);
    await page.goto(base);
    await page.locator(".method-card").first().waitFor();
    await noOverflow(page, `${locale} mobile home`);
    await noClutter(page, `${locale} mobile home`);
    await page.screenshot({
      path: `test-results/bilingual-mobile-home-${locale}.png`,
      fullPage: true,
    });
    for (const id of ["crystal-plasticity", "constitutive", "hf"]) {
      await page.goto(`${base}#/method/${id}`);
      await page.locator("#tab-advanced").click();
      await page.locator(".theory-section").first().waitFor();
      await noOverflow(page, `${locale} ${id} mobile theory`);
      assert.ok(
        (await page
          .locator(".theory-section p")
          .first()
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))) >= 16,
      );
      if (locale === "en")
        await englishOnly(page, `${id} English mobile theory`);
      if (id === "hf")
        await page.screenshot({
          path: `test-results/bilingual-mobile-theory-${locale}.png`,
          fullPage: true,
        });
      await page
        .getByRole("tab", {
          name: locale === "en" ? "Interactive lab" : "交互实验",
          exact: true,
        })
        .click();
      await openNumericalView(page);
      await page.locator(".lab-viewport canvas").waitFor();
      await noOverflow(page, `${locale} ${id} mobile lab`);
      await page
        .getByRole("button", {
          name: locale === "en" ? "Step forward" : "前进一步",
          exact: true,
        })
        .click();
      if (id === "crystal-plasticity")
        await page.screenshot({
          path: `test-results/bilingual-mobile-lab-${locale}.png`,
          fullPage: true,
        });
    }
  }
  assert.deepEqual(errors, [], "JavaScript errors");
  assert.deepEqual(failures, [], "Failed production asset requests");
  console.log(
    "PASS language persistence, route/tab/parameter/step/camera preservation, running state, readable text, uncluttered copy and mobile layout in both languages.",
  );
} finally {
  await browser?.close();
  await new Promise((r) => server.close(r));
}
