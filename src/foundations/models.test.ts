import assert from "node:assert/strict";
import test from "node:test";
import {
  assessCandidate,
  boundedModuli,
  hullEnergyAt,
  linearizedRodUncertainty,
  lowerConvexHull,
  rodResponse,
  sshBands,
  sshGap,
} from "./models";

function near(actual: number, expected: number, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);
}

test("rod teaching example converts GPa to N/mm² consistently", () => {
  const response = rodResponse(200);
  near(response.stiffnessNPerMm, 20000);
  near(response.displacementMm, 0.05);
  near(rodResponse(400).displacementMm, 0.025);
  assert.throws(() => rodResponse(0), RangeError);
});

test("local covariance cancels the product uncertainty of a shared modulus", () => {
  const model = linearizedRodUncertainty(200, 0.05);
  near(model.modulusStdGPa, 10);
  near(model.stiffnessStdNPerMm, 1000);
  near(model.displacementStdMm, 0.0025);
  near(model.covarianceN, -2.5);
  const propagatedVariance =
    model.displacementMm ** 2 * model.stiffnessStdNPerMm ** 2 +
    model.stiffnessNPerMm ** 2 * model.displacementStdMm ** 2 +
    2 * model.displacementMm * model.stiffnessNPerMm * model.covarianceN;
  near(propagatedVariance, 0);
  near(model.independentProductStdN, Math.SQRT2 * 50);
  near(model.productStdN, 0);
});

test("bounded equal-weight moduli preserve specified moments and positive values", () => {
  for (const cv of [0, 0.01, 0.05, 0.2]) {
    const samples = boundedModuli(200, cv);
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance =
      samples.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      samples.length;
    near(mean, 200);
    near(Math.sqrt(variance), 200 * cv);
    for (const value of samples) {
      assert.ok(value > 0);
      const { stiffnessNPerMm: k, displacementMm: u } = rodResponse(value);
      near(k * u, 1000);
    }
  }
  assert.throws(() => boundedModuli(200, 1), RangeError);
  assert.throws(() => boundedModuli(200, 0.1, 1), RangeError);
});

test("finite-amplitude rod samples are anticorrelated without an exact linear correlation", () => {
  const samples = boundedModuli(200, 0.2).map(rodResponse);
  const meanK =
    samples.reduce((s, v) => s + v.stiffnessNPerMm, 0) / samples.length;
  const meanU =
    samples.reduce((s, v) => s + v.displacementMm, 0) / samples.length;
  let covariance = 0;
  let varianceK = 0;
  let varianceU = 0;
  for (const { stiffnessNPerMm: k, displacementMm: u } of samples) {
    covariance += (k - meanK) * (u - meanU);
    varianceK += (k - meanK) ** 2;
    varianceU += (u - meanU) ** 2;
  }
  const correlation = covariance / Math.sqrt(varianceK * varianceU);
  assert.ok(correlation > -1 && correlation < -0.9);
});

test("SSH bands respect symmetry, periodicity and analytic band edges", () => {
  near(sshBands(0).upper, 1.6);
  near(sshBands(Math.PI).upper, 0.4);
  near(sshGap(), 0.8);
  for (const ka of [-2, 0, 0.9, Math.PI]) {
    const bands = sshBands(ka);
    near(bands.upper, -bands.lower);
    near(bands.upper, sshBands(-ka).upper);
    near(bands.upper, sshBands(ka + 2 * Math.PI).upper);
  }
});

test("SSH uniform chain closes its gap and exchanging hoppings preserves energies", () => {
  near(sshGap(1, 1), 0);
  near(sshBands(Math.PI, 1, 1).upper, 0);
  near(sshGap(1, 0), 2);
  near(sshBands(0.8, 1, 0.6).upper, sshBands(0.8, 0.6, 1).upper);
  assert.throws(() => sshBands(0, -1, 0.6), RangeError);
});

test("negative formation energy alone does not imply hull stability", () => {
  const result = assessCandidate(-0.1);
  near(result.competingEnergy, -0.15);
  near(result.energyAboveHull, 0.05);
  assert.equal(result.onHull, false);
  assert.deepEqual(
    result.hull.map((p) => p.label),
    ["A", "AB", "B"],
  );
});

test("candidate enters the new hull when below its competing mixture", () => {
  const result = assessCandidate(-0.2);
  near(result.excessOverCompetitors, -0.05);
  near(result.energyAboveHull, 0);
  assert.equal(result.onHull, true);
  assert.deepEqual(
    result.hull.map((p) => p.label),
    ["A", "A₃B", "AB", "B"],
  );
  near(hullEnergyAt(result.hull, 0.25), -0.2);
  near(assessCandidate(-0.15).energyAboveHull, 0);
});

test("convex hull handles collinear phases and competing polymorphs", () => {
  const hull = lowerConvexHull([
    { label: "B", composition: 1, energy: 0 },
    { label: "higher", composition: 0.5, energy: -0.1 },
    { label: "A", composition: 0, energy: 0 },
    { label: "lower", composition: 0.5, energy: -0.3 },
    { label: "tie", composition: 0.25, energy: -0.15 },
  ]);
  assert.deepEqual(
    hull.map((p) => p.label),
    ["A", "lower", "B"],
  );
  near(hullEnergyAt(hull, 0.75), -0.15);
  assert.throws(() => hullEnergyAt(hull, 1.1), RangeError);
  assert.throws(() => assessCandidate(Number.NaN), RangeError);
});
