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

// These checks observe the same scene geometry/readouts that a learner sees.
const methods = [
  "dft",
  "hf",
  "md",
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
let browser;
async function language(page, locale) {
  if (
    (await page.locator("html").getAttribute("lang")) !==
    (locale === "zh" ? "zh-CN" : "en")
  )
    await page
      .getByRole("button", {
        name: locale === "zh" ? "Switch to Chinese" : "Switch to English",
        exact: true,
      })
      .click();
}
async function painted(page) {
  await page.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done)),
      ),
  );
}
async function noOverflow(page, label) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    label + ": no horizontal document overflow",
  );
}
function scene(page, id) {
  return id === "md" || id === "phase-field"
    ? page.locator(".lab-spatial")
    : page.getByTestId(`phenomenon-${id}`);
}
async function enter(page, id, lab = false) {
  await page.goto(`${base}#/method/${id}`);
  await page.locator(".beginner-intro").waitFor();
  if (lab) await page.locator("#tab-lab").click();
  const host = scene(page, id);
  await host.waitFor();
  await host.scrollIntoViewIfNeeded();
  await painted(page);
  return host;
}
async function step(page, count = 1) {
  for (let i = 0; i < count; i++)
    await page
      .getByRole("button", { name: /^(前进一步|Step forward)$/ })
      .click();
  await painted(page);
}
async function runTo(page, count) {
  await page
    .getByRole("combobox", { name: /^(模拟速度|Simulation speed)$/ })
    .selectOption("8");
  await page
    .getByRole("button", { name: /^(运行实验|Run experiment)$/ })
    .click();
  await page.waitForFunction((n) => {
    const match = document
      .querySelector(".lab-step")
      ?.textContent?.match(/·\s*(\d+)/);
    return Number(match?.[1]) >= n;
  }, count);
  await page.getByRole("button", { name: /^(暂停|Pause)$/ }).click();
  await painted(page);
}
async function reset(page) {
  await page
    .getByRole("button", {
      name: /^(重置参数与实验|Reset parameters and experiment)$/,
    })
    .click();
  await painted(page);
}
async function number(host, attribute) {
  const value = await host.getAttribute(attribute);
  assert.notEqual(value, null, `Scene exposes actual result ${attribute}`);
  assert.ok(Number.isFinite(Number(value)), attribute + ": finite");
  return Number(value);
}
async function inspectLocalControl(page, id, host) {
  switch (id) {
    case "dft": {
      const cloud = page.getByTestId("quantum-cloud");
      await cloud.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () =>
          document.querySelector('[data-testid="quantum-cloud"]')?.dataset
            .ready === "true",
      );
      assert.equal(await cloud.getAttribute("data-spatial-dimensions"), "3");
      assert.ok((await number(cloud, "data-point-count")) >= 1000);
      const before = await cloud.getAttribute("data-camera");
      const box = await cloud.boundingBox();
      await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.6, {
        steps: 10,
      });
      await page.mouse.up();
      await painted(page);
      assert.notEqual(
        await cloud.getAttribute("data-camera"),
        before,
        "DFT cloud has an actual rotatable spatial camera",
      );
      await page.getByTestId("quantum-initial-reference").check();
      await page.getByTestId("quantum-view-section").click();
      await page.getByTestId("quantum-density-section").waitFor();
      assert.equal(
        await page
          .getByTestId("quantum-density-section")
          .getAttribute("data-alpha"),
        await host.getAttribute("data-alpha"),
      );
      await page.getByTestId("quantum-view-3d").click();
      await cloud.waitFor();
      return;
    }
    case "hf": {
      const a = await number(host, "data-occupation-a"),
        b = await number(host, "data-occupation-b");
      assert.ok(
        Math.abs(a + b - 2) < 1e-10,
        "The two HF sites retain two electrons",
      );
      await page.getByTestId("hf-site-b").click();
      assert.equal(await host.getAttribute("data-selected-site"), "B");
      await page.getByTestId("hf-site-inspection").waitFor();
      return;
    }
    case "md": {
      await page.getByTestId("spatial-compare-start").check();
      assert.equal(await host.getAttribute("data-compare-start"), "true");
      assert.ok(
        (await number(host, "data-rms-offset")) > 0,
        "The whole lattice has moved relative to its initial arrangement",
      );
      assert.ok((await number(host, "data-offset-segments")) > 0);
      return;
    }
    case "phase-field": {
      await page.getByTestId("spatial-wireframe").click();
      assert.equal(await host.getAttribute("data-wireframe"), "true");
      const energy = Number(
        (
          await page.getByTestId("spatial-energy-remaining").innerText()
        ).replace(/[^0-9.]/g, ""),
      );
      assert.ok(
        energy <= 100 && energy > 0,
        "Phase-field relaxation reduces the displayed free energy",
      );
      await page.getByTestId("spatial-surface").click();
      assert.equal(await host.getAttribute("data-wireframe"), "false");
      return;
    }
    case "dd": {
      const area = await number(host, "data-swept-area");
      assert.ok(area > 0, "Dislocation sweeps nonzero area after evolving");
      await page.getByTestId("dd-show-force").uncheck();
      assert.equal(await page.getByTestId("dd-show-force").isChecked(), false);
      await page.getByTestId("dd-inspect-position").fill("16");
      return;
    }
    case "kmc": {
      assert.ok((await number(host, "data-hops")) > 0);
      assert.ok(
        (await number(host, "data-waiting-time")) > 0,
        "A KMC event advances a physical clock",
      );
      await page.getByTestId("kmc-show-path").uncheck();
      await page.getByTestId("kmc-show-candidates").uncheck();
      return;
    }
    case "crystal-plasticity": {
      await page.getByTestId("lab-preset-1").click();
      await runTo(page, 56);
      assert.ok(
        (await number(host, "data-active-grains")) > 0,
        "Sufficient load activates slip in favorably oriented grains",
      );
      await page.getByTestId("cp-grain-select").selectOption("0");
      const nearAxis = await number(host, "data-selected-resolved");
      await page.getByTestId("cp-grain-select").selectOption("1");
      const tilted = await number(host, "data-selected-resolved");
      assert.notEqual(
        tilted,
        nearAxis,
        "Selected orientations have distinct resolved stresses under the same axial load",
      );
      await page.getByTestId("cp-show-orientation").uncheck();
      return;
    }
    case "constitutive": {
      const elastic = await number(host, "data-elastic-strain");
      const viscous = await number(host, "data-viscous-strain");
      assert.ok(elastic < 0.02 && viscous > 0);
      assert.ok(
        Math.abs(elastic + viscous - 0.02) < 1e-10,
        "Spring and dashpot partition a fixed total extension",
      );
      await page.getByTestId("maxwell-select-dashpot").click();
      await page.getByTestId("maxwell-select-spring").click();
      return;
    }
    case "fem": {
      await page.getByTestId("fem-node-select").fill("0");
      assert.equal(
        await number(host, "data-displacement"),
        0,
        "Fixed node has zero displacement",
      );
      await page.getByTestId("fem-node-select").fill("20");
      assert.ok(
        (await number(host, "data-displacement")) > 0,
        "Loaded end stretches",
      );
      await page.getByTestId("fem-show-mesh").uncheck();
      await page.getByTestId("fem-show-reference").uncheck();
      return;
    }
    case "fdm": {
      await page.getByTestId("heat-probe-x").fill("0");
      await page.getByTestId("heat-probe-y").fill("0");
      assert.equal(
        await number(host, "data-probe-temperature"),
        0,
        "Cold boundary stays zero",
      );
      await page.getByTestId("heat-probe-x").fill("16");
      await page.getByTestId("heat-probe-y").fill("16");
      assert.ok(
        (await number(host, "data-probe-temperature")) > 0,
        "Probe reads the hot interior",
      );
      await page.getByTestId("heat-plate").focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(
        await number(host, "data-probe-x"),
        17,
        "Keyboard moves the temperature probe",
      );
      await page.getByTestId("heat-show-grid").check();
      return;
    }
  }
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
  await mkdir("test-results", { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(base);
  for (const locale of ["zh", "en"]) {
    await language(page, locale);
    for (const id of methods) {
      const host = await enter(page, id);
      assert.equal(
        await page.locator("main .katex:visible").count(),
        0,
        id + ": visual entry without math prerequisites",
      );
      const details = page.getByTestId("lab-numerical-details");
      if (await details.count())
        assert.equal(
          await details.evaluate((node) => node.open),
          false,
          "Numerical plot is available on request",
        );
      const resultAttribute = {
        dft: "data-alpha",
        hf: "data-occupation-a",
        dd: "data-max-bow",
        kmc: "data-vacancy",
        "crystal-plasticity": "data-selected-resolved",
        constitutive: "data-stress",
        fem: "data-displacement",
        fdm: "data-peak",
        md: "data-z-spread",
        "phase-field": "data-isosurface-vertices",
      }[id];
      await painted(page);
      const beforeResult = await host.getAttribute(resultAttribute);
      assert.notEqual(
        beforeResult,
        null,
        `${id}: scientific scene observable present`,
      );
      await step(page, 3);
      assert.notEqual(
        await host.getAttribute(resultAttribute),
        beforeResult,
        `${id}: scene responds to actual simulated evolution`,
      );
      await inspectLocalControl(page, id, host);
      await noOverflow(page, `${id}/${locale}/desktop`);
      if (locale === "en")
        assert.doesNotMatch(
          await page.locator(".simulation-lab").innerText(),
          /[\u3400-\u9fff]/,
        );
      await host.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/scene-${id}-${locale}.png` });
      // Both entry points expose the same material observation, not an old chart-only lab.
      await page.locator("#tab-lab").click();
      await scene(page, id).waitFor();
      await reset(page);
      assert.match(
        await page.locator(".lab-step").innerText(),
        locale === "zh" ? /0 步/ : /0 steps/,
      );
      console.log(
        `PASS material scene ${id}/${locale}: default picture, scientific readouts, local interaction and full-lab entry.`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ["zh", "en"]) {
    await language(page, locale);
    for (const id of methods) {
      const host = await enter(page, id);
      await step(page);
      await noOverflow(page, `${id}/${locale}/mobile`);
      if (["dft", "kmc", "constitutive", "fem", "fdm"].includes(id)) {
        await host.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `test-results/scene-${id}-mobile-${locale}.png`,
        });
      }
    }
  }
  await enter(page, "hf");
  await page.getByTestId("hf-site-b").click();
  await step(page, 2);
  const hfState = await page
    .getByTestId("phenomenon-hf")
    .getAttribute("data-occupation-a");
  await language(page, "zh");
  assert.equal(
    await page.getByTestId("phenomenon-hf").getAttribute("data-selected-site"),
    "B",
  );
  assert.equal(
    await page.getByTestId("phenomenon-hf").getAttribute("data-occupation-a"),
    hfState,
  );
  await enter(page, "fdm");
  await page.getByTestId("heat-probe-x").fill("7");
  await page.getByTestId("heat-probe-y").fill("11");
  await language(page, "en");
  assert.equal(
    await page.getByTestId("phenomenon-fdm").getAttribute("data-probe-x"),
    "7",
  );
  assert.equal(
    await page.getByTestId("phenomenon-fdm").getAttribute("data-probe-y"),
    "11",
  );
  const fallback = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  fallback.on("pageerror", (error) => errors.push(error.message));
  await fallback.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).includes("webgl")
        ? null
        : getContext.call(this, type, ...args);
    };
  });
  await enter(fallback, "dft");
  await fallback.getByTestId("quantum-density-section").waitFor();
  const alpha = await fallback
    .getByTestId("phenomenon-dft")
    .getAttribute("data-alpha");
  await step(fallback);
  assert.notEqual(
    await fallback.getByTestId("phenomenon-dft").getAttribute("data-alpha"),
    alpha,
    "Without WebGL, the analytic section still follows optimization",
  );
  await noOverflow(fallback, "DFT fallback");
  await fallback.close();
  assert.deepEqual(errors, [], "No browser runtime errors in material scenes");
  assert.deepEqual(
    failures,
    [],
    "All scene assets resolve under the Pages path",
  );
  console.log(
    "PASS all ten material scenes in both languages on desktop and mobile.",
  );
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
