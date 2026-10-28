/** Samples on a uniform Cartesian cube, including both boundary faces.
 * Index = x + size * (y + size * z); coordinates run from -extent to +extent.
 */
export interface ScalarVolume {
  size: number;
  extent: number;
  values: Float32Array;
}

export interface Isosurface {
  /** Unindexed triangles in the same physical coordinates as the volume. */
  positions: Float32Array;
  /** Unit normals point toward decreasing scalar values. */
  normals: Float32Array;
}

const corners = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
] as const;
// A consistent six-tetrahedron decomposition shares every neighboring face's
// diagonal. It avoids the ambiguous face connections of a basic cube lookup.
const tetrahedra = [
  [0, 5, 1, 6],
  [0, 1, 2, 6],
  [0, 2, 3, 6],
  [0, 3, 7, 6],
  [0, 7, 4, 6],
  [0, 4, 5, 6],
] as const;
type Vertex = { p: number[]; n: number[] };

/** Extract a full 3D scalar-field level set, never a height map or extrusion. */
export function extractIsosurface(
  volume: ScalarVolume,
  level: number,
): Isosurface {
  const { size, extent, values } = volume;
  if (
    !Number.isInteger(size) ||
    size < 2 ||
    size > 257 ||
    values.length !== size ** 3 ||
    !Number.isFinite(extent) ||
    extent <= 0 ||
    !Number.isFinite(level)
  )
    throw new RangeError("Invalid scalar volume");
  const spacing = (2 * extent) / (size - 1);
  const gradient = new Float32Array(values.length * 3);
  const index = (x: number, y: number, z: number) => x + size * (y + size * z);
  for (let z = 0; z < size; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const i = index(x, y, z);
        if (!Number.isFinite(values[i]))
          throw new RangeError("Non-finite scalar sample");
        const loX = Math.max(0, x - 1),
          hiX = Math.min(size - 1, x + 1);
        const loY = Math.max(0, y - 1),
          hiY = Math.min(size - 1, y + 1);
        const loZ = Math.max(0, z - 1),
          hiZ = Math.min(size - 1, z + 1);
        gradient[3 * i] =
          -(values[index(hiX, y, z)] - values[index(loX, y, z)]) /
          ((hiX - loX) * spacing);
        gradient[3 * i + 1] =
          -(values[index(x, hiY, z)] - values[index(x, loY, z)]) /
          ((hiY - loY) * spacing);
        gradient[3 * i + 2] =
          -(values[index(x, y, hiZ)] - values[index(x, y, loZ)]) /
          ((hiZ - loZ) * spacing);
      }
  const positions: number[] = [],
    normals: number[] = [];
  const cubeIndices = new Array<number>(8),
    cubeValues = new Array<number>(8);
  const intersect = (
    a: number,
    b: number,
    x: number,
    y: number,
    z: number,
  ): Vertex => {
    const t = (level - cubeValues[a]) / (cubeValues[b] - cubeValues[a]);
    const n = [0, 1, 2].map(
      (d) =>
        gradient[3 * cubeIndices[a] + d] * (1 - t) +
        gradient[3 * cubeIndices[b] + d] * t,
    );
    const length = Math.hypot(...n);
    if (length > 1e-20) for (let d = 0; d < 3; d++) n[d] /= length;
    const origin = [x, y, z];
    return {
      p: [0, 1, 2].map(
        (d) =>
          -extent +
          spacing * (origin[d] + corners[a][d] * (1 - t) + corners[b][d] * t),
      ),
      n,
    };
  };
  const triangle = (a: Vertex, b: Vertex, c: Vertex) => {
    const u = b.p.map((v, i) => v - a.p[i]),
      v = c.p.map((value, i) => value - a.p[i]);
    const face = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    const area = Math.hypot(...face);
    if (area < spacing * spacing * 1e-12) return;
    const normalSum = a.n.map((n, i) => n + b.n[i] + c.n[i]);
    if (face.reduce((sum, n, i) => sum + n * normalSum[i], 0) < 0)
      [b, c] = [c, b];
    for (const vertex of [a, b, c]) {
      positions.push(...vertex.p);
      if (Math.hypot(...vertex.n) > 1e-20) normals.push(...vertex.n);
      else normals.push(...face.map((n) => n / area));
    }
  };
  for (let z = 0; z < size - 1; z++)
    for (let y = 0; y < size - 1; y++)
      for (let x = 0; x < size - 1; x++) {
        let min = Infinity,
          max = -Infinity;
        for (let c = 0; c < 8; c++) {
          const [dx, dy, dz] = corners[c];
          const i = index(x + dx, y + dy, z + dz);
          cubeIndices[c] = i;
          cubeValues[c] = values[i];
          min = Math.min(min, values[i]);
          max = Math.max(max, values[i]);
        }
        if (min > level || max <= level) continue;
        for (const tet of tetrahedra) {
          const inside = tet.filter((c) => cubeValues[c] > level);
          const outside = tet.filter((c) => cubeValues[c] <= level);
          if (!inside.length || !outside.length) continue;
          if (inside.length === 1 || outside.length === 1) {
            const lone = inside.length === 1 ? inside[0] : outside[0];
            const others = inside.length === 1 ? outside : inside;
            triangle(
              intersect(lone, others[0], x, y, z),
              intersect(lone, others[1], x, y, z),
              intersect(lone, others[2], x, y, z),
            );
          } else {
            const ac = intersect(inside[0], outside[0], x, y, z);
            const ad = intersect(inside[0], outside[1], x, y, z);
            const bc = intersect(inside[1], outside[0], x, y, z);
            const bd = intersect(inside[1], outside[1], x, y, z);
            triangle(ac, bc, ad);
            triangle(ad, bc, bd);
          }
        }
      }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
  };
}
