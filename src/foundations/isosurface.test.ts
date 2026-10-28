import test from "node:test";
import assert from "node:assert/strict";
import {
  extractIsosurface,
  type ScalarVolume,
} from "../visualization/isosurface";
import { buildOrbitalVolume, getOrbitalModel } from "./orbital-volume";

function volume(
  size: number,
  extent: number,
  fn: (x: number, y: number, z: number) => number,
): ScalarVolume {
  const values = new Float32Array(size ** 3);
  for (let z = 0; z < size; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const coordinate = (i: number) =>
          -extent + (2 * extent * i) / (size - 1);
        values[x + size * (y + size * z)] = fn(
          coordinate(x),
          coordinate(y),
          coordinate(z),
        );
      }
  return { size, extent, values };
}

test("An analytic sphere produces a closed 3D level set with outward unit normals", () => {
  const mesh = extractIsosurface(
    volume(25, 1.5, (x, y, z) => 1 - x * x - y * y - z * z),
    0,
  );
  assert.ok(mesh.positions.length > 300);
  assert.equal(mesh.positions.length % 9, 0);
  assert.equal(mesh.normals.length, mesh.positions.length);
  const edges = new Map<string, number>();
  const pointKey = (index: number) =>
    Array.from(mesh.positions.slice(index, index + 3))
      .map((x) => x.toFixed(5))
      .join(",");
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const p = mesh.positions.slice(i, i + 3),
      n = mesh.normals.slice(i, i + 3);
    assert.ok(Math.abs(Math.hypot(...p) - 1) < 0.007);
    assert.ok(Math.abs(Math.hypot(...n) - 1) < 1e-6);
    assert.ok(p.reduce((sum, value, d) => sum + value * n[d], 0) > 0.99);
  }
  for (let i = 0; i < mesh.positions.length; i += 9) {
    const keys = [pointKey(i), pointKey(i + 3), pointKey(i + 6)];
    for (let j = 0; j < 3; j++) {
      const edge = [keys[j], keys[(j + 1) % 3]].sort().join("|");
      edges.set(edge, (edges.get(edge) ?? 0) + 1);
    }
  }
  assert.ok(
    [...edges.values()].every((count) => count === 2),
    "Each closed surface edge has two incident triangles",
  );
});

test("Spatial phase-field interfaces depend on z rather than extruding an xy map", () => {
  const field = volume(17, 2, (x, y, z) => x * x + y * y + 4 * z * z - 1);
  const mesh = extractIsosurface(field, 0);
  const extents = [0, 0, 0];
  mesh.positions.forEach(
    (value, i) => (extents[i % 3] = Math.max(extents[i % 3], Math.abs(value))),
  );
  assert.ok(Math.abs(extents[0] - 1) < 1e-6 && Math.abs(extents[1] - 1) < 1e-6);
  assert.ok(Math.abs(extents[2] - 0.5) < 1e-6);
  assert.equal(extractIsosurface(field, 100).positions.length, 0);
});

test("Orbital p lobes form separate signed surfaces in three spatial directions", () => {
  const model = getOrbitalModel("H", "2pz"),
    field = buildOrbitalVolume(model, 33);
  const threshold = Math.sqrt(model.maxDensity * 0.04);
  const positive = extractIsosurface(field, threshold),
    negative = extractIsosurface(field, -threshold);
  assert.ok(positive.positions.length > 300 && negative.positions.length > 300);
  for (let i = 2; i < positive.positions.length; i += 3)
    assert.ok(positive.positions[i] > 0);
  for (let i = 2; i < negative.positions.length; i += 3)
    assert.ok(negative.positions[i] < 0);
  for (const mesh of [positive, negative]) {
    assert.ok(
      mesh.positions.every(Number.isFinite) &&
        mesh.normals.every(Number.isFinite),
    );
    assert.ok(mesh.positions.some((value, i) => i % 3 === 0 && value > 1));
    assert.ok(mesh.positions.some((value, i) => i % 3 === 1 && value > 1));
  }
});

test("Invalid and non-finite scalar fields fail explicitly", () => {
  assert.throws(
    () =>
      extractIsosurface({ size: 3, extent: 1, values: new Float32Array(2) }, 0),
    RangeError,
  );
  const field = volume(3, 1, () => 0);
  field.values[5] = NaN;
  assert.throws(() => extractIsosurface(field, 0), RangeError);
});
