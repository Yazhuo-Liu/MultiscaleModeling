/**
 * Real hydrogen-like atomic orbitals (a.u., Z=1).
 * Translucent isosurfaces of constant |ψ|, phase-split into ± lobes.
 */

import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

export type OrbitalId = "1s" | "2pz" | "2px" | "3dz2" | "3dxy";

export interface OrbitalSpec {
  id: OrbitalId;
  label: string;
  rMax: number;
  /** Fraction of max |ψ| used as isosurface level. */
  isoFrac: number;
}

export const ORBITALS: OrbitalSpec[] = [
  { id: "1s", label: "1s", rMax: 7, isoFrac: 0.2 },
  { id: "2pz", label: "2p₂", rMax: 18, isoFrac: 0.18 },
  { id: "2px", label: "2pₓ", rMax: 18, isoFrac: 0.18 },
  { id: "3dz2", label: "3d_z²", rMax: 28, isoFrac: 0.16 },
  { id: "3dxy", label: "3d_xy", rMax: 28, isoFrac: 0.16 },
];

/** Unnormalized real hydrogenic wavefunctions (shape-correct). */
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
      const cosT = z / r;
      return r * r * Math.exp(-r / 3) * (3 * cosT * cosT - 1);
    }
    case "3dxy":
      return r * r * Math.exp(-r / 3) * ((x * y) / (r * r));
    default:
      return 0;
  }
}

function estimateMaxAbs(id: OrbitalId, rMax: number): number {
  let maxAbs = 0;
  const n = 40;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      for (let k = 0; k <= n; k++) {
        const x = ((i / n) * 2 - 1) * rMax;
        const y = ((j / n) * 2 - 1) * rMax;
        const z = ((k / n) * 2 - 1) * rMax;
        maxAbs = Math.max(maxAbs, Math.abs(psi(id, x, y, z)));
      }
    }
  }
  return maxAbs;
}

/**
 * Outer isosurface radius along +dir for phase `sign` (±1):
 * last descending crossing of |ψ| through `iso`.
 */
function findOuterIsoradius(
  id: OrbitalId,
  dir: THREE.Vector3,
  sign: 1 | -1,
  iso: number,
  rMax: number,
): number | null {
  const steps = 96;
  let prevR = 1e-4;
  let prevV = psi(id, dir.x * prevR, dir.y * prevR, dir.z * prevR);
  let prevAbs = Math.sign(prevV) === sign ? Math.abs(prevV) : 0;
  let hit: number | null = null;

  for (let s = 1; s <= steps; s++) {
    const r = (s / steps) * rMax;
    const v = psi(id, dir.x * r, dir.y * r, dir.z * r);
    if (Math.sign(v) !== sign) {
      prevR = r;
      prevAbs = 0;
      continue;
    }
    const a = Math.abs(v);
    if (prevAbs >= iso && a < iso) {
      const u = (prevAbs - iso) / (prevAbs - a + 1e-12);
      hit = prevR + Math.min(Math.max(u, 0), 1) * (r - prevR);
    }
    prevR = r;
    prevAbs = a;
  }
  return hit;
}

export interface OrbitalSurfaces {
  positive: THREE.BufferGeometry;
  negative: THREE.BufferGeometry;
  displayScale: number;
}

/**
 * Translucent lobe meshes for ψ = ±iso via icosphere rays.
 * Quantum z is the orbital z-axis; rotate in the viewer for chemistry (z-up).
 */
export function buildOrbitalSurfaces(
  id: OrbitalId,
  detail = 5,
): OrbitalSurfaces {
  const spec = ORBITALS.find((o) => o.id === id)!;
  const iso = estimateMaxAbs(id, spec.rMax) * spec.isoFrac;

  const unit = mergeVertices(new THREE.IcosahedronGeometry(1, detail));
  const basePos = unit.getAttribute("position") as THREE.BufferAttribute;
  const index = unit.getIndex();
  if (!index) throw new Error("Expected indexed icosphere");

  const nVerts = basePos.count;
  const posR = new Float32Array(nVerts);
  const negR = new Float32Array(nVerts);
  const dir = new THREE.Vector3();

  for (let i = 0; i < nVerts; i++) {
    dir.set(basePos.getX(i), basePos.getY(i), basePos.getZ(i)).normalize();
    posR[i] = findOuterIsoradius(id, dir, 1, iso, spec.rMax) ?? -1;
    negR[i] = findOuterIsoradius(id, dir, -1, iso, spec.rMax) ?? -1;
  }

  const pack = (radii: Float32Array) => {
    const positions: number[] = [];
    const normals: number[] = [];
    const faces = index.count / 3;
    const va = new THREE.Vector3();
    const vb = new THREE.Vector3();
    const vc = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const ac = new THREE.Vector3();
    const n = new THREE.Vector3();
    const mid = new THREE.Vector3();

    for (let f = 0; f < faces; f++) {
      const ia = index.getX(f * 3);
      const ib = index.getX(f * 3 + 1);
      const ic = index.getX(f * 3 + 2);
      const ra = radii[ia]!;
      const rb = radii[ib]!;
      const rc = radii[ic]!;
      if (ra < 0 || rb < 0 || rc < 0) continue;

      va.set(basePos.getX(ia), basePos.getY(ia), basePos.getZ(ia)).normalize().multiplyScalar(ra);
      vb.set(basePos.getX(ib), basePos.getY(ib), basePos.getZ(ib)).normalize().multiplyScalar(rb);
      vc.set(basePos.getX(ic), basePos.getY(ic), basePos.getZ(ic)).normalize().multiplyScalar(rc);

      ab.subVectors(vb, va);
      ac.subVectors(vc, va);
      n.crossVectors(ab, ac).normalize();
      mid.copy(va).add(vb).add(vc).multiplyScalar(1 / 3);
      if (n.dot(mid) < 0) n.negate();

      for (const v of [va, vb, vc]) {
        positions.push(v.x, v.y, v.z);
        normals.push(n.x, n.y, n.z);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    return geo;
  };

  unit.dispose();

  return {
    positive: pack(posR),
    negative: pack(negR),
    displayScale: orbitalDisplayScale(id),
  };
}

export function orbitalDisplayScale(id: OrbitalId): number {
  switch (id) {
    case "1s":
      return 0.9;
    case "2pz":
    case "2px":
      return 0.4;
    case "3dz2":
    case "3dxy":
      return 0.26;
    default:
      return 0.4;
  }
}

/** Glass-like translucent lobe material. */
export function lobeMaterial(color: number, opacity = 0.58): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.22,
    metalness: 0.0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.3,
    side: THREE.DoubleSide,
    depthWrite: false,
    transmission: 0.22,
    thickness: 0.8,
  });
}
