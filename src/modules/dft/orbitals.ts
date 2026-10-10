/**
 * Hydrogenic orbitals as smooth translucent |ψ| isosurfaces (marching cubes).
 */

import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import {
  edgeTable as edgeTableExport,
  triTable as triTableExport,
} from "three/addons/objects/MarchingCubes.js";

// Upstream .d.ts incorrectly types these as Int32Array[]; runtime is flat Int32Array.
const edgeTable = edgeTableExport as unknown as Int32Array;
const triTable = triTableExport as unknown as Int32Array;

export type OrbitalId = "1s" | "2pz" | "2px" | "3dz2" | "3dxy";

export interface OrbitalSpec {
  id: OrbitalId;
  label: string;
  rMax: number;
  isoFrac: number;
}

export const ORBITALS: OrbitalSpec[] = [
  { id: "1s", label: "1s", rMax: 6.5, isoFrac: 0.22 },
  { id: "2pz", label: "2p₂", rMax: 16, isoFrac: 0.2 },
  { id: "2px", label: "2pₓ", rMax: 16, isoFrac: 0.2 },
  { id: "3dz2", label: "3d_z²", rMax: 24, isoFrac: 0.18 },
  { id: "3dxy", label: "3d_xy", rMax: 24, isoFrac: 0.18 },
];

export function psi(id: OrbitalId, x: number, y: number, z: number): number {
  const r = Math.hypot(x, y, z);
  if (r < 1e-8) return id === "1s" ? 1 : 0;
  switch (id) {
    case "1s":
      return Math.exp(-r);
    case "2pz":
      return r * Math.exp(-r / 2) * (z / r);
    case "2px":
      return r * Math.exp(-r / 2) * (x / r);
    case "3dz2": {
      const c = z / r;
      return r * r * Math.exp(-r / 3) * (3 * c * c - 1);
    }
    case "3dxy":
      return r * r * Math.exp(-r / 3) * ((x * y) / (r * r));
    default:
      return 0;
  }
}

export function orbitalDisplayScale(id: OrbitalId): number {
  switch (id) {
    case "1s":
      return 1.05;
    case "2pz":
    case "2px":
      return 0.48;
    case "3dz2":
    case "3dxy":
      return 0.32;
    default:
      return 0.45;
  }
}

/** Soft scientific lobe colors */
export const LOBE_POS = 0xe4574c;
export const LOBE_NEG = 0x3d7edb;

export function lobeMaterial(
  color: number,
  envMap?: THREE.Texture | null,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    envMap: envMap ?? null,
    envMapIntensity: envMap ? 0.85 : 0,
    transparent: true,
    opacity: 0.72,
    roughness: 0.12,
    metalness: 0.0,
    transmission: 0.42,
    thickness: 1.35,
    ior: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    specularIntensity: 0.9,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

const EDGE_VERT: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function marchingCubes(
  values: Float32Array,
  n: number,
  origin: number,
  cell: number,
  isolevel: number,
): THREE.BufferGeometry {
  const n1 = n + 1;
  const idx = (i: number, j: number, k: number) => i + n1 * (j + n1 * k);
  const pos: number[] = [];
  const corner = new Array<[number, number, number]>(8);
  const cval = new Float32Array(8);
  const vertList: ([number, number, number] | null)[] = Array(12).fill(null);

  const lerp = (
    isolevel: number,
    p0: [number, number, number],
    p1: [number, number, number],
    v0: number,
    v1: number,
  ): [number, number, number] => {
    if (Math.abs(isolevel - v0) < 1e-10) return p0;
    if (Math.abs(isolevel - v1) < 1e-10) return p1;
    if (Math.abs(v0 - v1) < 1e-10) return p0;
    const t = (isolevel - v0) / (v1 - v0);
    return [
      p0[0] + t * (p1[0] - p0[0]),
      p0[1] + t * (p1[1] - p0[1]),
      p0[2] + t * (p1[2] - p0[2]),
    ];
  };

  for (let k = 0; k < n; k++) {
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const x0 = origin + i * cell;
        const y0 = origin + j * cell;
        const z0 = origin + k * cell;
        corner[0] = [x0, y0, z0];
        corner[1] = [x0 + cell, y0, z0];
        corner[2] = [x0 + cell, y0 + cell, z0];
        corner[3] = [x0, y0 + cell, z0];
        corner[4] = [x0, y0, z0 + cell];
        corner[5] = [x0 + cell, y0, z0 + cell];
        corner[6] = [x0 + cell, y0 + cell, z0 + cell];
        corner[7] = [x0, y0 + cell, z0 + cell];

        cval[0] = values[idx(i, j, k)]!;
        cval[1] = values[idx(i + 1, j, k)]!;
        cval[2] = values[idx(i + 1, j + 1, k)]!;
        cval[3] = values[idx(i, j + 1, k)]!;
        cval[4] = values[idx(i, j, k + 1)]!;
        cval[5] = values[idx(i + 1, j, k + 1)]!;
        cval[6] = values[idx(i + 1, j + 1, k + 1)]!;
        cval[7] = values[idx(i, j + 1, k + 1)]!;

        let cubeindex = 0;
        for (let c = 0; c < 8; c++) {
          if (cval[c]! < isolevel) cubeindex |= 1 << c;
        }
        const edges = edgeTable[cubeindex]!;
        if (edges === 0) continue;

        for (let e = 0; e < 12; e++) {
          if (edges & (1 << e)) {
            const [a, b] = EDGE_VERT[e]!;
            vertList[e] = lerp(
              isolevel,
              corner[a]!,
              corner[b]!,
              cval[a]!,
              cval[b]!,
            );
          } else {
            vertList[e] = null;
          }
        }

        const base = cubeindex << 4;
        for (let t = 0; t < 16; t += 3) {
          const a = triTable[base + t]!;
          if (a === -1) break;
          const b = triTable[base + t + 1]!;
          const c = triTable[base + t + 2]!;
          const pa = vertList[a]!;
          const pb = vertList[b]!;
          const pc = vertList[c]!;
          pos.push(
            pa[0],
            pa[1],
            pa[2],
            pb[0],
            pb[1],
            pb[2],
            pc[0],
            pc[1],
            pc[2],
          );
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const welded = mergeVertices(geo, 1e-5);
  geo.dispose();
  welded.computeVertexNormals();
  return welded;
}

export interface OrbitalSurfaces {
  positive: THREE.BufferGeometry;
  negative: THREE.BufferGeometry;
  displayScale: number;
}

const cache = new Map<string, OrbitalSurfaces>();

/**
 * High-resolution marching-cubes isosurfaces for ψ = ±iso.
 * @param resolution grid cells along each axis (64–96 recommended)
 */
export function buildOrbitalSurfaces(
  id: OrbitalId,
  resolution = 80,
): OrbitalSurfaces {
  const key = `${id}:${resolution}`;
  const hit = cache.get(key);
  if (hit) {
    return {
      positive: hit.positive.clone(),
      negative: hit.negative.clone(),
      displayScale: hit.displayScale,
    };
  }

  const spec = ORBITALS.find((o) => o.id === id)!;
  const n = resolution;
  const n1 = n + 1;
  const origin = -spec.rMax;
  const cell = (2 * spec.rMax) / n;
  const values = new Float32Array(n1 * n1 * n1);

  let maxAbs = 0;
  let p = 0;
  for (let k = 0; k < n1; k++) {
    const z = origin + k * cell;
    for (let j = 0; j < n1; j++) {
      const y = origin + j * cell;
      for (let i = 0; i < n1; i++) {
        const x = origin + i * cell;
        const v = psi(id, x, y, z);
        values[p++] = v;
        maxAbs = Math.max(maxAbs, Math.abs(v));
      }
    }
  }

  const iso = maxAbs * spec.isoFrac;
  const positive = marchingCubes(values, n, origin, cell, +iso);
  const negative = marchingCubes(values, n, origin, cell, -iso);

  const result: OrbitalSurfaces = {
    positive,
    negative,
    displayScale: orbitalDisplayScale(id),
  };
  cache.set(key, result);
  return {
    positive: positive.clone(),
    negative: negative.clone(),
    displayScale: result.displayScale,
  };
}
