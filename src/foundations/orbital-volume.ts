import {
  ironAngularAmplitude,
  type Atom,
  type IronOrbital,
  type OrbitalPoint,
} from "./orbitals";
import type { ScalarVolume } from "../visualization/isosurface";

export type VolumeHydrogenOrbital = "1s" | "2s" | "2px" | "2py" | "2pz";
export type VolumeIronOrbital = IronOrbital | "4s";
export type VolumeOrbital = VolumeHydrogenOrbital | VolumeIronOrbital;
export const VOLUME_HYDROGEN_ORBITALS: VolumeHydrogenOrbital[] = [
  "1s",
  "2s",
  "2px",
  "2py",
  "2pz",
];
export const VOLUME_IRON_ORBITALS: VolumeIronOrbital[] = [
  "dz2",
  "dx2-y2",
  "dxy",
  "dxz",
  "dyz",
  "4s",
];

/** Coordinates in a₀; wavefunction in a₀⁻³ᐟ², density in a₀⁻³.
 * Fe is a Slater-screened hydrogenic teaching approximation, NOT HF/DFT.
 */
export interface OrbitalModel {
  atom: Atom;
  orbital: VolumeOrbital;
  n: number;
  l: number;
  effectiveCharge: number;
  extent: number;
  displayRadius: number;
  maxDensity: number;
  defaultDensityFraction: number;
  radialNodes: number[];
  wavefunction: (x: number, y: number, z: number) => number;
  radialProbability: (r: number) => number;
  angularAmplitude: (x: number, y: number, z: number) => number;
}

function factorial(n: number): number {
  let value = 1;
  for (let i = 2; i <= n; i++) value *= i;
  return value;
}

function laguerre(k: number, alpha: number, rho: number): number {
  if (k === 0) return 1;
  let previous = 1,
    current = 1 + alpha - rho;
  for (let i = 2; i <= k; i++) {
    const next =
      ((2 * i - 1 + alpha - rho) * current - (i - 1 + alpha) * previous) / i;
    previous = current;
    current = next;
  }
  return current;
}

/** Normalized Coulomb radial eigenfunction with the declared effective charge. */
export function hydrogenicRadial(
  n: number,
  l: number,
  charge: number,
  r: number,
): number {
  if (r < 0) return 0;
  const rho = (2 * charge * r) / n;
  const norm = Math.sqrt(
    (((2 * charge) / n) ** 3 * factorial(n - l - 1)) /
      (2 * n * factorial(n + l)),
  );
  return (
    norm * Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho)
  );
}

function roots(
  fn: (r: number) => number,
  extent: number,
  samples = 8192,
): number[] {
  const result: number[] = [];
  let a = 0,
    fa = fn(a);
  for (let i = 1; i <= samples; i++) {
    const b = (i * extent) / samples,
      fb = fn(b);
    if (fa * fb < 0) {
      let lo = a,
        hi = b,
        flo = fa;
      for (let j = 0; j < 42; j++) {
        const middle = (lo + hi) / 2,
          fm = fn(middle);
        if (flo * fm <= 0) hi = middle;
        else {
          lo = middle;
          flo = fm;
        }
      }
      result.push((lo + hi) / 2);
    } else if (fb === 0 && b > 0 && b < extent) result.push(b);
    a = b;
    fa = fb;
  }
  return result;
}

const modelCache = new Map<string, OrbitalModel>();

export function getOrbitalModel(
  atom: Atom,
  orbital: VolumeOrbital,
): OrbitalModel {
  const key = `${atom}/${orbital}`;
  const cached = modelCache.get(key);
  if (cached) return cached;
  if (
    atom === "H"
      ? !VOLUME_HYDROGEN_ORBITALS.includes(orbital as VolumeHydrogenOrbital)
      : !VOLUME_IRON_ORBITALS.includes(orbital as VolumeIronOrbital)
  ) {
    throw new RangeError(`Unsupported orbital ${key}`);
  }
  const n =
    atom === "H" ? (orbital === "1s" ? 1 : 2) : orbital === "4s" ? 4 : 3;
  const l = orbital.endsWith("s") ? 0 : atom === "H" ? 1 : 2;
  // Slater's rules for neutral Fe [Ar]3d⁶4s²:
  // 3d: 26 − 18 − 5×0.35; 4s: 26 − 10 − 14×0.85 − 0.35.
  const effectiveCharge = atom === "H" ? 1 : l === 2 ? 6.25 : 3.75;
  const radial = (r: number) => hydrogenicRadial(n, l, effectiveCharge, r);
  const angularAmplitude = (x: number, y: number, z: number) => {
    if (l === 0) return 1 / Math.sqrt(4 * Math.PI);
    const r = Math.hypot(x, y, z);
    if (r === 0) return 0;
    if (l === 2) return ironAngularAmplitude(orbital as IronOrbital, x, y, z);
    return (
      (Math.sqrt(3 / (4 * Math.PI)) *
        (orbital === "2px" ? x : orbital === "2py" ? y : z)) /
      r
    );
  };
  const radialPeak = l === 0 ? 0 : (n * l) / effectiveCharge;
  const angularMaximum =
    l === 0
      ? 1 / Math.sqrt(4 * Math.PI)
      : l === 1
        ? Math.sqrt(3 / (4 * Math.PI))
        : orbital === "dz2"
          ? Math.sqrt(5 / (4 * Math.PI))
          : Math.sqrt(15 / (16 * Math.PI));
  const extent = atom === "H" ? (n === 1 ? 8 : 20) : l === 2 ? 6 : 16;
  const model: OrbitalModel = {
    atom,
    orbital,
    n,
    l,
    effectiveCharge,
    extent,
    displayRadius: atom === "H" ? (n === 1 ? 3 : 8) : l === 2 ? 2 : 7.5,
    maxDensity: (radial(radialPeak) * angularMaximum) ** 2,
    defaultDensityFraction:
      atom === "H"
        ? orbital === "2s"
          ? 0.005
          : 0.02
        : l === 2
          ? 0.015
          : 0.0005,
    radialNodes:
      n - l - 1 > 0
        ? roots(
            (r) =>
              laguerre(n - l - 1, 2 * l + 1, (2 * effectiveCharge * r) / n),
            extent,
          )
        : [],
    wavefunction: (x, y, z) =>
      radial(Math.hypot(x, y, z)) * angularAmplitude(x, y, z),
    radialProbability: (r) => (r < 0 ? 0 : r * r * radial(r) ** 2),
    angularAmplitude,
  };
  modelCache.set(key, model);
  return model;
}

/** Signed ψ sampled in all three spatial directions; an isovalue is an amplitude. */
export function buildOrbitalVolume(
  model: OrbitalModel,
  size = 65,
): ScalarVolume {
  if (!Number.isInteger(size) || size < 3 || size > 161)
    throw new RangeError("Invalid orbital grid size");
  const values = new Float32Array(size ** 3);
  const spacing = (2 * model.extent) / (size - 1);
  for (let z = 0; z < size; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        values[x + size * (y + size * z)] = model.wavefunction(
          -model.extent + spacing * x,
          -model.extent + spacing * y,
          -model.extent + spacing * z,
        );
      }
  return { size, extent: model.extent, values };
}

function generator(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inverse radial-CDF plus angular rejection sampling of |R Y|² within r≤extent.
 * The finite radial CDF is renormalized only for drawing; orbital functions stay normalized on R³.
 */
export function sampleOrbital(
  model: OrbitalModel,
  count = 10000,
  seed = 1947,
): OrbitalPoint[] {
  if (!Number.isInteger(count) || count < 0 || count > 100000)
    throw new RangeError("Invalid orbital point count");
  const random = generator(seed),
    bins = 8192;
  const dr = model.extent / bins;
  const cdf = new Float64Array(bins + 1);
  let previous = model.radialProbability(0);
  for (let i = 1; i <= bins; i++) {
    const current = model.radialProbability(i * dr);
    cdf[i] = cdf[i - 1] + 0.5 * dr * (previous + current);
    previous = current;
  }
  const angularMaximum =
    model.l === 0
      ? 1 / (4 * Math.PI)
      : model.l === 1
        ? 3 / (4 * Math.PI)
        : model.orbital === "dz2"
          ? 5 / (4 * Math.PI)
          : 15 / (16 * Math.PI);
  return Array.from({ length: count }, () => {
    const target = random() * cdf[bins];
    let lo = 0,
      hi = bins;
    while (hi - lo > 1) {
      const mid = (lo + hi) >>> 1;
      if (cdf[mid] < target) lo = mid;
      else hi = mid;
    }
    const fraction = (target - cdf[lo]) / (cdf[hi] - cdf[lo] || 1);
    const radius = dr * (lo + fraction);
    let x = 0,
      y = 0,
      z = 1;
    do {
      z = 2 * random() - 1;
      const sine = Math.sqrt(1 - z * z),
        phi = 2 * Math.PI * random();
      x = sine * Math.cos(phi);
      y = sine * Math.sin(phi);
    } while (random() * angularMaximum > model.angularAmplitude(x, y, z) ** 2);
    x *= radius;
    y *= radius;
    z *= radius;
    return { x, y, z, phase: model.wavefunction(x, y, z) >= 0 ? 1 : -1 };
  });
}

export interface RadialIsosurface {
  radius: number;
  phase: 1 | -1;
  /** Surface normal points out of the higher-density region. */
  normalSign: 1 | -1;
}

/** Exact spherical level sets for s states. Dense radial brackets and bisection
 * resolve small inner Fe 4s shells that a uniform full-extent cube would miss.
 */
export function findRadialIsosurfaces(
  model: OrbitalModel,
  densityFraction: number,
): RadialIsosurface[] {
  if (model.l !== 0)
    throw new RangeError("Radial spheres require an s orbital");
  if (
    !Number.isFinite(densityFraction) ||
    densityFraction <= 0 ||
    densityFraction >= 1
  )
    throw new RangeError("Density fraction must lie between zero and one");
  const density = densityFraction * model.maxDensity;
  const fn = (r: number) => model.wavefunction(r, 0, 0) ** 2 - density;
  return roots(fn, model.extent, 16384).map((radius) => {
    const h = Math.min(1e-5, radius * 1e-4);
    return {
      radius,
      phase: model.wavefunction(radius, 0, 0) >= 0 ? 1 : -1,
      normalSign: fn(radius + h) < fn(radius - h) ? 1 : -1,
    };
  });
}
