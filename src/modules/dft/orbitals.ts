/**
 * Real hydrogen-like atomic orbitals (a.u., Z=1).
 * Probability density |ψ|² with phase coloring from sign(ψ).
 */

export type OrbitalId = "1s" | "2pz" | "2px" | "3dz2" | "3dxy";

export interface OrbitalSpec {
  id: OrbitalId;
  label: string;
  /** Approximate radial extent for sampling (Bohr radii). */
  rMax: number;
}

export const ORBITALS: OrbitalSpec[] = [
  { id: "1s", label: "1s", rMax: 6 },
  { id: "2pz", label: "2p₂", rMax: 14 },
  { id: "2px", label: "2pₓ", rMax: 14 },
  { id: "3dz2", label: "3d_z²", rMax: 22 },
  { id: "3dxy", label: "3d_xy", rMax: 22 },
];

/** Unnormalized real hydrogenic wavefunctions (shape-correct for visualization). */
export function psi(id: OrbitalId, x: number, y: number, z: number): number {
  const r = Math.hypot(x, y, z);
  if (r < 1e-8) {
    // Angular factors vanish on axis for most; 1s is finite
    return id === "1s" ? 1 : 0;
  }
  const rho = r; // a0 = 1

  switch (id) {
    case "1s":
      // R10 ~ 2 e^{-r}, Y00 const → spherical
      return Math.exp(-rho);
    case "2pz": {
      // R21 ~ r e^{-r/2}, Y10 ~ cosθ → dumbbell along z
      const cosT = z / r;
      return rho * Math.exp(-rho / 2) * cosT;
    }
    case "2px": {
      // ~ r e^{-r/2} sinθ cosφ → dumbbell along x
      return rho * Math.exp(-rho / 2) * (x / r);
    }
    case "3dz2": {
      // R32 ~ r² e^{-r/3}, Y20 ~ 3cos²θ − 1 → dz²
      const cosT = z / r;
      return rho * rho * Math.exp(-rho / 3) * (3 * cosT * cosT - 1);
    }
    case "3dxy": {
      // ~ r² e^{-r/3} sin²θ sin(2φ) → four-lobe clover in xy
      return rho * rho * Math.exp(-rho / 3) * ((x * y) / (r * r));
    }
    default:
      return 0;
  }
}

export interface OrbitalCloud {
  positions: Float32Array;
  phases: Float32Array; // +1 / -1
  count: number;
}

/**
 * Rejection-sample points from |ψ|².
 * Phase is sign(ψ) — the textbook red/blue lobe convention.
 */
export function sampleOrbital(
  id: OrbitalId,
  count: number,
  seed = 1,
): OrbitalCloud {
  const spec = ORBITALS.find((o) => o.id === id)!;
  const rMax = spec.rMax;
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  // Estimate max |ψ|² on a coarse grid for rejection bound
  let pMax = 0;
  const grid = 28;
  for (let i = 0; i <= grid; i++) {
    for (let j = 0; j <= grid; j++) {
      for (let k = 0; k <= grid; k++) {
        const x = ((i / grid) * 2 - 1) * rMax;
        const y = ((j / grid) * 2 - 1) * rMax;
        const z = ((k / grid) * 2 - 1) * rMax;
        const p = psi(id, x, y, z);
        pMax = Math.max(pMax, p * p);
      }
    }
  }
  pMax *= 1.15;

  let rng = seed >>> 0;
  const rand = () => {
    rng = (1664525 * rng + 1013904223) >>> 0;
    return rng / 0x100000000;
  };

  let filled = 0;
  let attempts = 0;
  const maxAttempts = count * 80;
  while (filled < count && attempts < maxAttempts) {
    attempts++;
    const x = (rand() * 2 - 1) * rMax;
    const y = (rand() * 2 - 1) * rMax;
    const z = (rand() * 2 - 1) * rMax;
    const v = psi(id, x, y, z);
    const dens = v * v;
    if (rand() * pMax > dens) continue;
    positions[filled * 3] = x;
    positions[filled * 3 + 1] = y;
    positions[filled * 3 + 2] = z;
    phases[filled] = v >= 0 ? 1 : -1;
    filled++;
  }

  return {
    positions: positions.subarray(0, filled * 3),
    phases: phases.subarray(0, filled),
    count: filled,
  };
}

/** World-space scale so different orbitals fill a similar viewport. */
export function orbitalDisplayScale(id: OrbitalId): number {
  switch (id) {
    case "1s":
      return 0.85;
    case "2pz":
    case "2px":
      return 0.38;
    case "3dz2":
    case "3dxy":
      return 0.24;
    default:
      return 0.4;
  }
}
