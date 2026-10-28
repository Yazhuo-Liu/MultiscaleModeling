import test from "node:test";
import assert from "node:assert/strict";
import {
  createVacancyDemo,
  metropolisProbability,
  vacancySiteEnergy,
  VACANCY_DIRECTIONS,
} from "./vacancy-demo";

test("vacancy exchange conserves 124 unique atoms and exactly one vacancy", () => {
  const demo = createVacancyDemo({ temperature: 0.6, trap: 1.5 });
  for (let i = 0; i < 1500; i++) {
    const frame = demo.attempt();
    assert.equal(frame.atoms.length, 124);
    assert.equal(new Set(frame.atoms.map((a) => a.id)).size, 124);
    assert.equal(new Set(frame.atoms.map((a) => a.site.join(","))).size, 124);
    assert.ok(
      !frame.atoms.some((a) => a.site.join(",") === frame.vacancy.join(",")),
    );
    assert.ok(
      frame.atoms.every((a) => a.site.every((x) => x >= 0 && x < frame.size)),
    );
    const m = frame.move!;
    assert.equal(
      m.to.reduce((sum, x, j) => sum + Math.abs(x - m.from[j]), 0),
      1,
    );
    if (m.boundary) assert.equal(m.accepted, false);
  }
});
test("first untrapped proposal exchanges the tracked atom without a scripted direction", () => {
  const demo = createVacancyDemo();
  const before = demo.snapshot();
  const frame = demo.attempt();
  assert.equal(frame.move?.atomId, frame.taggedId);
  assert.equal(frame.move?.accepted, true);
  assert.deepEqual(
    frame.atoms.find((a) => a.id === frame.taggedId)?.site,
    before.vacancy,
  );
  assert.equal(frame.taggedTrail.length, 2);
  assert.deepEqual(demo.reset(), before);
});
test("symmetric proposals and Metropolis acceptance satisfy pairwise detailed balance", () => {
  const temperature = 0.6,
    trap = 1.7;
  const a: [number, number, number] = [2, 2, 2];
  for (const d of VACANCY_DIRECTIONS) {
    const b = a.map((x, i) => x + d[i]) as [number, number, number];
    const ea = vacancySiteEnergy(a, trap),
      eb = vacancySiteEnergy(b, trap);
    const forward =
      (Math.exp(-ea / temperature) / 6) *
      metropolisProbability(eb - ea, temperature);
    const reverse =
      (Math.exp(-eb / temperature) / 6) *
      metropolisProbability(ea - eb, temperature);
    assert.ok(Math.abs(forward - reverse) < 1e-12);
  }
  assert.equal(metropolisProbability(-1, 0.1), 1);
  assert.ok(metropolisProbability(1, 0.2) < metropolisProbability(1, 1));
});
test("untrapped finite lattice rejects boundary proposals and holds all site energies equal", () => {
  const demo = createVacancyDemo();
  let rejected = 0;
  for (let i = 0; i < 5000; i++) {
    const frame = demo.attempt();
    if (!frame.move!.accepted) {
      rejected++;
      assert.equal(frame.move!.boundary, true);
    }
    assert.equal(frame.move!.deltaEnergy, 0);
  }
  assert.ok(rejected > 0);
});
test("sampling state is copied and deterministic, parameters stay bounded", () => {
  const demo = createVacancyDemo({ temperature: NaN, trap: Infinity });
  assert.deepEqual(demo.snapshot().parameters, { temperature: 1, trap: 0 });
  const a = demo.snapshot();
  a.atoms[0].site[0] = 99;
  assert.notEqual(demo.snapshot().atoms[0].site[0], 99);
  const other = createVacancyDemo();
  for (let i = 0; i < 100; i++)
    assert.deepEqual(demo.attempt(), other.attempt());
});
