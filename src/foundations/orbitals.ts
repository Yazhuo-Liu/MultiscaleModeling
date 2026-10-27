/** Dimensionless hydrogen coordinates use a₀; ψ is in a₀⁻³ᐟ² and P(r) in a₀⁻¹. */
export type HydrogenOrbital = "1s" | "2s" | "2pz";
export type IronOrbital = "dz2" | "dx2-y2" | "dxy" | "dxz" | "dyz";
export type Atom = "H" | "Fe";

export const HYDROGEN_ORBITALS: HydrogenOrbital[] = ["1s", "2s", "2pz"];
export const IRON_ORBITALS: IronOrbital[] = [
  "dz2",
  "dx2-y2",
  "dxy",
  "dxz",
  "dyz",
];
export const ORBITAL_LATEX: Record<HydrogenOrbital | IronOrbital, string> = {
  "1s": "1s",
  "2s": "2s",
  "2pz": "2p_z",
  dz2: "3d_{z^2}",
  "dx2-y2": "3d_{x^2-y^2}",
  dxy: "3d_{xy}",
  dxz: "3d_{xz}",
  dyz: "3d_{yz}",
};

export function hydrogenWavefunction(
  orbital: HydrogenOrbital,
  x: number,
  y: number,
  z: number,
): number {
  const r = Math.hypot(x, y, z);
  if (orbital === "1s") return Math.exp(-r) / Math.sqrt(Math.PI);
  const factor = Math.exp(-r / 2) / (4 * Math.sqrt(2 * Math.PI));
  return factor * (orbital === "2s" ? 2 - r : z);
}

export function hydrogenRadialProbability(
  orbital: HydrogenOrbital,
  r: number,
): number {
  if (r < 0) return 0;
  if (orbital === "1s") return 4 * r * r * Math.exp(-2 * r);
  if (orbital === "2s") return (r * r * (2 - r) ** 2 * Math.exp(-r)) / 8;
  return (r ** 4 * Math.exp(-r)) / 24;
}

export function hydrogenCumulativeProbability(
  orbital: HydrogenOrbital,
  r: number,
): number {
  if (r <= 0) return 0;
  if (orbital === "1s") return 1 - Math.exp(-2 * r) * (1 + 2 * r + 2 * r * r);
  if (orbital === "2s")
    return 1 - (Math.exp(-r) * (r ** 4 + 4 * r * r + 8 * r + 8)) / 8;
  return 1 - Math.exp(-r) * (1 + r + (r * r) / 2 + r ** 3 / 6 + r ** 4 / 24);
}

export const HYDROGEN_EXTENT: Record<HydrogenOrbital, number> = {
  "1s": 8,
  "2s": 20,
  "2pz": 20,
};

/** Normalized real d spherical harmonics; NO Fe radial approximation is implied. */
export function ironAngularAmplitude(
  orbital: IronOrbital,
  x: number,
  y: number,
  z: number,
): number {
  const r2 = x * x + y * y + z * z;
  if (r2 === 0) return 0;
  if (orbital === "dz2")
    return Math.sqrt(5 / (16 * Math.PI)) * ((3 * z * z) / r2 - 1);
  if (orbital === "dx2-y2")
    return (Math.sqrt(15 / (16 * Math.PI)) * (x * x - y * y)) / r2;
  const product = orbital === "dxy" ? x * y : orbital === "dxz" ? x * z : y * z;
  return (Math.sqrt(15 / (4 * Math.PI)) * product) / r2;
}

export function ironSlicePlane(orbital: IronOrbital): "xz" | "xy" | "yz" {
  return orbital === "dyz"
    ? "yz"
    : orbital === "dxy" || orbital === "dx2-y2"
      ? "xy"
      : "xz";
}

export interface Subshell {
  n: number;
  label: string;
  l: number;
  electrons: number;
}
export const GROUND_SUBSHELLS: Record<Atom, readonly Subshell[]> = {
  H: [{ n: 1, label: "1s", l: 0, electrons: 1 }],
  Fe: [
    { n: 1, label: "1s", l: 0, electrons: 2 },
    { n: 2, label: "2s", l: 0, electrons: 2 },
    { n: 2, label: "2p", l: 1, electrons: 6 },
    { n: 3, label: "3s", l: 0, electrons: 2 },
    { n: 3, label: "3p", l: 1, electrons: 6 },
    { n: 3, label: "3d", l: 2, electrons: 6 },
    { n: 4, label: "4s", l: 0, electrons: 2 },
  ],
};

export function shellPopulation(atom: Atom): number[] {
  const result: number[] = [];
  for (const shell of GROUND_SUBSHELLS[atom])
    result[shell.n - 1] = (result[shell.n - 1] ?? 0) + shell.electrons;
  return result;
}

export function hundOccupancy(l: number, electrons: number): string[] {
  const count = 2 * l + 1;
  if (
    !Number.isInteger(l) ||
    l < 0 ||
    !Number.isInteger(electrons) ||
    electrons < 0 ||
    electrons > 2 * count
  ) {
    throw new RangeError("Invalid subshell population");
  }
  return Array.from({ length: count }, (_, i) =>
    i >= electrons ? "" : electrons > count + i ? "↑↓" : "↑",
  );
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

export interface OrbitalPoint {
  x: number;
  y: number;
  z: number;
  phase: 1 | -1;
}

/** Inverse-CDF radial sampling plus exact s/p angular sampling; bounded drawing volume. */
export function sampleHydrogen(
  orbital: HydrogenOrbital,
  count = 6500,
  seed = 1947,
): OrbitalPoint[] {
  const random = generator(seed);
  const extent = HYDROGEN_EXTENT[orbital];
  const cdfLimit = hydrogenCumulativeProbability(orbital, extent);
  return Array.from({ length: count }, () => {
    const target = random() * cdfLimit;
    let lo = 0,
      hi = extent;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      if (hydrogenCumulativeProbability(orbital, mid) < target) lo = mid;
      else hi = mid;
    }
    const r = (lo + hi) / 2;
    const cosine =
      orbital === "2pz" ? Math.cbrt(2 * random() - 1) : 2 * random() - 1;
    const sine = Math.sqrt(1 - cosine * cosine);
    const phi = 2 * Math.PI * random();
    const x = r * sine * Math.cos(phi),
      y = r * sine * Math.sin(phi),
      z = r * cosine;
    return {
      x,
      y,
      z,
      phase: hydrogenWavefunction(orbital, x, y, z) >= 0 ? 1 : -1,
    };
  });
}

/** Surface radius ∝ |Y₂m|; its colors represent sign, not electrical charge. */
export function ironAngularSurface(
  orbital: IronOrbital,
  polarSteps = 64,
  azimuthSteps = 128,
) {
  const positions: number[] = [],
    phases: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= polarSteps; i++) {
    const theta = (Math.PI * i) / polarSteps;
    for (let j = 0; j <= azimuthSteps; j++) {
      const phi = (2 * Math.PI * j) / azimuthSteps;
      const x = Math.sin(theta) * Math.cos(phi),
        y = Math.sin(theta) * Math.sin(phi),
        z = Math.cos(theta);
      const amplitude = ironAngularAmplitude(orbital, x, y, z);
      const radius = 2.5 * Math.abs(amplitude);
      positions.push(radius * x, radius * y, radius * z);
      phases.push(amplitude >= 0 ? 1 : -1);
      if (i < polarSteps && j < azimuthSteps) {
        const a = i * (azimuthSteps + 1) + j,
          b = a + azimuthSteps + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  return { positions, phases, indices };
}
