import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";

// Exercise the production artifact under the actual GitHub Pages subdirectory.
const root = resolve("dist");
const prefix = "/MultiscaleModeling/";
const types = {
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
      types[extname(file)] || "application/octet-stream",
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
let browser;
try {
  browser = await chromium.launch({
    executablePath,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const failures = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".method-card").count(), 11);
  await page.getByRole("button", { name: "电子结构", exact: true }).click();
  assert.equal(await page.locator(".method-card").count(), 2);
  await page.getByRole("button", { name: /全部方法/ }).click();
  assert.equal(await page.locator(".method-card").count(), 11);
  await page.getByRole("textbox", { name: "搜索建模方法" }).fill("Lennard");
  assert.equal(await page.locator(".nav-method").count(), 0);
  await page.getByRole("textbox", { name: "搜索建模方法" }).fill("molecular");
  assert.equal(await page.locator(".nav-method").count(), 1);
  await page.getByRole("button", { name: "清除搜索" }).click();
  await mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
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
  for (const id of ids) {
    await page.goto(`${base}#/method/${id}`);
    await page.locator(".concept-card").first().waitFor();
    assert.equal(await page.locator(".concept-card").count(), 3);
    await page.getByRole("tab", { name: "算法与代码" }).click();
    assert.ok(
      (await page.locator("pre code").innerText()).includes("import numpy"),
    );
    if (id === "md") {
      const down = page.waitForEvent("download");
      await page.getByRole("button", { name: "下载", exact: true }).click();
      assert.equal((await down).suggestedFilename(), "md-example.py");
    }
    await page.getByRole("tab", { name: "应用与延伸" }).click();
    assert.ok((await page.locator(".references a").count()) >= 2);
    await page.getByRole("tab", { name: "交互实验" }).click();
    await page.locator(".lab-canvas").waitFor();
    await page.locator(".lab-playback").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "前进一步", exact: true }).click();
    await page.waitForFunction(() =>
      document.querySelector(".lab-step")?.textContent?.includes("1 步"),
    );
    const slider = page.locator("input[type=range]").first();
    await slider.focus();
    await slider.press("ArrowRight");
    await page.waitForFunction(() =>
      document.querySelector(".lab-step")?.textContent?.includes("0 步"),
    );
    await page.getByRole("button", { name: "运行实验", exact: true }).click();
    await page.waitForFunction(() =>
      /运行中 · [1-9]/.test(
        document.querySelector(".lab-step")?.textContent || "",
      ),
    );
    await page.getByRole("button", { name: "暂停", exact: true }).click();
    const stopped = await page.locator(".lab-step").innerText();
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".lab-step").innerText(), stopped);
    await page.getByRole("button", { name: "3D", exact: true }).click();
    await page.locator(".lab-three canvas").waitFor();
    await page.waitForTimeout(120);
    const bounds = await page.locator(".lab-three canvas").boundingBox();
    assert.ok(bounds.width > 100 && bounds.height > 100);
    if (id === "md") {
      const canvas = page.locator(".lab-three canvas");
      await canvas.scrollIntoViewIfNeeded();
      const before = await canvas.screenshot();
      const rect = await canvas.boundingBox();
      await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        rect.x + rect.width / 2 + 100,
        rect.y + rect.height / 2 + 40,
        { steps: 10 },
      );
      await page.mouse.up();
      await page.waitForTimeout(250);
      assert.notDeepEqual(
        await canvas.screenshot(),
        before,
        "Dragging changes the actual rendered 3D camera",
      );
    }
    if (id === "md" || id === "phase-field") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `test-results/${id}-3d.png`,
        fullPage: true,
      });
    }
    await page.getByRole("button", { name: "2D", exact: true }).click();
    await page.getByRole("button", { name: "重置参数与实验" }).click();
    assert.ok((await page.locator(".lab-step").innerText()).includes("0 步"));
    if (id === "fdm") {
      const down = page.waitForEvent("download");
      await page.getByRole("button", { name: "导出当前数值 CSV" }).click();
      assert.equal((await down).suggestedFilename(), "fdm-snapshot.csv");
    }
    console.log(
      `PASS ${id}: theory/code/references, step/parameters/play/pause/reset, 2D/3D`,
    );
  }
  for (const route of ["path", "compare", "resources"]) {
    await page.goto(`${base}#/${route}`);
    await page.locator("main h1").waitFor();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.getByRole("button", { name: "打开菜单" }).click();
  await page
    .locator(".sidebar .nav-method")
    .filter({ hasText: "分子动力学" })
    .click();
  await page.getByRole("tab", { name: "交互实验" }).click();
  await page.locator(".lab-play").waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({
    path: "test-results/mobile-lab.png",
    fullPage: true,
  });
  await page.goto(base);
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  const fallback = await browser.newPage({
    viewport: { width: 900, height: 900 },
    reducedMotion: "reduce",
  });
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).includes("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
  await fallback.goto(`${base}#/method/md`);
  await fallback.getByRole("tab", { name: "交互实验" }).click();
  await fallback.getByRole("button", { name: "3D", exact: true }).click();
  await fallback.locator(".lab-canvas").waitFor();
  assert.ok(
    (await fallback.locator(".lab-view-hint").innerText()).includes(
      "未提供 WebGL",
    ),
  );
  assert.ok((await fallback.locator(".lab-step").innerText()).includes("0 步"));
  await fallback.close();
  console.log(
    "PASS actual 3D orbit interaction, WebGL fallback and reduced-motion initial pause.",
  );
  assert.deepEqual(errors, [], "Browser JavaScript errors");
  assert.deepEqual(failures, [], "Failed asset requests");
  console.log(
    "PASS mobile navigation/layout, downloads, all static subpath assets; no JS errors.",
  );
} finally {
  await browser?.close();
  await new Promise((r) => server.close(r));
}
