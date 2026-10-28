import test from "node:test";
import assert from "node:assert/strict";
import { hydrogenWavefunction } from "./orbitals";
import {
  VOLUME_HYDROGEN_ORBITALS,
  VOLUME_IRON_ORBITALS,
  buildOrbitalVolume,
  findRadialIsosurfaces,
  getOrbitalModel,
  sampleOrbital,
  type OrbitalModel,
} from "./orbital-volume";

function integrate(fn: (x: number) => number, upper: number, steps = 16000) {
  const h = upper / steps;
  let total = fn(0) + fn(upper);
  for (let i = 1; i < steps; i++) total += (i % 2 ? 4 : 2) * fn(i * h);
  return (total * h) / 3;
}
const models = [
  ...VOLUME_HYDROGEN_ORBITALS.map((o) => getOrbitalModel("H", o)),
  ...VOLUME_IRON_ORBITALS.map((o) => getOrbitalModel("Fe", o)),
];

test("All full-space radial functions normalize and obey hydrogenic mean radii", () => {
  for (const model of models) {
    assert.ok(
      Math.abs(integrate(model.radialProbability, 100) - 1) < 1e-8,
      `${model.atom}/${model.orbital}: normalization`,
    );
    const expected =
      (3 * model.n ** 2 - model.l * (model.l + 1)) /
      (2 * model.effectiveCharge);
    assert.ok(
      Math.abs(
        integrate((r) => r * model.radialProbability(r), 100) - expected,
      ) < 1e-8,
      `${model.orbital}: mean radius`,
    );
  }
});

test("Full 3D hydrogen states match exact analytic formulas and rotate the p nodal plane", () => {
  for (const orbital of ["1s", "2s", "2pz"] as const) {
    const model = getOrbitalModel("H", orbital);
    for (const point of [
      [0, 0, 0],
      [1, 2, 3],
      [-2, 4, -1],
    ]) {
      const [x, y, z] = point;
      assert.ok(
        Math.abs(
          model.wavefunction(x, y, z) - hydrogenWavefunction(orbital, x, y, z),
        ) < 1e-15,
      );
    }
  }
  const px = getOrbitalModel("H", "2px"),
    py = getOrbitalModel("H", "2py"),
    pz = getOrbitalModel("H", "2pz");
  assert.equal(px.wavefunction(0, 3, 4), 0);
  assert.equal(py.wavefunction(4, 0, 3), 0);
  assert.equal(pz.wavefunction(3, 4, 0), 0);
  assert.equal(px.wavefunction(2, 0, 0), py.wavefunction(0, 2, 0));
  assert.equal(px.wavefunction(2, 0, 0), -pz.wavefunction(0, 0, -2));
});

test("Screened Fe models have declared charges and correct radial/angle nodes", () => {
  const d = getOrbitalModel("Fe", "dz2"),
    s = getOrbitalModel("Fe", "4s");
  assert.equal(d.effectiveCharge, 6.25);
  assert.equal(s.effectiveCharge, 3.75);
  assert.deepEqual(d.radialNodes, []);
  assert.equal(s.radialNodes.length, 3);
  [0.499105188, 1.7628838876, 4.1380109243].forEach((expected, i) =>
    assert.ok(Math.abs(s.radialNodes[i] - expected) < 1e-9),
  );
  for (const node of s.radialNodes) {
    assert.ok(Math.abs(s.wavefunction(node, 0, 0)) < 1e-12);
    assert.ok(
      s.wavefunction(node - 0.001, 0, 0) * s.wavefunction(node + 0.001, 0, 0) <
        0,
    );
  }
  assert.ok(Math.abs(d.wavefunction(Math.sqrt(2), 0, 1)) < 1e-15);
  assert.equal(getOrbitalModel("Fe", "dxy").wavefunction(0, 2, 1), 0);
  assert.ok(integrate(s.radialProbability, s.extent) > 0.99996);
  assert.ok(integrate(d.radialProbability, d.extent) > 0.99999);
});

test("Radial isosurfaces preserve the inner shells and phases of H2s and Fe4s", () => {
  for (const [atom, orbital, count] of [
    ["H", "1s", 1],
    ["H", "2s", 3],
    ["Fe", "4s", 7],
  ] as const) {
    const model = getOrbitalModel(atom, orbital);
    const shells = findRadialIsosurfaces(model, model.defaultDensityFraction);
    assert.equal(
      shells.length,
      count,
      `${atom}/${orbital}: all radial lobes exposed`,
    );
    shells.forEach((shell, i) => {
      const psi = model.wavefunction(shell.radius, 0, 0);
      assert.ok(
        Math.abs(
          (psi * psi) / model.maxDensity - model.defaultDensityFraction,
        ) < 1e-12,
      );
      assert.equal(shell.phase, psi >= 0 ? 1 : -1);
      assert.equal(shell.normalSign, i % 2 ? -1 : 1);
      if (i) assert.ok(shell.radius > shells[i - 1].radius);
    });
  }
  const model = getOrbitalModel("H", "1s");
  const shell = findRadialIsosurfaces(model, 0.02)[0];
  assert.ok(Math.abs(shell.radius + Math.log(0.02) / 2) < 1e-12);
  assert.throws(
    () => findRadialIsosurfaces(getOrbitalModel("H", "2pz"), 0.01),
    RangeError,
  );
});

function moments(model: OrbitalModel, count = 14000) {
  const points = sampleOrbital(model, count, 867);
  let radius = 0;
  const direction = [0, 0, 0],
    means = [0, 0, 0];
  for (const p of points) {
    const r = Math.hypot(p.x, p.y, p.z);
    radius += r;
    [p.x, p.y, p.z].forEach((value, i) => {
      direction[i] += (value * value) / (r * r);
      means[i] += value;
    });
    assert.equal(p.phase, model.wavefunction(p.x, p.y, p.z) >= 0 ? 1 : -1);
    assert.ok(r <= model.extent);
  }
  return {
    radius: radius / count,
    direction: direction.map((x) => x / count),
    means: means.map((x) => x / count),
  };
}

test("Probability sampling has physical radial statistics and independent xyz angular structure", () => {
  const s = moments(getOrbitalModel("Fe", "4s"));
  assert.ok(Math.abs(s.radius - 6.4) < 0.09);
  s.direction.forEach((m) => assert.ok(Math.abs(m - 1 / 3) < 0.012));
  for (const [orbital, axis] of [
    ["2px", 0],
    ["2py", 1],
    ["2pz", 2],
  ] as const) {
    const p = moments(getOrbitalModel("H", orbital));
    assert.ok(Math.abs(p.radius - 5) < 0.08);
    assert.ok(Math.abs(p.direction[axis] - 0.6) < 0.015);
    p.means.forEach((m) => assert.ok(Math.abs(m) < 0.1));
  }
  const d = moments(getOrbitalModel("Fe", "dxy"));
  assert.ok(Math.abs(d.radius - 1.68) < 0.035);
  assert.ok(Math.abs(d.direction[0] - 3 / 7) < 0.015);
  assert.ok(Math.abs(d.direction[1] - 3 / 7) < 0.015);
  assert.ok(Math.abs(d.direction[2] - 1 / 7) < 0.012);
  assert.deepEqual(
    sampleOrbital(getOrbitalModel("H", "1s"), 5),
    sampleOrbital(getOrbitalModel("H", "1s"), 5),
  );
});

test("The sampled wavefunction is a true Cartesian volume with z-dependent values", () => {
  const model = getOrbitalModel("H", "2pz"),
    grid = buildOrbitalVolume(model, 17);
  const at = (x: number, y: number, z: number) =>
    grid.values[x + 17 * (y + 17 * z)];
  assert.equal(at(8, 8, 8), 0);
  assert.ok(at(8, 8, 9) > 0 && at(8, 8, 7) < 0);
  assert.equal(at(8, 8, 9), -at(8, 8, 7));
  assert.ok(grid.values.every(Number.isFinite));
  assert.throws(() => buildOrbitalVolume(model, 2), RangeError);
  assert.throws(() => getOrbitalModel("H", "4s"), RangeError);
});
