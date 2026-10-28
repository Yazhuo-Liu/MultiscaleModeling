import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

// Verify the production site under its actual Pages subdirectory.
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
const stages = ["object", "crack", "grains", "dislocations", "atoms"];
const errors = [];
const failures = [];
let browser;

function observe(page) {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (req) =>
    failures.push(`${req.url()}: ${req.failure()?.errorText}`),
  );
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
}
function journey(page) {
  return page.locator(".scale-journey");
}
async function position(page) {
  return Number(await journey(page).getAttribute("data-position"));
}
async function at(page, value) {
  await page.waitForFunction(
    (expected) => {
      const element = document.querySelector(".scale-journey");
      return (
        element &&
        Number(element.dataset.position) === expected &&
        (element.dataset.playing === "true" ||
          element.dataset.active === "false")
      );
    },
    value,
    { timeout: 20000 },
  );
}
async function status(page, attribute, value) {
  await page.waitForFunction(
    ({ attribute, value }) =>
      document.querySelector(".scale-journey")?.getAttribute(attribute) ===
      value,
    { attribute, value },
    { timeout: 8000 },
  );
}
async function choose(page, stage) {
  await page.getByTestId(`journey-stage-${stage}`).click();
  await at(page, stages.indexOf(stage));
  assert.equal(await journey(page).getAttribute("data-stage"), stage);
}
async function noOverflow(page, label) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
    `${label}: page-wide overflow`,
  );
}
async function frozen(page, label) {
  const before = await position(page);
  // A brief real-time observation can fail if an unwanted animation keeps running.
  await page.waitForTimeout(350);
  assert.equal(
    await position(page),
    before,
    `${label}: progress must remain frozen`,
  );
}
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
    (expected) => document.documentElement.lang === expected,
    expected,
  );
}
async function inspectLanguage(page, locale) {
  const text = await journey(page).innerText();
  assert.ok(
    text.length > 50,
    "The journey includes an explanation and controls",
  );
  if (locale === "en")
    assert.doesNotMatch(
      text,
      /[\u3400-\u9fff]/,
      "The English journey has no untranslated Chinese",
    );
  assert.ok(
    (await page.locator(".journey-caption").textContent()).trim().length > 15,
    "Each stage has a substantive caption",
  );
}

try {
  browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
  await mkdir("test-results", { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "no-preference",
  });
  observe(page);
  await page.goto(base);
  await journey(page).waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await journey(page).getAttribute("data-playing"),
    "true",
    "Normal-motion tour starts automatically",
  );
  await journey(page).scrollIntoViewIfNeeded();
  await status(page, "data-active", "true");
  // Observe real elapsed-time rendering, rather than only setting slider values.
  // Restart through the visible controls so font loading cannot consume this zoom.
  await page.getByTestId("journey-reset").click();
  await at(page, 0);
  await page.getByTestId("journey-play").click();
  assert.equal(
    await page.locator(".journey-caption").getAttribute("aria-live"),
    "off",
    "Continuous automatic playback does not repeatedly announce changing captions",
  );
  const growth = await page.evaluate(async () => {
    const samples = [];
    const started = performance.now();
    let sampled = -Infinity;
    return await new Promise((resolve, reject) => {
      const sample = (time) => {
        const host = document.querySelector(".scale-journey");
        const position = Number(host?.dataset.position);
        const frame = document.querySelector(".journey-tracking-frame");
        if (
          position > 0.02 &&
          position < 0.9 &&
          frame &&
          time - sampled >= 400
        ) {
          const bounds = frame.getBoundingClientRect();
          samples.push({
            position,
            width: bounds.width,
            height: bounds.height,
            sceneWidth: document
              .querySelector(".journey-scene-out")
              .getBoundingClientRect().width,
            scale: document.querySelector(".journey-scale strong")?.textContent,
          });
          sampled = time;
          if (samples.length === 4) return resolve(samples);
        }
        if (time - started > 8000)
          return reject(new Error("No continuous first zoom was rendered"));
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
  for (let i = 1; i < growth.length; i++) {
    assert.ok(growth[i].position > growth[i - 1].position);
    assert.ok(
      growth[i].width > growth[i - 1].width + 2 &&
        growth[i].height > growth[i - 1].height + 1,
      "The same visible selection frame grows on screen over successive timed frames",
    );
  }
  assert.ok(
    growth.at(-1).width > growth[0].width * 1.5,
    "Actual enlargement is substantial enough to see",
  );
  assert.ok(
    growth.at(-1).sceneWidth > growth[0].sceneWidth * 1.5,
    "The metal specimen itself enlarges with the tracked selection",
  );
  assert.ok(
    new Set(growth.map((sample) => sample.scale)).size > 2,
    "The illustrative field changes continuously during the zoom",
  );
  await page.screenshot({ path: "test-results/journey-timed-zoom.png" });
  await page.getByTestId("journey-play").click();
  await status(page, "data-playing", "false");
  await frozen(page, "Pause");
  assert.equal(
    await page.locator(".journey-caption").getAttribute("aria-live"),
    "polite",
    "Paused manual exploration retains accessible caption announcements",
  );

  // Scrubbing must change the camera continuously, not simply swap captions.
  await page.getByTestId("journey-progress").fill("0.5");
  await at(page, 0.5);
  assert.equal(await page.locator(".journey-scene-out").count(), 1);
  assert.equal(await page.locator(".journey-scene-in").count(), 1);
  const frame = await page.getByTestId("journey-canvas").evaluate((svg) => {
    const outgoing = svg.querySelector(".journey-scene-out");
    const incoming = svg.querySelector(".journey-scene-in");
    const cracks = ["macro", "detail"].map((name) => {
      const path = svg.querySelector(`[data-crack-outline="${name}"]`);
      const matrix = path?.getScreenCTM();
      return {
        outline: path?.getAttribute("d"),
        matrix: matrix && [
          matrix.a,
          matrix.b,
          matrix.c,
          matrix.d,
          matrix.e,
          matrix.f,
        ],
      };
    });
    return {
      cracks,
      outgoingTransform: outgoing?.getAttribute("transform"),
      incomingTransform: incoming?.getAttribute("transform"),
      incomingOpacity: Number(
        incoming?.getAttribute("opacity") ?? getComputedStyle(incoming).opacity,
      ),
    };
  });
  assert.ok(
    frame.outgoingTransform &&
      !/^translate\(0[ ,]+0\)\s*scale\(1\)$/.test(frame.outgoingTransform),
    "The parent scene zooms into its region",
  );
  assert.ok(
    frame.incomingTransform,
    "The child scene emerges from the chosen region",
  );
  assert.ok(
    frame.incomingOpacity > 0 && frame.incomingOpacity < 1,
    "The intermediate frame blends the two physical levels",
  );
  assert.ok(frame.cracks.every((crack) => crack.outline && crack.matrix));
  assert.equal(
    frame.cracks[0].outline,
    frame.cracks[1].outline,
    "The crack enlarged from the specimen retains exactly the same outline",
  );
  for (let index = 0; index < 6; index++)
    assert.ok(
      Math.abs(frame.cracks[0].matrix[index] - frame.cracks[1].matrix[index]) <
        0.0001,
      "Macro and detail crack outlines coincide on screen throughout the handoff",
    );
  await page.screenshot({ path: "test-results/journey-transition-zh.png" });

  await choose(page, "object");
  await page.getByTestId("journey-next").click();
  await page.waitForFunction(
    () => {
      const value = Number(
        document.querySelector(".scale-journey")?.dataset.position,
      );
      return value > 0.08 && value < 0.8;
    },
    null,
    { timeout: 8000 },
  );
  assert.equal(
    await page.locator(".journey-caption").getAttribute("aria-live"),
    "off",
    "Manual camera flights also suppress repeating live announcements",
  );
  await page.getByTestId("journey-play").click();
  await status(page, "data-playing", "false");
  await frozen(page, "Main pause control stops a manual camera flight");
  assert.ok(
    (await position(page)) > 0 && (await position(page)) < 1,
    "Pausing a manual flight preserves an intermediate view",
  );
  await choose(page, "object");
  await page.getByTestId("journey-focus").click();
  await at(page, 1);
  await page.getByTestId("journey-next").click();
  await at(page, 2);
  await page.getByTestId("journey-previous").click();
  await at(page, 1);
  // Changing the destination during flight cancels the old destination.
  await page.getByTestId("journey-stage-atoms").click();
  await page.getByTestId("journey-stage-object").click();
  await page.getByTestId("journey-stage-grains").click();
  await at(page, 2);
  await frozen(page, "Rapid manual stage selection");
  assert.equal(await journey(page).getAttribute("data-playing"), "false");
  await page.getByTestId("journey-progress").fill("1.35");
  await at(page, 1.35);
  const beforeLanguage = await position(page);
  await language(page, "en");
  assert.equal(
    await position(page),
    beforeLanguage,
    "Language switching preserves fractional progress",
  );
  assert.equal(
    await journey(page).getAttribute("data-playing"),
    "false",
    "Language switching preserves pause",
  );
  await inspectLanguage(page, "en");

  await page.getByTestId("journey-play").click();
  await status(page, "data-playing", "true");
  await journey(page).scrollIntoViewIfNeeded();
  await page.waitForFunction(
    (start) =>
      Number(document.querySelector(".scale-journey")?.dataset.position) >
      start + 0.03,
    beforeLanguage,
    { timeout: 8000 },
  );
  await language(page, "zh");
  assert.equal(
    await journey(page).getAttribute("data-playing"),
    "true",
    "Language switching preserves the request to play",
  );

  // Use actual scrolling for visibility; do not directly invoke the animation's controls.
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await status(page, "data-active", "false");
  await frozen(page, "Offscreen tour");
  assert.equal(
    await journey(page).getAttribute("data-playing"),
    "true",
    "Going offscreen preserves playback intent",
  );
  const beforeVisible = await position(page);
  await journey(page).scrollIntoViewIfNeeded();
  await status(page, "data-active", "true");
  await page.waitForFunction(
    (start) =>
      Number(document.querySelector(".scale-journey")?.dataset.position) >
      start + 0.02,
    beforeVisible,
    { timeout: 8000 },
  );

  // A visible caption/card must not consume the animation when its actual drawing
  // is mostly above the viewport. This catches observing the whole card instead.
  await page.locator(".journey-view").evaluate((view) => {
    const bounds = view.getBoundingClientRect();
    window.scrollTo({
      top: scrollY + bounds.top + bounds.height * 0.75,
      behavior: "instant",
    });
  });
  assert.ok(
    await journey(page).evaluate(
      (host) => host.getBoundingClientRect().bottom > 150,
    ),
    "Part of the card remains visible while the illustration is mostly hidden",
  );
  await status(page, "data-active", "false");
  await frozen(page, "Partially visible illustration");
  await page.locator(".journey-view").scrollIntoViewIfNeeded();
  await status(page, "data-active", "true");

  // Browser visibility event with both standard properties matching a hidden tab.
  await page.evaluate(() => {
    window.__journeyVisibilityDescriptors = ["hidden", "visibilityState"].map(
      (name) => [name, Object.getOwnPropertyDescriptor(document, name)],
    );
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await status(page, "data-active", "false");
  await frozen(page, "Hidden tab");
  await page.evaluate(() => {
    for (const [name, descriptor] of window.__journeyVisibilityDescriptors) {
      if (descriptor) Object.defineProperty(document, name, descriptor);
      else delete document[name];
    }
    delete window.__journeyVisibilityDescriptors;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await status(page, "data-active", "true");
  await page.getByTestId("journey-play").click();
  await status(page, "data-playing", "false");
  await page.getByTestId("journey-progress").fill("3.6");
  await page.getByTestId("journey-play").click();
  await at(page, 4);
  assert.equal(
    await journey(page).getAttribute("data-playing"),
    "true",
    "The tour keeps playing at the atomic endpoint",
  );
  assert.equal(
    await page.getByTestId("journey-focus").count(),
    0,
    "There is no further zoom hotspot at the atomic level",
  );
  const loop = await page.evaluate(async () => {
    const started = performance.now();
    let previous = 4;
    let maxStep = 0;
    let reachedObject = false;
    let intermediateReturn = false;
    let arrivalStarted = null;
    let arrivedAtDefects = false;
    return await new Promise((resolve, reject) => {
      const sample = (time) => {
        const host = document.querySelector(".scale-journey");
        const current = Number(host?.dataset.position);
        if (host?.dataset.playing !== "true")
          return reject(new Error("Loop stopped playing"));
        maxStep = Math.max(maxStep, Math.abs(current - previous));
        if (current > 3.05 && current < 3.95) {
          intermediateReturn = true;
          if (host.dataset.stage !== "atoms")
            return reject(
              new Error(
                "Reverse zoom changes its caption before reaching the next layer",
              ),
            );
        }
        // The diagnostic position is rounded to four decimals; its last eased
        // frame can read 3.0000 before actually arriving. Check within the hold.
        if (current === 3) {
          arrivalStarted ??= time;
          if (time - arrivalStarted > 100) {
            if (host.dataset.stage !== "dislocations")
              return reject(
                new Error("Reverse zoom did not announce its arrived layer"),
              );
            arrivedAtDefects = true;
          }
        } else arrivalStarted = null;
        if (current === 0) reachedObject = true;
        if (reachedObject && current > 0.03 && host.dataset.direction === "in")
          return resolve({ maxStep, intermediateReturn, arrivedAtDefects });
        if (time - started > 30000)
          return reject(
            new Error("Tour did not return smoothly and start another loop"),
          );
        previous = current;
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
  assert.ok(
    loop.intermediateReturn,
    "Atoms zoom out through intermediate geometry",
  );
  assert.ok(
    loop.arrivedAtDefects,
    "The caption updates when the return reaches its next layer",
  );
  assert.ok(
    loop.maxStep < 0.1,
    "Neither endpoint teleports to the opposite scale",
  );
  // Paused at atoms, explicitly playing must also start the smooth return.
  await page.getByTestId("journey-progress").fill("4");
  await page.getByTestId("journey-play").click();
  assert.ok(
    (await position(page)) > 3.9,
    "Playing at atoms preserves its initial view",
  );
  await page.waitForFunction(
    () => {
      const value = Number(
        document.querySelector(".scale-journey")?.dataset.position,
      );
      return value > 3 && value < 3.95;
    },
    null,
    { timeout: 8000 },
  );
  await status(page, "data-direction", "out");
  await page.getByTestId("journey-reset").click();
  await at(page, 0);
  await status(page, "data-playing", "false");
  await page.getByTestId("journey-play").click();
  await status(page, "data-playing", "true");
  await page.getByTestId("journey-focus").focus();
  await status(page, "data-playing", "false");
  await frozen(page, "Keyboard focus keeps the zoom target available");
  await page.keyboard.press("Enter");
  await at(page, 1);
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid"),
    ),
    "journey-stage-crack",
    "Activating the disappearing hotspot moves focus to the destination stage",
  );
  await page.getByTestId("journey-reset").click();
  await at(page, 0);
  await noOverflow(page, "Desktop");
  console.log(
    "PASS journey animation: nested zoom, scrubbing, focus, forward/backward, interruption, playback, language state, visibility and continuous endpoint loops.",
  );

  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "reduce",
  });
  observe(reduced);
  await reduced.goto(base);
  await journey(reduced).waitFor();
  await reduced.evaluate(() => document.fonts.ready);
  assert.equal(
    await journey(reduced).getAttribute("data-playing"),
    "false",
    "Reduced motion starts paused",
  );
  await frozen(reduced, "Reduced-motion initial state");
  // The preference suppresses unsolicited motion, but an explicit Play request
  // still provides the full gradual animation instead of jumping between scenes.
  await reduced.getByTestId("journey-play").click();
  await reduced.locator(".journey-view").scrollIntoViewIfNeeded();
  await reduced.waitForFunction(
    () => {
      const value = Number(
        document.querySelector(".scale-journey")?.dataset.position,
      );
      return value > 0.06 && value < 0.8;
    },
    null,
    { timeout: 8000 },
  );
  await reduced.getByTestId("journey-play").click();
  const reducedIntermediate = await position(reduced);
  assert.ok(
    reducedIntermediate > 0 && reducedIntermediate < 1,
    "Reduced-motion explicit playback has genuine intermediate frames",
  );
  await frozen(reduced, "Reduced-motion explicit pause");
  await reduced.emulateMedia({ reducedMotion: "no-preference" });
  await reduced.getByTestId("journey-play").click();
  await status(reduced, "data-playing", "true");
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await status(reduced, "data-playing", "false");
  await frozen(reduced, "Changing system preference stops active animation");

  const hashes = new Set();
  for (const stage of stages) {
    await reduced.getByTestId(`journey-stage-${stage}`).click();
    assert.equal(
      await position(reduced),
      stages.indexOf(stage),
      "Reduced-motion stage selection is immediate",
    );
    assert.equal(await journey(reduced).getAttribute("data-playing"), "false");
    await frozen(reduced, `Reduced-motion ${stage}`);
    const shapes = await reduced
      .getByTestId("journey-canvas")
      .locator("path, rect, circle, ellipse, polygon, line, polyline")
      .count();
    assert.ok(
      shapes > 5,
      `${stage}: a drawn scientific scene, not just a caption`,
    );
    const screenshot = await reduced
      .getByTestId("journey-canvas")
      .screenshot({ path: `test-results/journey-${stage}-zh.png` });
    hashes.add(createHash("sha256").update(screenshot).digest("hex"));
    await inspectLanguage(reduced, "zh");
  }
  assert.equal(
    hashes.size,
    stages.length,
    "All five levels have distinct rendered geometry",
  );
  await language(reduced, "en");
  for (const stage of stages) {
    await choose(reduced, stage);
    await inspectLanguage(reduced, "en");
  }
  await reduced.setViewportSize({ width: 390, height: 844 });
  for (const locale of ["en", "zh"]) {
    await language(reduced, locale);
    for (const stage of stages) {
      await choose(reduced, stage);
      assert.equal(
        await journey(reduced).isVisible(),
        true,
        "Mobile retains the interactive journey",
      );
      await noOverflow(reduced, `${stage}/${locale}/mobile`);
      const bounds = await journey(reduced).boundingBox();
      assert.ok(
        bounds.width >= 280 && bounds.width <= 390,
        "The mobile scene uses the available reading width",
      );
    }
  }
  await choose(reduced, "grains");
  await journey(reduced).scrollIntoViewIfNeeded();
  await journey(reduced).screenshot({
    path: "test-results/journey-grains-mobile-zh.png",
  });
  await reduced.getByTestId("journey-progress").focus();
  await reduced.keyboard.press("Home");
  await at(reduced, 0);
  await reduced.keyboard.press("End");
  await at(reduced, 4);
  await reduced.getByTestId("journey-previous").focus();
  await reduced.keyboard.press("Enter");
  await at(reduced, 3);
  console.log(
    "PASS journey reading: five visual levels, bilingual copy, reduced motion, mobile layout and keyboard controls.",
  );

  await page.evaluate(() => {
    location.hash = "/foundations";
  });
  await page.locator(".foundation-card").first().waitFor();
  assert.equal(
    await journey(page).count(),
    0,
    "Changing routes unmounts the journey",
  );
  await page.waitForTimeout(150);
  assert.deepEqual(errors, [], "No JavaScript errors");
  assert.deepEqual(
    failures,
    [],
    "All static subpath assets loaded successfully",
  );
  console.log(
    "PASS journey: no runtime errors or failed resources, and clean route unmount.",
  );
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
}
