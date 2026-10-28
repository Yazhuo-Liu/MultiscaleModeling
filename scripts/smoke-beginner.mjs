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
const methods = [
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
const foundations = [
  "why-multiscale",
  "scales-and-limits",
  "error-propagation",
  "electronic-structure",
  "atomic-orbitals",
  "bonding",
  "band-structure",
  "formation-energy",
];
const errors = [],
  failures = [];
let browser;
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
async function overflow(page, context) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    `${context}: no document overflow`,
  );
}
async function entry(page, route, locale) {
  await page.goto(`${base}#/${route}`);
  await page.locator(".beginner-intro").waitFor();
  if (route.startsWith("method/"))
    await page
      .locator(route.endsWith("/mc") ? ".vacancy-demo" : ".simulation-lab")
      .waitFor();
  else if (route.endsWith("/atomic-orbitals"))
    await page.locator(".orbital-explorer").waitFor();
  else if (
    ["error-propagation", "band-structure", "formation-energy"].some((id) =>
      route.endsWith(`/${id}`),
    )
  )
    await page.locator(".foundation-lab").waitFor();
  assert.equal(
    await page.locator(".beginner-step").count(),
    3,
    `${route}: three concrete learning steps`,
  );
  assert.equal(
    await page.locator("main .katex:visible").count(),
    0,
    `${route}: first explanation does not require equations`,
  );
  assert.equal(
    await page
      .locator(
        ".equation-card:visible, .theory-formula:visible, .derivation-path:visible, .foundation-derivation:visible",
      )
      .count(),
    0,
    `${route}: advanced mathematics is opt-in`,
  );
  assert.ok(
    (await page.locator(".beginner-question").innerText()).length > 8,
    `${route}: a concrete starting question`,
  );
  assert.ok(
    (await page.locator(".beginner-takeaway").innerText()).length > 10,
    `${route}: a plain-language takeaway`,
  );
  if (locale === "en")
    assert.doesNotMatch(
      await page.locator("main").innerText(),
      /[\u3400-\u9fff]/,
      `${route}: fully translated entry`,
    );
  await overflow(page, route);
}
async function painted(page) {
  await page.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done)),
      ),
  );
}
async function mcReady(page) {
  await page.locator(".vacancy-demo").waitFor();
  await page.locator(".vacancy-scene").scrollIntoViewIfNeeded();
  await page.locator('.vacancy-scene[data-ready="true"]').waitFor();
  await painted(page);
}
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
      await entry(page, `method/${id}`, locale);
      assert.equal(
        await page.locator("#tab-intro").getAttribute("aria-selected"),
        "true",
      );
      await page
        .locator(".beginner-actions")
        .getByRole("button", { name: /下一步|Next:/ })
        .click();
      assert.equal(
        await page.locator("#tab-theory").getAttribute("aria-selected"),
        "true",
        `${id}: guided next step opens model`,
      );
      assert.ok((await page.locator(".concept-card").count()) >= 3);
      assert.ok((await page.locator(".equation-card .katex").count()) > 0);
      await page.locator("#tab-advanced").click();
      await page.locator(".derivation-stage").first().waitFor();
      assert.equal(
        await page.locator(".derivation-stage").count(),
        3,
        `${id}: complete derivation remains available`,
      );
      assert.equal(await page.locator(".katex-error").count(), 0);
      await overflow(page, `${id} advanced`);
      await page.locator("#tab-lab").click();
      if (id === "mc") await page.getByTestId("mc-example-ising").click();
      await page.getByTestId("lab-preset-1").click();
      await openNumericalView(page);
      await page.locator(".lab-viewport canvas").waitFor();
      assert.match(
        await page.locator(".lab-step").innerText(),
        locale === "zh" ? /0 步/ : /0 steps/,
      );
      const material = page.getByTestId(`lab-material-${id}`);
      let materialBefore;
      if (await material.count()) {
        await page
          .getByRole("button", { name: /^(前进一步|Step forward)$/ })
          .click();
        materialBefore = await material.innerHTML();
      }
      const values = await page
        .locator(".lab-controls input[type=range]")
        .evaluateAll((nodes) => nodes.map((node) => node.value));
      await page.getByTestId("lab-preset-0").click();
      assert.notDeepEqual(
        await page
          .locator(".lab-controls input[type=range]")
          .evaluateAll((nodes) => nodes.map((node) => node.value)),
        values,
        `${id}: presets really change model inputs`,
      );
      if (materialBefore) {
        await page
          .getByRole("button", { name: /^(前进一步|Step forward)$/ })
          .click();
        assert.notEqual(
          await material.innerHTML(),
          materialBefore,
          `${id}: the material illustration responds to the chosen scenario`,
        );
      }
      if (locale === "en")
        assert.doesNotMatch(
          await page.locator(".simulation-lab").innerText(),
          /[\u3400-\u9fff]/,
          `${id}: English guided laboratory`,
        );
    }
    for (const id of foundations) {
      await entry(page, `foundation/${id}`, locale);
      assert.equal(
        await page
          .getByTestId("foundation-level-intro")
          .getAttribute("aria-selected"),
        "true",
      );
      await page
        .locator(".beginner-actions")
        .getByRole("button", { name: /下一步|Next:/ })
        .click();
      assert.equal(
        await page
          .getByTestId("foundation-level-model")
          .getAttribute("aria-selected"),
        "true",
      );
      assert.ok((await page.locator(".foundation-section").count()) >= 5);
      assert.equal(
        await page.locator(".foundation-equation-disclosure[open]").count(),
        0,
        `${id}: equations expand when requested`,
      );
      await page.getByTestId("foundation-level-advanced").click();
      assert.ok(
        (await page
          .locator(".foundation-derivation .derivation-step")
          .count()) >= 3,
      );
      assert.equal(await page.locator(".katex-error").count(), 0);
      await overflow(page, `${id} advanced`);
    }
    console.log(
      `PASS beginner progression ${locale}: all 19 chapters, concrete introductions, deliberate mathematical depth and functional experiment presets.`,
    );
  }

  await language(page, "zh");
  await page.goto(`${base}#/method/mc`);
  await page.locator("#tab-lab").click();
  await mcReady(page);
  const demo = page.locator(".vacancy-demo");
  const scene = page.locator(".vacancy-scene");
  assert.equal(await demo.getAttribute("data-running"), "false");
  assert.ok(
    Number(await scene.getAttribute("data-z-spread")) > 0,
    "MC lattice occupies all three spatial dimensions",
  );
  await page.getByTestId("vacancy-preset-free").click();
  const initialVacancy = await demo.getAttribute("data-vacancy");
  assert.equal(
    await scene.getAttribute("data-highlighted-atom"),
    "",
    "No atom is permanently highlighted at rest",
  );
  assert.doesNotMatch(
    await demo.innerText(),
    /tracked atom|追踪原子|purple|紫色/i,
  );

  await page.getByTestId("vacancy-step").click();
  await page.waitForFunction(() => {
    const node = document.querySelector(".vacancy-demo");
    const fraction = Number(node?.dataset.progress);
    return Number(node?.dataset.attempts) === 1 && fraction > 0 && fraction < 1;
  });
  await page.waitForFunction(
    () => document.querySelector(".vacancy-scene")?.dataset.highlightedAtom,
  );
  const [movingVacancy, movingAtom] = await scene.evaluate((node) => [
    JSON.parse(node.dataset.vacancyDisplay),
    JSON.parse(node.dataset.exchangeAtomDisplay),
  ]);
  const origin = JSON.parse(initialVacancy);
  const destination = JSON.parse(await demo.getAttribute("data-vacancy"));
  for (let axis = 0; axis < 3; axis++)
    assert.ok(
      Math.abs(
        movingVacancy[axis] +
          movingAtom[axis] -
          origin[axis] -
          destination[axis],
      ) < 1e-6,
      "Atom and vacancy move in opposite directions during an exchange",
    );
  const midway = await scene.locator("canvas").screenshot();
  await page.waitForFunction(
    () =>
      Number(document.querySelector(".vacancy-demo")?.dataset.progress) === 1,
  );
  assert.notDeepEqual(
    await scene.locator("canvas").screenshot(),
    midway,
    "A jump visibly moves through intermediate positions",
  );
  assert.notEqual(
    await demo.getAttribute("data-vacancy"),
    initialVacancy,
    "Vacancy relocates after an accepted swap",
  );
  assert.deepEqual(
    JSON.parse(await scene.getAttribute("data-exchange-atom-display")),
    JSON.parse(initialVacancy),
    "The exchanging atom arrives at the previous vacancy site",
  );
  assert.equal(
    await scene.getAttribute("data-highlighted-atom"),
    "",
    "Atom highlight ends with its hop",
  );
  assert.equal(await demo.getAttribute("data-accepted"), "1");
  const pose = await scene.getAttribute("data-camera");
  const picture = await scene.locator("canvas").screenshot();
  const bounds = await scene.boundingBox();
  await page.mouse.move(
    bounds.x + bounds.width * 0.45,
    bounds.y + bounds.height * 0.5,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width * 0.7,
    bounds.y + bounds.height * 0.6,
    { steps: 10 },
  );
  await page.mouse.up();
  await painted(page);
  assert.notEqual(
    await scene.getAttribute("data-camera"),
    pose,
    "Dragging rotates the actual 3D lattice",
  );
  assert.notDeepEqual(await scene.locator("canvas").screenshot(), picture);
  const attempts = await demo.getAttribute("data-attempts");
  const vacancy = await demo.getAttribute("data-vacancy");
  await scene.locator("canvas").evaluate((canvas) => {
    window.__beginnerMCCanvas = canvas;
  });
  await language(page, "en");
  assert.equal(await demo.getAttribute("data-attempts"), attempts);
  assert.equal(await demo.getAttribute("data-vacancy"), vacancy);
  assert.equal(
    await scene
      .locator("canvas")
      .evaluate((canvas) => canvas === window.__beginnerMCCanvas),
    true,
    "Language switch preserves the renderer and sampling state",
  );
  assert.doesNotMatch(await demo.innerText(), /[\u3400-\u9fff]/);
  assert.match(
    await demo.innerText(),
    /physical time|real time/i,
    "MC attempts are not labeled as elapsed physical time",
  );
  await scene.scrollIntoViewIfNeeded();
  await page.getByTestId("vacancy-play").click();
  await page.waitForFunction(
    () =>
      Number(document.querySelector(".vacancy-demo")?.dataset.attempts) >= 3,
  );
  await page.getByTestId("vacancy-play").click();
  const paused = await demo.getAttribute("data-attempts");
  await page.waitForTimeout(800);
  assert.equal(
    await demo.getAttribute("data-attempts"),
    paused,
    "Pause stops new sampling attempts",
  );
  await scene.screenshot({ path: "test-results/beginner-mc-lattice-3d.png" });
  await page.getByTestId("vacancy-view-2d").click();
  await scene.locator("canvas").waitFor();
  await page.getByTestId("vacancy-reset").click();
  assert.equal(await demo.getAttribute("data-attempts"), "0");
  assert.equal(await demo.getAttribute("data-accepted"), "0");
  await page.getByTestId("vacancy-view-3d").click();
  await mcReady(page);
  console.log(
    "PASS MC visual diffusion: spatial lattice, interpolated atom/vacancy exchange, camera rotation, play/pause, reset, 2D slice and bilingual state persistence.",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ["zh", "en"]) {
    await language(page, locale);
    for (const id of methods) await entry(page, `method/${id}`, locale);
    for (const id of foundations) await entry(page, `foundation/${id}`, locale);
    await page.goto(`${base}#/method/mc`);
    await page.locator("#tab-lab").click();
    await mcReady(page);
    await overflow(page, `${locale} mobile vacancy demo`);
    await page.screenshot({
      path: `test-results/beginner-mc-mobile-${locale}.png`,
    });
    await page.goto(`${base}#/method/fem`);
    await page.locator(".beginner-intro").waitFor();
    await page.screenshot({
      path: `test-results/beginner-entry-mobile-${locale}.png`,
      fullPage: true,
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}#/method/mc`);
  await page.locator("#tab-lab").click();
  await mcReady(page);
  assert.equal(
    await demo.getAttribute("data-running"),
    "false",
    "Reduced-motion users choose when movement begins",
  );
  await page.getByTestId("vacancy-step").click();
  await page.waitForFunction(
    () =>
      Number(document.querySelector(".vacancy-demo")?.dataset.attempts) === 1,
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
  await fallback.goto(`${base}#/method/mc`);
  await fallback.locator(".vacancy-fallback").waitFor();
  const fallbackVacancy = await fallback
    .locator(".vacancy-demo")
    .getAttribute("data-vacancy");
  await fallback.getByTestId("vacancy-step").click();
  assert.equal(
    await fallback.locator(".vacancy-demo").getAttribute("data-attempts"),
    "1",
  );
  assert.notEqual(
    await fallback.locator(".vacancy-demo").getAttribute("data-vacancy"),
    fallbackVacancy,
    "The no-WebGL slice retains functional vacancy exchange",
  );
  await overflow(fallback, "MC mobile WebGL fallback");
  await fallback.close();
  assert.deepEqual(errors, [], "No browser runtime errors");
  assert.deepEqual(failures, [], "All production assets resolve");
  console.log(
    "PASS all bilingual beginner entries on mobile, reduced motion and static Pages delivery.",
  );
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
