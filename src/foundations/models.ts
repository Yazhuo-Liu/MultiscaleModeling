/** Small teaching models. Units are explicit; these are not material databases. */
export const ROD = { forceN: 1000, areaMm2: 10, lengthMm: 100 } as const;

function positive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(`${label} must be finite and positive`);
}

export function rodResponse(modulusGPa: number) {
  positive(modulusGPa, "Young's modulus");
  const stiffnessNPerMm = (modulusGPa * 1000 * ROD.areaMm2) / ROD.lengthMm;
  return {
    stiffnessNPerMm,
    displacementMm: ROD.forceN / stiffnessNPerMm,
  };
}

export function linearizedRodUncertainty(modulusGPa: number, cv: number) {
  if (!Number.isFinite(cv) || cv < 0)
    throw new RangeError(
      "Coefficient of variation must be finite and nonnegative",
    );
  const response = rodResponse(modulusGPa);
  return {
    ...response,
    modulusStdGPa: modulusGPa * cv,
    stiffnessStdNPerMm: response.stiffnessNPerMm * cv,
    displacementStdMm: response.displacementMm * cv,
    // k and u share E. This is the local linear covariance, not a claim
    // that finite-amplitude nonlinear samples have Pearson correlation -1.
    covarianceN: -ROD.forceN * cv * cv,
    productStdN: 0,
    independentProductStdN: Math.SQRT2 * ROD.forceN * cv,
  };
}

/** Equal-weight bounded samples with exactly the requested population moments. */
export function boundedModuli(modulusGPa: number, cv: number, count = 41) {
  positive(modulusGPa, "Young's modulus");
  if (!Number.isFinite(cv) || cv < 0 || !Number.isInteger(count) || count < 2)
    throw new RangeError(
      "Require nonnegative finite CV and at least two samples",
    );
  const standardDeviation = Math.sqrt((count * count - 1) / 12);
  const values = Array.from({ length: count }, (_, i) => {
    const z = (i - (count - 1) / 2) / standardDeviation;
    return modulusGPa * (1 + cv * z);
  });
  if (values.some((value) => value <= 0))
    throw new RangeError(
      "This bounded sample must have positive elastic moduli",
    );
  return values;
}

/** Two sites per unit cell, nearest-neighbor hopping, on-site energy zero. */
export function sshBands(ka: number, t1 = 1, t2 = 0.6) {
  if (![ka, t1, t2].every(Number.isFinite) || t1 < 0 || t2 < 0)
    throw new RangeError("Require finite ka and nonnegative hopping energies");
  const energy = Math.sqrt(
    Math.max(0, t1 * t1 + t2 * t2 + 2 * t1 * t2 * Math.cos(ka)),
  );
  return { lower: -energy, upper: energy };
}

export function sshGap(t1 = 1, t2 = 0.6) {
  sshBands(0, t1, t2);
  return 2 * Math.abs(t1 - t2);
}

export interface PhasePoint {
  label: string;
  composition: number;
  energy: number;
}

export const REFERENCE_PHASES: readonly PhasePoint[] = [
  { label: "A", composition: 0, energy: 0 },
  { label: "AB", composition: 0.5, energy: -0.3 },
  { label: "B", composition: 1, energy: 0 },
];

/** Lower convex envelope, including duplicate-composition polymorphs safely. */
export function lowerConvexHull(points: readonly PhasePoint[]): PhasePoint[] {
  if (
    points.some(
      ({ composition, energy }) =>
        !Number.isFinite(composition) ||
        !Number.isFinite(energy) ||
        composition < 0 ||
        composition > 1,
    )
  )
    throw new RangeError("Require finite energies and compositions in [0, 1]");
  const sorted = [...points].sort(
    (a, b) => a.composition - b.composition || a.energy - b.energy,
  );
  const unique = sorted.filter(
    (point, i) => i === 0 || point.composition !== sorted[i - 1].composition,
  );
  const hull: PhasePoint[] = [];
  for (const point of unique) {
    while (hull.length >= 2) {
      const a = hull[hull.length - 2];
      const b = hull[hull.length - 1];
      const cross =
        (b.composition - a.composition) * (point.energy - a.energy) -
        (b.energy - a.energy) * (point.composition - a.composition);
      if (cross > 1e-12) break;
      hull.pop();
    }
    hull.push(point);
  }
  return hull;
}

export function hullEnergyAt(hull: readonly PhasePoint[], composition: number) {
  if (
    hull.length < 2 ||
    !Number.isFinite(composition) ||
    composition < hull[0].composition ||
    composition > hull[hull.length - 1].composition
  )
    throw new RangeError(
      "Composition must lie inside a hull with two endpoints",
    );
  for (let i = 1; i < hull.length; i++) {
    const left = hull[i - 1];
    const right = hull[i];
    if (composition <= right.composition) {
      const fraction =
        (composition - left.composition) /
        (right.composition - left.composition);
      return left.energy + fraction * (right.energy - left.energy);
    }
  }
  throw new RangeError("No bracketing hull segment");
}

export function assessCandidate(energy: number, composition = 0.25) {
  const candidate = { label: "A₃B", composition, energy };
  const referenceHull = lowerConvexHull(REFERENCE_PHASES);
  const hull = lowerConvexHull([...REFERENCE_PHASES, candidate]);
  const competingEnergy = hullEnergyAt(referenceHull, composition);
  const hullEnergy = hullEnergyAt(hull, composition);
  const excessOverCompetitors = energy - competingEnergy;
  return {
    candidate,
    referenceHull,
    hull,
    competingEnergy,
    excessOverCompetitors,
    energyAboveHull: Math.max(0, energy - hullEnergy),
    onHull: energy - hullEnergy < 1e-10,
  };
}
