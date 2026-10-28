import { randomGenerator } from "./utils";

export type LatticeSite = [number, number, number];
export interface VacancyParameters {
  temperature: number;
  trap: number;
}
export interface VacancyMove {
  from: LatticeSite;
  to: LatticeSite;
  atomId: number | null;
  accepted: boolean;
  boundary: boolean;
  deltaEnergy: number;
  probability: number;
}
export interface VacancyFrame {
  size: number;
  attempts: number;
  accepted: number;
  vacancy: LatticeSite;
  atoms: { id: number; site: LatticeSite }[];
  vacancyTrail: LatticeSite[];
  move: VacancyMove | null;
  parameters: VacancyParameters;
}
export const VACANCY_SIZE = 5;
export const VACANCY_CENTER: LatticeSite = [2, 2, 2];
export const VACANCY_DIRECTIONS: LatticeSite[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const copy = (p: LatticeSite): LatticeSite => [...p];
const index = ([x, y, z]: LatticeSite) =>
  x + VACANCY_SIZE * (y + VACANCY_SIZE * z);
const site = (i: number): LatticeSite => [
  i % 5,
  Math.floor(i / 5) % 5,
  Math.floor(i / 25),
];
export function vacancySiteEnergy(p: LatticeSite, trap: number) {
  const radiusSquared = p.reduce(
    (sum, x, i) => sum + (x - VACANCY_CENTER[i]) ** 2,
    0,
  );
  return -trap * Math.exp(-radiusSquared / 1.5);
}
export function metropolisProbability(
  deltaEnergy: number,
  temperature: number,
) {
  return deltaEnergy <= 0 ? 1 : Math.exp(-deltaEnergy / temperature);
}
/** A finite lattice sampler: no force evaluations, no physical clock. All six
 * directions have proposal probability 1/6, including rejected boundary moves. */
export function createVacancyDemo(
  initial: VacancyParameters = { temperature: 1, trap: 0 },
  seed = 17,
) {
  let parameters = { ...initial };
  let rng = randomGenerator(seed);
  let occupancy: number[] = [];
  let vacancy: LatticeSite = copy(VACANCY_CENTER);
  let attempts = 0;
  let accepted = 0;
  let move: VacancyMove | null = null;
  let vacancyTrail: LatticeSite[] = [];
  function snapshot(): VacancyFrame {
    return {
      size: VACANCY_SIZE,
      attempts,
      accepted,
      vacancy: copy(vacancy),
      atoms: occupancy.flatMap((id, i) =>
        id < 0 ? [] : [{ id, site: site(i) }],
      ),
      vacancyTrail: vacancyTrail.map(copy),
      move: move ? { ...move, from: copy(move.from), to: copy(move.to) } : null,
      parameters: { ...parameters },
    };
  }
  function reset(next = parameters) {
    parameters = {
      temperature: Number.isFinite(next.temperature)
        ? Math.max(0.1, Math.min(3, next.temperature))
        : 1,
      trap: Number.isFinite(next.trap)
        ? Math.max(0, Math.min(4, next.trap))
        : 0,
    };
    rng = randomGenerator(seed);
    vacancy = copy(VACANCY_CENTER);
    occupancy = Array.from({ length: VACANCY_SIZE ** 3 }, (_, i) =>
      i === index(vacancy) ? -1 : i,
    );
    attempts = accepted = 0;
    move = null;
    vacancyTrail = [copy(vacancy)];
    return snapshot();
  }
  function attempt() {
    const direction = VACANCY_DIRECTIONS[Math.floor(rng() * 6)];
    const target = vacancy.map((x, i) => x + direction[i]) as LatticeSite;
    attempts++;
    const boundary = target.some((x) => x < 0 || x >= VACANCY_SIZE);
    if (boundary) {
      move = {
        from: copy(vacancy),
        to: target,
        atomId: null,
        accepted: false,
        boundary: true,
        deltaEnergy: 0,
        probability: 0,
      };
      return snapshot();
    }
    const deltaEnergy =
      vacancySiteEnergy(target, parameters.trap) -
      vacancySiteEnergy(vacancy, parameters.trap);
    const probability = metropolisProbability(
      deltaEnergy,
      parameters.temperature,
    );
    const isAccepted = probability === 1 || rng() < probability;
    const atomId = occupancy[index(target)];
    move = {
      from: copy(vacancy),
      to: copy(target),
      atomId,
      accepted: isAccepted,
      boundary: false,
      deltaEnergy,
      probability,
    };
    if (isAccepted) {
      occupancy[index(vacancy)] = atomId;
      occupancy[index(target)] = -1;
      vacancy = copy(target);
      vacancyTrail.push(copy(vacancy));
      vacancyTrail = vacancyTrail.slice(-100);
      accepted++;
    }
    return snapshot();
  }
  reset();
  return { snapshot, reset, attempt };
}

/** The same finite-lattice Metropolis model, written as an introductory script. */
export const VACANCY_DEMO_CODE = `import numpy as np

rng = np.random.default_rng(17)
size = 5
center = np.array([2, 2, 2])
vacancy = center.copy()
lattice = np.arange(size**3).reshape((size, size, size))
lattice[tuple(vacancy)] = -1  # one empty site; every other site holds an atom ID
T, trap = 0.25, 2.0  # teaching units; try T=1.5 with the same trap
moves = np.array([[1,0,0], [-1,0,0], [0,1,0],
                  [0,-1,0], [0,0,1], [0,0,-1]])

def energy(site):
    return -trap * np.exp(-np.sum((site - center)**2) / 1.5)

accepted = 0
path = [vacancy.copy()]
for attempt in range(1000):
    # Keep all six proposals equally likely, including at a boundary.
    target = vacancy + moves[rng.integers(6)]
    if np.any(target < 0) or np.any(target >= size):
        continue
    delta = energy(target) - energy(vacancy)
    if delta <= 0 or rng.random() < np.exp(-delta / T):
        lattice[tuple(vacancy)] = lattice[tuple(target)]
        lattice[tuple(target)] = -1
        vacancy = target
        accepted += 1
        path.append(vacancy.copy())

assert np.sum(lattice == -1) == 1
assert len(np.unique(lattice[lattice >= 0])) == size**3 - 1
print("Attempts:", 1000, "accepted exchanges:", accepted)
# Attempts are sampling steps, not physical time. No diffusion coefficient is inferred.
`;
