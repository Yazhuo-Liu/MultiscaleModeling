import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";

// Exercise the built artifact under its real Pages prefix. Geometry, actual
// rendered pixels, and exported physical coordinates are checked independently.
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
const errors = [];
const failures = [];
let browser;

function observe(page) {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) =>
    failures.push(`${request.url()}: ${request.failure()?.errorText}`),
  );
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
}
async function language(page, locale) {
  const expected = locale === "zh" ? "zh-CN" : "en";
  if ((await page.locator("html").getAttribute("lang")) !== expected)
    await page
      .getByRole("button", {
        name: locale === "zh" ? "Switch to Chinese" : "Switch to English",
        exact: true,
      })
      .click();
  await page.waitForFunction(
    (value) => document.documentElement.lang === value,
    expected,
  );
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
    `${label}: no page overflow`,
  );
}
async function orbitalReady(page, orbital, representation = "surface") {
  await page.waitForFunction(
    ({ orbital, representation }) => {
      const host = document.querySelector(".orbital-scene");
      return (
        host?.dataset.ready === "true" &&
        host.dataset.orbital === orbital &&
        host.dataset.representation === representation &&
        Number(
          host.dataset[
            representation === "surface" ? "surfaceVertices" : "sampleCount"
          ],
        ) > 100
      );
    },
    { orbital, representation },
    { timeout: 20000 },
  );
  await page.locator(".orbital-scene").scrollIntoViewIfNeeded();
  await painted(page);
}
async function chooseOrbital(page, value) {
  await page
    .locator(".orbital-shape-controls select")
    .first()
    .selectOption(value);
  await orbitalReady(page, value);
}
async function geometryBounds(page) {
  const bounds = JSON.parse(
    await page.locator(".orbital-scene").getAttribute("data-bounds"),
  );
  assert.ok(
    bounds.min.every(Number.isFinite) && bounds.max.every(Number.isFinite),
  );
  for (let axis = 0; axis < 3; axis++)
    assert.ok(
      bounds.max[axis] - bounds.min[axis] > 0.01,
      `orbital extends along ${"xyz"[axis]}`,
    );
  return bounds;
}
async function rotate(page, hostSelector) {
  const host = page.locator(hostSelector);
  const canvas = host.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  await painted(page);
  const before = await canvas.screenshot();
  const pose = await host.getAttribute("data-camera");
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.6, {
    steps: 12,
  });
  await page.mouse.up();
  await page.waitForTimeout(180);
  assert.notEqual(
    await host.getAttribute("data-camera"),
    pose,
    "Orbit controls change the real camera",
  );
  assert.notDeepEqual(
    await canvas.screenshot(),
    before,
    "The rendered spatial view changes after rotation",
  );
}
async function resetOrbitalView(page) {
  await page
    .locator(".orbital-explorer")
    .getByRole("button", {
      name: /^(复位视角|Reset view)$/,
    })
    .click();
  await page.locator(".orbital-scene").scrollIntoViewIfNeeded();
  // Visibility starts rendering on demand; allow the observer and GPU paint.
  await page.waitForTimeout(200);
}
async function openLab(page, id) {
  await page.goto(`${base}#/method/${id}`);
  await page.getByRole("tab", { name: /^(交互实验|Interactive lab)$/ }).click();
  await page.locator('.simulation-lab[data-model-dimension="3"]').waitFor();
  await page.locator(".lab-spatial canvas").waitFor();
  await page.locator(".lab-spatial").scrollIntoViewIfNeeded();
  await painted(page);
}
async function exportRows(page) {
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".lab-export").click();
  const download = await downloadPromise;
  const text = (await readFile(await download.path(), "utf8")).replace(
    /^\ufeff/,
    "",
  );
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line) =>
      [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((match) =>
        match[1].replaceAll('""', '"'),
      ),
    );
  assert.deepEqual(rows[0], ["type", "index", "x", "y", "z", "value"]);
  return rows.slice(1);
}
async function stepLab(page, times = 1) {
  for (let i = 0; i < times; i++)
    await page
      .getByRole("button", { name: /^(前进一步|Step forward)$/ })
      .click();
  await painted(page);
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
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "reduce",
  });
  observe(page);
  await page.goto(`${base}#/foundation/atomic-orbitals`);
  await page.locator(".orbital-explorer").waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.locator(".orbital-explorer").getAttribute("data-orbital-level"),
    "shape",
  );
  assert.equal(
    await page.locator(".orbital-explorer").getAttribute("data-orbital-view"),
    "3d",
  );
  await orbitalReady(page, "2pz");
  await geometryBounds(page);
  await rotate(page, ".orbital-scene");
  await resetOrbitalView(page);
  await page
    .locator(".orbital-scene")
    .screenshot({ path: "test-results/true3d-hydrogen-2pz.png" });

  const thresholdBefore = await page
    .locator(".orbital-scene")
    .getAttribute("data-density-threshold");
  const extentBefore = await geometryBounds(page);
  const thresholdImage = await page
    .locator(".orbital-scene canvas")
    .screenshot();
  await page.getByTestId("orbital-density").fill("-1");
  await page.waitForFunction(
    (before) =>
      document.querySelector(".orbital-scene")?.dataset.densityThreshold !==
      before,
    thresholdBefore,
  );
  await painted(page);
  assert.notDeepEqual(
    await geometryBounds(page),
    extentBefore,
    "A density threshold changes the three-dimensional level surface",
  );
  assert.notDeepEqual(
    await page.locator(".orbital-scene canvas").screenshot(),
    thresholdImage,
  );

  // A p_z node is a full xy plane: the actual sampled section vanishes at z=0.
  await page.getByTestId("orbital-slice-enabled").check();
  await page.getByTestId("orbital-slice-axis").selectOption("z");
  await page.getByTestId("orbital-slice-position").fill("0");
  await painted(page);
  const nodalRange = JSON.parse(
    await page.locator(".orbital-scene").getAttribute("data-slice-range"),
  );
  assert.ok(
    nodalRange[1] < 1e-12,
    "The p_z nodal plane has zero probability density",
  );
  const nodalImage = await page.locator(".orbital-scene canvas").screenshot();
  await page.getByTestId("orbital-slice-position").fill("0.2");
  await painted(page);
  const offNodeRange = JSON.parse(
    await page.locator(".orbital-scene").getAttribute("data-slice-range"),
  );
  assert.ok(
    offNodeRange[1] > 1e-8,
    "Moving off the node reveals actual density at another spatial coordinate",
  );
  assert.notDeepEqual(
    await page.locator(".orbital-scene canvas").screenshot(),
    nodalImage,
  );
  await page.getByTestId("orbital-cutaway").check();
  await painted(page);
  assert.equal(
    await page.locator(".orbital-scene").getAttribute("data-cutaway"),
    "true",
  );

  // Language changes must preserve both the numerical settings and renderer.
  await page.locator(".orbital-scene canvas").evaluate((canvas) => {
    window.__spatialCanvas = canvas;
  });
  const camera = await page
    .locator(".orbital-scene")
    .getAttribute("data-camera");
  const settings = await page
    .locator(".orbital-explorer input, .orbital-explorer select")
    .evaluateAll((nodes) => nodes.map((node) => [node.value, node.checked]));
  await language(page, "en");
  await painted(page);
  assert.equal(
    await page
      .locator(".orbital-scene canvas")
      .evaluate((canvas) => canvas === window.__spatialCanvas),
    true,
  );
  assert.equal(
    await page.locator(".orbital-scene").getAttribute("data-camera"),
    camera,
  );
  assert.deepEqual(
    await page
      .locator(".orbital-explorer input, .orbital-explorer select")
      .evaluateAll((nodes) => nodes.map((node) => [node.value, node.checked])),
    settings,
  );
  const english = await page.locator(".orbital-explorer").innerText();
  assert.doesNotMatch(english, /[\u3400-\u9fff]/);
  await page.getByTestId("orbital-cutaway").uncheck();
  await page.getByTestId("orbital-slice-enabled").uncheck();

  for (const orbital of ["1s", "2s", "2px", "2py", "2pz"]) {
    await chooseOrbital(page, orbital);
    await geometryBounds(page);
    if (orbital === "2s") {
      const shells = JSON.parse(
        await page
          .locator(".orbital-scene")
          .getAttribute("data-spherical-shells"),
      );
      assert.ok(
        shells.length >= 2,
        "The 2s surface resolves inner and outer radial regions",
      );
    }
  }
  await page.getByTestId("orbital-representation-cloud").click();
  await orbitalReady(page, "2pz", "cloud");
  await geometryBounds(page);
  assert.ok(
    Number(
      await page.locator(".orbital-scene").getAttribute("data-sample-count"),
    ) >= 3000,
  );
  await page.getByTestId("orbital-representation-surface").click();

  await page
    .locator(".orbital-atom-switch")
    .getByRole("button", { name: /Fe/ })
    .click();
  for (const orbital of ["dz2", "dx2-y2", "dxy", "dxz", "dyz", "4s"]) {
    await chooseOrbital(page, orbital);
    await geometryBounds(page);
    assert.match(
      await page.locator(".orbital-explorer").innerText(),
      /Slater|screen/i,
      "Fe is explicitly a screened teaching approximation",
    );
    if (orbital === "dz2") {
      await rotate(page, ".orbital-scene");
      await resetOrbitalView(page);
      await page
        .locator(".orbital-scene")
        .screenshot({ path: "test-results/true3d-iron-3dz2.png" });
    }
    if (orbital === "4s") {
      const shells = JSON.parse(
        await page
          .locator(".orbital-scene")
          .getAttribute("data-spherical-shells"),
      );
      assert.ok(
        shells.length >= 4,
        "Fe 4s resolves multiple radial regions instead of a coarse solid sphere",
      );
      await page.getByTestId("orbital-cutaway").check();
      await page
        .locator(".orbital-scene")
        .screenshot({ path: "test-results/true3d-iron-4s-cutaway.png" });
    }
  }
  assert.equal(await page.locator(".katex-error").count(), 0);
  console.log(
    "PASS true 3D orbitals: H s/p and Fe d/4s surfaces, radial shells, probability cloud, physical node/section, threshold, rotation and language persistence.",
  );

  await language(page, "zh");
  await openLab(page, "md");
  let points = (await exportRows(page)).filter((row) => row[0] === "point");
  assert.equal(points.length, 108);
  for (const axis of [2, 3, 4])
    assert.ok(
      new Set(points.map((row) => row[axis])).size > 2,
      "Initial particles occupy a genuine spatial crystal",
    );
  const initial = points.map((row) => row.slice(2, 5).map(Number));
  await stepLab(page, 6);
  points = (await exportRows(page)).filter((row) => row[0] === "point");
  for (const axis of [0, 1, 2])
    assert.ok(
      points.some(
        (row, i) => Math.abs(Number(row[axis + 2]) - initial[i][axis]) > 1e-6,
      ),
      `MD evolves physical ${"xyz"[axis]} positions`,
    );
  const stepText = await page.locator(".lab-step").textContent();
  await page.locator(".lab-mode button").first().click();
  await page.locator(".lab-canvas").waitFor();
  assert.equal(
    await page.locator(".lab-step").textContent(),
    stepText,
    "Projection is a view of the same 3D state",
  );
  await page.locator(".lab-mode button").nth(1).click();
  await rotate(page, ".lab-spatial");
  await page
    .locator(".lab-spatial")
    .screenshot({ path: "test-results/true3d-md.png" });
  await page.getByTestId("lab-dimension-2").click();
  await page.locator('.simulation-lab[data-model-dimension="2"]').waitFor();
  const planar = (await exportRows(page)).filter((row) => row[0] === "point");
  assert.equal(planar.length, 36);
  assert.ok(planar.every((row) => Number(row[4]) === 0));
  assert.match(await page.locator(".lab-step").textContent(), /0 步/);
  await page.getByTestId("lab-dimension-3").click();
  assert.match(await page.locator(".lab-step").textContent(), /0 步/);
  assert.equal(
    (await exportRows(page)).filter((row) => row[0] === "point").length,
    108,
  );

  await openLab(page, "phase-field");
  await page.waitForFunction(
    () =>
      Number(
        document.querySelector(".lab-spatial")?.dataset.isosurfaceVertices,
      ) > 100,
  );
  assert.equal(
    await page.getByTestId("lab-volume-slice-enabled").isChecked(),
    false,
    "A new volume shows the full spatial interface, without a slice covering it",
  );
  await page.locator(".lab-spatial").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page
    .locator(".lab-spatial")
    .screenshot({ path: "test-results/true3d-phase-field.png" });
  await page.getByTestId("lab-volume-slice-enabled").check();
  assert.equal(
    await page.locator(".lab-spatial").getAttribute("data-show-slice"),
    "true",
  );
  assert.ok(
    Number(
      await page
        .locator(".lab-spatial")
        .getAttribute("data-isosurface-vertices"),
    ) > 100,
  );
  await page.getByTestId("lab-volume-slice-enabled").uncheck();
  assert.equal(
    await page.locator(".lab-spatial").getAttribute("data-show-slice"),
    "false",
  );
  const volume = (await exportRows(page)).filter((row) => row[0] === "volume");
  assert.equal(volume.length, 24 ** 3);
  assert.equal(new Set(volume.map((row) => row[4])).size, 24);
  const layer0 = volume.slice(0, 24 ** 2).map((row) => Number(row[5]));
  const layer5 = volume
    .slice(5 * 24 ** 2, 6 * 24 ** 2)
    .map((row) => Number(row[5]));
  assert.ok(
    layer0.some((value, i) => Math.abs(value - layer5[i]) > 1e-4),
    "Volume z layers are independent, not a copied 2D field",
  );
  await stepLab(page, 3);
  const evolvedVolume = (await exportRows(page)).filter(
    (row) => row[0] === "volume",
  );
  assert.ok(
    evolvedVolume.some(
      (row, i) => Math.abs(Number(row[5]) - Number(volume[i][5])) > 1e-6,
    ),
  );
  await page.locator(".lab-mode button").first().click();
  await page.getByTestId("lab-volume-slice").fill("3");
  await painted(page);
  const slice3 = await page.locator(".lab-canvas").screenshot();
  await page.getByTestId("lab-volume-slice").fill("10");
  await painted(page);
  assert.notDeepEqual(
    await page.locator(".lab-canvas").screenshot(),
    slice3,
    "Moving through z reveals a different physical cross-section",
  );
  await page.locator(".lab-mode button").nth(1).click();
  await rotate(page, ".lab-spatial");
  await page
    .locator(".lab-spatial")
    .screenshot({ path: "test-results/true3d-phase-field-cutaway.png" });
  const slice = await page.getByTestId("lab-volume-slice").inputValue();
  await language(page, "en");
  assert.equal(await page.getByTestId("lab-volume-slice").inputValue(), slice);
  assert.doesNotMatch(
    await page.locator(".simulation-lab").innerText(),
    /[\u3400-\u9fff]/,
  );
  console.log(
    "PASS true 3D solvers: exported xyz motion, 108 spatial particles, dimension reset, 24³ independently evolving volume and physical z sections.",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "method/md",
    "method/phase-field",
    "foundation/atomic-orbitals",
  ]) {
    await page.goto(`${base}#/${route}`);
    if (route.startsWith("method/"))
      await page
        .getByRole("tab", { name: "Interactive lab", exact: true })
        .click();
    else await orbitalReady(page, "2pz");
    await page.evaluate(() => document.fonts.ready);
    await noOverflow(page, route);
  }
  await resetOrbitalView(page);
  await page
    .locator(".orbital-scene")
    .screenshot({ path: "test-results/true3d-orbital-mobile-scene.png" });
  await page.screenshot({ path: "test-results/true3d-orbital-mobile.png" });

  const fallback = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  observe(fallback);
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).includes("webgl")
        ? null
        : original.call(this, type, ...args);
    };
  });
  await fallback.goto(`${base}#/foundation/atomic-orbitals`);
  await fallback
    .locator('.orbital-explorer[data-orbital-view="2d"] .orbital-slice')
    .waitFor();
  await noOverflow(fallback, "Orbital fallback");
  await fallback.goto(`${base}#/method/phase-field`);
  await fallback.getByRole("tab", { name: "交互实验", exact: true }).click();
  await fallback.locator(".lab-canvas").waitFor();
  assert.equal(
    await fallback
      .locator(".simulation-lab")
      .getAttribute("data-model-dimension"),
    "3",
    "Rendering fallback preserves the 3D computation",
  );
  await fallback.getByTestId("lab-volume-slice").fill("5");
  await noOverflow(fallback, "Volume fallback");
  await fallback.close();
  await page.goto(`${base}#/foundations`);
  await page.locator(".foundation-card").first().waitFor();
  assert.equal(await page.locator(".orbital-scene, .lab-spatial").count(), 0);
  assert.deepEqual(errors, [], "No browser runtime errors");
  assert.deepEqual(failures, [], "All static assets loaded");
  console.log(
    "PASS true 3D delivery: mobile layout, no-WebGL sections retaining 3D data, route cleanup and no browser/resource failures.",
  );
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
