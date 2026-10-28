import test from "node:test";
import assert from "node:assert/strict";
import {
  createSpatialSimulation,
  lennardJonesForces3D,
  phaseFieldEnergy3D,
  phaseFieldStep3D,
} from "./spatial";
import type { SimulationFrame } from "../types";

const metric = (frame: SimulationFrame, name: string) => {
  const found = frame.metrics.find((item) => item.label === name);
  assert.ok(found, `Missing ${name}`);
  return found.value;
};
const close = (actual: number, expected: number, tolerance = 1e-10) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} != ${expected}`,
  );

test("3D LJ pair force acts along z, obeys Newton's law, and wraps z periodically", () => {
  const points = [
    { x: 0, y: 0, z: -0.6 },
    { x: 0, y: 0, z: 0.6 },
  ];
  const first = lennardJonesForces3D(points, 6);
  assert.ok(
    first.forces[2] > 0,
    "An attractive z-only pair must exert a z force",
  );
  close(first.forces[2] + first.forces[5], 0);
  for (const i of [0, 1, 3, 4]) close(first.forces[i], 0);
  const shifted = lennardJonesForces3D(
    [points[0], { ...points[1], z: 6.6 }],
    6,
  );
  close(shifted.potential, first.potential);
  first.forces.forEach((force, i) => close(shifted.forces[i], force));
  const separation = 1.2;
  const h = 1e-6;
  const energy = (r: number) =>
    lennardJonesForces3D(
      [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: r },
      ],
      6,
    ).potential;
  close(
    first.forces[2],
    (energy(separation + h) - energy(separation - h)) / (2 * h),
    1e-7,
  );
});

test("3D MD starts from108 FCC atoms and advances independent xyz degrees of freedom", () => {
  const sim = createSpatialSimulation("md", { density: 0.6, temperature: 0.5 });
  const first = sim.reset();
  assert.equal(first.points?.length, 108);
  const box = first.box!;
  assert.ok(box / 2 > 2.5);
  close(108 / box ** 3, 0.6);
  close(metric(first, "约化温度"), 0.5);
  for (const axis of ["x", "y", "z"] as const)
    assert.equal(new Set(first.points!.map((p) => p[axis].toFixed(8))).size, 6);
  const next = sim.step();
  let kineticFromMotion = 0;
  for (const axis of ["x", "y", "z"] as const) {
    const displacements = next.points!.map(
      (p, i) => p[axis] - first.points![i][axis],
    );
    assert.ok(displacements.every((d) => Math.abs(d) > 1e-10));
    close(
      displacements.reduce((a, b) => a + b, 0),
      0,
    );
    kineticFromMotion += displacements.reduce(
      (sum, d) => sum + (d / 0.002) ** 2 / 2,
      0,
    );
  }
  // FCC symmetry gives zero initial net force: the first drift recovers velocity.
  close((2 * kineticFromMotion) / (3 * (108 - 1)), 0.5, 1e-9);
  assert.deepEqual(
    sim.reset(),
    first,
    "Reset restores the deterministic FCC microstate",
  );
});

test("3D MD conserves energy approximately, preserves particles and stays within all boundaries", () => {
  const sim = createSpatialSimulation("md");
  const initial = sim.reset();
  const energy = metric(initial, "总能量 / 粒子");
  let frame = initial;
  for (let i = 0; i < 10; i++) {
    frame = sim.step(100);
    assert.equal(frame.points!.length, 108);
    for (const p of frame.points!)
      for (const axis of ["x", "y", "z"] as const)
        assert.ok(
          Number.isFinite(p[axis]) &&
            p[axis] >= -frame.box! / 2 &&
            p[axis] < frame.box! / 2,
        );
    assert.ok(Math.abs(metric(frame, "总能量 / 粒子") - energy) < 0.005);
  }
  close(frame.time, 2, 1e-10);
});

test("3D MD remains finite at every density/temperature control corner", () => {
  for (const density of [0.3, 0.8])
    for (const temperature of [0.1, 1.5]) {
      const sim = createSpatialSimulation("md", { density, temperature });
      let frame = sim.reset();
      assert.ok(
        frame.box! / 2 > 2.5,
        "Minimum-image box must exceed twice the cutoff",
      );
      for (let i = 0; i < 4; i++) frame = sim.step(100);
      assert.ok(frame.metrics.every((m) => Number.isFinite(m.value)));
      assert.ok(
        frame.points!.every((p) => [p.x, p.y, p.z].every(Number.isFinite)),
      );
    }
});

test("3D Allen–Cahn evolves a z-only Fourier mode with the exact discrete z eigenvalue", () => {
  const size = 9;
  const wave = (2 * Math.PI) / size;
  const values = Float64Array.from(
    { length: size ** 3 },
    (_, i) => 0.2 * Math.cos(wave * Math.floor(i / (size * size))),
  );
  const mobility = 1.3;
  const gradient = 0.7;
  const dt = 0.015;
  const next = phaseFieldStep3D(values, size, mobility, gradient, dt);
  const eigenvalue = -4 * Math.sin(Math.PI / size) ** 2;
  values.forEach((v, i) =>
    close(
      next[i],
      v + dt * mobility * (gradient * eigenvalue * v + v - v ** 3),
    ),
  );
  assert.notEqual(
    next[0],
    values[0],
    "The third coordinate contributes physical diffusion",
  );
});

test("The three-dimensional phase-field energy gradient matches the update direction", () => {
  const size = 5;
  const field = Float64Array.from(
    { length: size ** 3 },
    (_, i) => 0.3 * Math.sin(i * 1.7),
  );
  const direction = Float64Array.from({ length: size ** 3 }, (_, i) =>
    Math.cos(i * 0.71),
  );
  const next = phaseFieldStep3D(field, size, 1.2, 0.9);
  const h = 1e-6;
  const plus = field.map((v, i) => v + h * direction[i]);
  const minus = field.map((v, i) => v - h * direction[i]);
  const numericalDerivative =
    (phaseFieldEnergy3D(plus, size, 0.9) -
      phaseFieldEnergy3D(minus, size, 0.9)) /
    (2 * h);
  const gradientDotDirection = field.reduce(
    (sum, v, i) => sum - ((next[i] - v) / (0.015 * 1.2)) * direction[i],
    0,
  );
  close(gradientDotDirection, numericalDerivative, 1e-7);
});

test("3D phase-field supplies distinct spatial layers and dissipates energy at all control corners", () => {
  for (const mobility of [0.1, 2])
    for (const gradient of [0.2, 2]) {
      const sim = createSpatialSimulation("phase-field", {
        mobility,
        gradient,
      });
      const initial = sim.reset();
      assert.equal(initial.box, 24);
      assert.equal(
        initial.grid,
        undefined,
        "The model returns a volume, not an extruded 2D field",
      );
      assert.deepEqual(
        [initial.volume!.width, initial.volume!.height, initial.volume!.depth],
        [24, 24, 24],
      );
      assert.equal(initial.volume!.values.length, 24 ** 3);
      const layers = Array.from({ length: 24 }, (_, z) =>
        initial.volume!.values.slice(z * 24 ** 2, (z + 1) * 24 ** 2),
      );
      assert.equal(
        new Set(layers.map((layer) => JSON.stringify(layer))).size,
        24,
      );
      let energy = metric(initial, "平均自由能");
      let frame = initial;
      for (let batch = 0; batch < 12; batch++) {
        frame = sim.step(25);
        const nextEnergy = metric(frame, "平均自由能");
        assert.ok(
          nextEnergy <= energy + 1e-12,
          `${mobility}/${gradient}: energy must descend`,
        );
        energy = nextEnergy;
        assert.ok(
          frame.volume!.values.every(
            (v) => Number.isFinite(v) && Math.abs(v) <= 1,
          ),
        );
        const fraction = metric(frame, "正相体积分数");
        assert.ok(fraction > 0 && fraction < 1);
      }
      assert.ok(energy < metric(initial, "平均自由能") - 0.001);
      assert.deepEqual(sim.reset(), initial);
    }
});
