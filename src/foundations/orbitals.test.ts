import test from "node:test";
import assert from "node:assert/strict";
import {
  GROUND_SUBSHELLS,
  HYDROGEN_ORBITALS,
  IRON_ORBITALS,
  hydrogenWavefunction,
  hydrogenRadialProbability,
  hydrogenCumulativeProbability,
  hundOccupancy,
  ironAngularAmplitude,
  ironAngularSurface,
  sampleHydrogen,
  shellPopulation,
} from "./orbitals";

function integrate(
  fn: (x: number) => number,
  lower: number,
  upper: number,
  steps = 20000,
) {
  const h = (upper - lower) / steps;
  let sum = fn(lower) + fn(upper);
  for (let i = 1; i < steps; i++) sum += (i % 2 ? 4 : 2) * fn(lower + i * h);
  return (sum * h) / 3;
}

test("H radial distributions normalize and agree with cumulative probabilities", () => {
  for (const orbital of HYDROGEN_ORBITALS) {
    assert.ok(
      Math.abs(
        integrate((r) => hydrogenRadialProbability(orbital, r), 0, 80) - 1,
      ) < 1e-8,
    );
    for (const r of [1, 2, 5, 12])
      assert.ok(
        Math.abs(
          integrate((x) => hydrogenRadialProbability(orbital, x), 0, r, 1000) -
            hydrogenCumulativeProbability(orbital, r),
        ) < 1e-8,
      );
  }
});

test("H density, radial probability and phase obey the analytical node structure", () => {
  for (const orbital of ["1s", "2s"] as const) {
    for (const r of [0.2, 1, 2, 4])
      assert.ok(
        Math.abs(
          4 * Math.PI * r * r * hydrogenWavefunction(orbital, r, 0, 0) ** 2 -
            hydrogenRadialProbability(orbital, r),
        ) < 1e-12,
      );
  }
  assert.equal(hydrogenWavefunction("2s", 2, 0, 0), 0);
  assert.ok(
    hydrogenWavefunction("2s", 1, 0, 0) > 0 &&
      hydrogenWavefunction("2s", 3, 0, 0) < 0,
  );
  assert.equal(hydrogenWavefunction("2pz", 4, 3, 0), 0);
  assert.equal(
    hydrogenWavefunction("2pz", 0, 0, 1),
    -hydrogenWavefunction("2pz", 0, 0, -1),
  );
  assert.ok(
    hydrogenWavefunction("1s", 0, 0, 0) > hydrogenWavefunction("1s", 1, 0, 0),
  );
  assert.ok(
    hydrogenRadialProbability("1s", 1) > hydrogenRadialProbability("1s", 0.99),
  );
  assert.ok(
    hydrogenRadialProbability("1s", 1) > hydrogenRadialProbability("1s", 1.01),
  );
  assert.ok(
    Math.abs(hydrogenCumulativeProbability("1s", 1) - (1 - 5 * Math.exp(-2))) <
      1e-14,
  );
});

test("Hydrogen clouds sample probability density rather than uniform radii", () => {
  for (const [orbital, mean] of [
    ["1s", 1.5],
    ["2s", 6],
    ["2pz", 5],
  ] as const) {
    const points = sampleHydrogen(orbital, 12000, 912);
    assert.ok(
      Math.abs(
        points.reduce((sum, p) => sum + Math.hypot(p.x, p.y, p.z), 0) /
          points.length -
          mean,
      ) < 0.08,
    );
    assert.ok(
      points.every(
        (p) =>
          (hydrogenWavefunction(orbital, p.x, p.y, p.z) >= 0 ? 1 : -1) ===
          p.phase,
      ),
    );
  }
  const p = sampleHydrogen("2pz", 12000, 912);
  const cosineSquared =
    p.reduce((sum, q) => sum + q.z ** 2 / (q.x ** 2 + q.y ** 2 + q.z ** 2), 0) /
    p.length;
  assert.ok(Math.abs(cosineSquared - 0.6) < 0.015);
  assert.deepEqual(sampleHydrogen("1s", 5), sampleHydrogen("1s", 5));
});

test("Neutral Fe shell populations and Hund filling contain exactly 26 electrons", () => {
  assert.deepEqual(shellPopulation("H"), [1]);
  assert.deepEqual(shellPopulation("Fe"), [2, 8, 14, 2]);
  assert.equal(
    GROUND_SUBSHELLS.Fe.reduce((sum, shell) => sum + shell.electrons, 0),
    26,
  );
  assert.deepEqual(hundOccupancy(2, 6), ["↑↓", "↑", "↑", "↑", "↑"]);
  assert.deepEqual(hundOccupancy(1, 6), ["↑↓", "↑↓", "↑↓"]);
  assert.throws(() => hundOccupancy(1, 7), RangeError);
});

test("Real d angular functions are normalized and have the expected nodal geometry", () => {
  const nt = 260,
    np = 520;
  for (const orbital of IRON_ORBITALS) {
    let integral = 0;
    for (let i = 0; i < nt; i++) {
      const theta = ((i + 0.5) * Math.PI) / nt;
      for (let j = 0; j < np; j++) {
        const phi = ((j + 0.5) * 2 * Math.PI) / np;
        const y = ironAngularAmplitude(
          orbital,
          Math.sin(theta) * Math.cos(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(theta),
        );
        integral +=
          (((y * y * Math.sin(theta) * Math.PI) / nt) * 2 * Math.PI) / np;
      }
    }
    assert.ok(Math.abs(integral - 1) < 0.0001, `${orbital}: ${integral}`);
  }
  assert.equal(ironAngularAmplitude("dxy", 1, 0, 1), 0);
  assert.equal(ironAngularAmplitude("dx2-y2", 1, 1, 0), 0);
  assert.ok(Math.abs(ironAngularAmplitude("dz2", Math.sqrt(2), 0, 1)) < 1e-14);
  assert.ok(ironAngularAmplitude("dz2", 0, 0, 1) > 0);
  assert.ok(ironAngularAmplitude("dz2", 1, 0, 0) < 0);
});

test("Angular meshes are finite and contain both phase regions", () => {
  for (const orbital of IRON_ORBITALS) {
    const surface = ironAngularSurface(orbital, 20, 40);
    assert.ok(surface.positions.every(Number.isFinite));
    assert.equal(surface.positions.length, 21 * 41 * 3);
    assert.ok(surface.phases.includes(1) && surface.phases.includes(-1));
    assert.ok(
      surface.indices.every((i) => i >= 0 && i < surface.phases.length),
    );
  }
});
