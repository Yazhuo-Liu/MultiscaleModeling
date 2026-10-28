import type {
  Point3,
  Simulation,
  SimulationDefinition,
  SimulationFrame,
} from "../types";
import { countSteps, parameter, randomGenerator } from "./utils";

export type SpatialMethodId = "md" | "phase-field";

export const spatialSimulationDefinitions: Record<
  SpatialMethodId,
  SimulationDefinition
> = {
  md: {
    view: "particles",
    description:
      "108 个三维 Lennard–Jones 粒子，从 3×3×3 个 FCC 晶胞开始；三个方向均采用周期边界并计算力、速度和位移。速度 Verlet，Δt=0.002 τLJ，势能在 2.5σ 截断并平移。初始温度按 3(N−1) 个自由度设置；不使用恒温器，FCC 初态不保证维持固态。",
    controls: [
      {
        key: "temperature",
        label: "初始约化温度",
        min: 0.1,
        max: 1.5,
        step: 0.1,
        initial: 0.5,
        unit: "ε/kB",
      },
      {
        key: "density",
        label: "三维数密度",
        min: 0.3,
        max: 0.8,
        step: 0.05,
        initial: 0.6,
        unit: "σ⁻³",
      },
    ],
  },
  "phase-field": {
    view: "field",
    description:
      "24×24×24 三维 Allen–Cahn 体网格，六个空间邻居、三方向周期边界与双阱自由能；显式 Δt=0.015、Δx=1。φ=0 等值面表示两相之间的界面，截面显示相应深度的实际体数据。序参量不守恒，全部采用约化单位，不适用于守恒浓度扩散。",
    controls: [
      {
        key: "mobility",
        label: "迁移率 M",
        min: 0.1,
        max: 2,
        step: 0.1,
        initial: 1,
      },
      {
        key: "gradient",
        label: "梯度能系数 κ",
        min: 0.2,
        max: 2,
        step: 0.1,
        initial: 1,
      },
    ],
  },
};

const CUTOFF = 2.5;
const CUTOFF_ENERGY = 4 * ((1 / CUTOFF) ** 12 - (1 / CUTOFF) ** 6);

/** Pair forces use the minimum image in all three physical coordinates. */
export function lennardJonesForces3D(
  points: readonly Point3[],
  box: number,
): { forces: Float64Array; potential: number } {
  const forces = new Float64Array(points.length * 3);
  let potential = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[j].x - points[i].x;
      let dy = points[j].y - points[i].y;
      let dz = points[j].z - points[i].z;
      dx -= box * Math.round(dx / box);
      dy -= box * Math.round(dy / box);
      dz -= box * Math.round(dz / box);
      const r2 = dx * dx + dy * dy + dz * dz;
      if (r2 >= CUTOFF * CUTOFF) continue;
      if (r2 <= 1e-16) throw new RangeError("Overlapping Lennard–Jones atoms");
      const inverse = 1 / r2;
      const r6 = inverse ** 3;
      const force = -24 * inverse * (2 * r6 * r6 - r6);
      const offsetI = 3 * i;
      const offsetJ = 3 * j;
      forces[offsetI] += force * dx;
      forces[offsetI + 1] += force * dy;
      forces[offsetI + 2] += force * dz;
      forces[offsetJ] -= force * dx;
      forces[offsetJ + 1] -= force * dy;
      forces[offsetJ + 2] -= force * dz;
      potential += 4 * (r6 * r6 - r6) - CUTOFF_ENERGY;
    }
  }
  return { forces, potential };
}

function createMolecularDynamics3D(
  initial: Record<string, number>,
): Simulation {
  // 108 particles keep L/2 > r_cut even at the largest permitted density.
  const count = 108;
  const dt = 0.002;
  const axes = ["x", "y", "z"] as const;
  let params = initial;
  let box = 1;
  let time = 0;
  let points: Point3[] = [];
  let velocities = new Float64Array(count * 3);
  let forces: Float64Array = new Float64Array(count * 3);
  let potential = 0;
  const kinetic = () => velocities.reduce((sum, v) => sum + (v * v) / 2, 0);
  const calculateForces = () => {
    const result = lennardJonesForces3D(points, box);
    forces = result.forces;
    potential = result.potential;
  };
  const frame = (): SimulationFrame => ({
    time,
    box,
    points: points.map((point) => ({ ...point, radius: 0.23 })),
    metrics: [
      {
        label: "约化温度",
        value: (2 * kinetic()) / (3 * (count - 1)),
        unit: "ε/kB",
      },
      {
        label: "总能量 / 粒子",
        value: (kinetic() + potential) / count,
        unit: "ε",
      },
      { label: "粒子数", value: count },
      { label: "模拟时间", value: time, unit: "τLJ" },
    ],
  });
  const reset = (p = params) => {
    params = p;
    time = 0;
    const density = parameter(p, "density", 0.6, 0.3, 0.8);
    const temperature = parameter(p, "temperature", 0.5, 0.1, 1.5);
    box = Math.cbrt(count / density);
    const basis = [
      [0, 0, 0],
      [0, 0.5, 0.5],
      [0.5, 0, 0.5],
      [0.5, 0.5, 0],
    ];
    points = [];
    for (let z = 0; z < 3; z++)
      for (let y = 0; y < 3; y++)
        for (let x = 0; x < 3; x++)
          for (const b of basis)
            points.push({
              x: ((x + b[0] + 0.25) * box) / 3 - box / 2,
              y: ((y + b[1] + 0.25) * box) / 3 - box / 2,
              z: ((z + b[2] + 0.25) * box) / 3 - box / 2,
            });
    const random = randomGenerator(13817);
    velocities = Float64Array.from(
      { length: 3 * count },
      () =>
        Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random()),
    );
    for (let axis = 0; axis < 3; axis++) {
      let mean = 0;
      for (let i = 0; i < count; i++) mean += velocities[3 * i + axis] / count;
      for (let i = 0; i < count; i++) velocities[3 * i + axis] -= mean;
    }
    const scale = Math.sqrt((3 * (count - 1) * temperature) / (2 * kinetic()));
    velocities = velocities.map((v) => v * scale);
    calculateForces();
    return frame();
  };
  reset();
  return {
    reset,
    step(steps = 1) {
      for (let step = 0; step < countSteps(steps); step++) {
        for (let i = 0; i < count; i++) {
          for (let axis = 0; axis < 3; axis++) {
            const offset = 3 * i + axis;
            velocities[offset] += 0.5 * dt * forces[offset];
            const key = axes[axis];
            points[i][key] += dt * velocities[offset];
            points[i][key] -=
              box * Math.floor((points[i][key] + box / 2) / box);
          }
        }
        calculateForces();
        for (let i = 0; i < velocities.length; i++)
          velocities[i] += 0.5 * dt * forces[i];
        time += dt;
      }
      return frame();
    },
  };
}

/** Six-neighbor, unit-spacing Laplacian with periodic wrap in x, y AND z. */
export function phaseFieldStep3D(
  values: ArrayLike<number>,
  size: number,
  mobility: number,
  gradient: number,
  dt = 0.015,
): Float64Array {
  const next = new Float64Array(values.length);
  const plane = size * size;
  for (let z = 0; z < size; z++) {
    const zp = ((z + 1) % size) * plane;
    const zm = ((z + size - 1) % size) * plane;
    for (let y = 0; y < size; y++) {
      const yp = ((y + 1) % size) * size;
      const ym = ((y + size - 1) % size) * size;
      for (let x = 0; x < size; x++) {
        const i = x + size * y + plane * z;
        const v = values[i];
        const lap =
          values[((x + 1) % size) + size * y + plane * z] +
          values[((x + size - 1) % size) + size * y + plane * z] +
          values[x + yp + plane * z] +
          values[x + ym + plane * z] +
          values[x + size * y + zp] +
          values[x + size * y + zm] -
          6 * v;
        next[i] = v + dt * mobility * (gradient * lap + v - v * v * v);
      }
    }
  }
  return next;
}

/** Discrete free energy using forward differences; every bond counted once. */
export function phaseFieldEnergy3D(
  values: ArrayLike<number>,
  size: number,
  gradient: number,
): number {
  let energy = 0;
  const plane = size * size;
  for (let z = 0; z < size; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const v = values[x + size * y + plane * z];
        const dx = values[((x + 1) % size) + size * y + plane * z] - v;
        const dy = values[x + size * ((y + 1) % size) + plane * z] - v;
        const dz = values[x + size * y + plane * ((z + 1) % size)] - v;
        energy +=
          (v * v - 1) ** 2 / 4 + (gradient * (dx * dx + dy * dy + dz * dz)) / 2;
      }
  return energy;
}

function createPhaseField3D(initial: Record<string, number>): Simulation {
  const size = 24;
  const count = size ** 3;
  const dt = 0.015;
  let params = initial;
  let mobility = 1;
  let gradient = 1;
  let time = 0;
  let field: Float64Array = new Float64Array(count);
  const frame = (): SimulationFrame => ({
    time,
    box: size,
    volume: {
      width: size,
      height: size,
      depth: size,
      values: Array.from(field),
    },
    metrics: [
      {
        label: "平均自由能",
        value: phaseFieldEnergy3D(field, size, gradient) / count,
      },
      {
        label: "正相体积分数",
        value: field.reduce((sum, v) => sum + Number(v > 0), 0) / count,
      },
      {
        label: "平均序参量（不守恒）",
        value: field.reduce((sum, v) => sum + v, 0) / count,
      },
      { label: "约化时间", value: time },
    ],
  });
  const reset = (p = params) => {
    params = p;
    mobility = parameter(p, "mobility", 1, 0.1, 2);
    gradient = parameter(p, "gradient", 1, 0.2, 2);
    time = 0;
    const random = randomGenerator(13817);
    field = Float64Array.from({ length: count }, (_, i) => {
      const x = ((i % size) * 2 * Math.PI) / size;
      const y = ((Math.floor(i / size) % size) * 2 * Math.PI) / size;
      const z = (Math.floor(i / (size * size)) * 2 * Math.PI) / size;
      // Smooth fully 3D, periodic variation reveals connected curved interfaces.
      // The small deterministic perturbation avoids exact symmetry trapping.
      return (
        0.68 *
        Math.tanh(
          1.15 *
            (Math.sin(x) * Math.cos(y) +
              Math.sin(y) * Math.cos(z) +
              Math.sin(z) * Math.cos(x)) +
            0.15 * Math.sin(2 * x + z) +
            0.06 * (random() - 0.5),
        )
      );
    });
    return frame();
  };
  reset();
  return {
    reset,
    step(steps = 1) {
      for (let i = 0; i < countSteps(steps); i++) {
        field = phaseFieldStep3D(field, size, mobility, gradient, dt);
        time += dt;
      }
      return frame();
    },
  };
}

export function createSpatialSimulation(
  id: SpatialMethodId,
  params: Record<string, number> = {},
): Simulation {
  return id === "md"
    ? createMolecularDynamics3D(params)
    : createPhaseField3D(params);
}
