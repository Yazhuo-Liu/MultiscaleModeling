import type { Simulation, SimulationFrame } from "../types";
import { countSteps, parameter, randomGenerator } from "./utils";
export function createDislocationSimulation(
  initial: Record<string, number>,
): Simulation {
  const n = 65,
    dx = 1 / (n - 1);
  let params = initial,
    stress = 0.6,
    tension = 1,
    y: number[] = [],
    time = 0;
  const frame = (): SimulationFrame => ({
    time,
    points: y.map((v, i) => ({
      x: i * dx - 0.5,
      y: v,
      z: 0,
      value: v,
      radius: i === 0 || i === n - 1 ? 0.06 : 0.015,
    })),
    edges: Array.from({ length: n - 1 }, (_, i) => [i, i + 1]),
    curves: [
      { name: "位错线挠度 y / L", points: y.map((v, i) => [i * dx, v]) },
    ],
    metrics: [
      { label: "最大弓出量", value: Math.max(...y), unit: "L" },
      { label: "静态极限（小斜率）", value: stress / (8 * tension), unit: "L" },
      { label: "约化时间", value: time },
      { label: "固定端点数", value: 2 },
    ],
  });
  const reset = (p = params) => {
    params = p;
    stress = parameter(p, "stress", 0.6, 0, 1);
    tension = parameter(p, "tension", 1, 0.2, 2);
    y = Array(n).fill(0);
    time = 0;
    return frame();
  };
  reset();
  return {
    reset,
    step(steps = 1) {
      const dt = (0.2 * dx * dx) / tension;
      for (let k = 0; k < countSteps(steps) * 20; k++) {
        const next = [...y];
        for (let i = 1; i < n - 1; i++)
          next[i] =
            y[i] +
            dt *
              (stress +
                (tension * (y[i - 1] - 2 * y[i] + y[i + 1])) / (dx * dx));
        y = next;
        time += dt;
      }
      return frame();
    },
  };
}
export function createKineticMonteCarlo(
  initial: Record<string, number>,
): Simulation {
  const side = 15,
    lattice = 0.25,
    kB = 8.617333262e-5,
    attempt = 1e12;
  let params = initial,
    temperature = 650,
    barrier = 0.5,
    time = 0,
    x = 0,
    y = 0,
    hops = 0,
    rng = randomGenerator();
  const eventRate = () => attempt * Math.exp(-barrier / (kB * temperature));
  const wrap = (v: number) => ((((v + 7) % side) + side) % side) - 7;
  const frame = (): SimulationFrame => ({
    time,
    points: Array.from({ length: side * side }, (_, i) => {
      const px = (i % side) - 7,
        py = Math.floor(i / side) - 7;
      const vacant = px === wrap(x) && py === wrap(y);
      return {
        x: px * lattice,
        y: py * lattice,
        z: 0,
        value: vacant ? 1 : 0,
        radius: vacant ? 0.12 : 0.045,
      };
    }),
    metrics: [
      { label: "经过时间", value: time, unit: "s" },
      { label: "单方向跃迁速率", value: eventRate(), unit: "s⁻¹" },
      { label: "空位跳跃数", value: hops },
      {
        label: "单轨迹位移平方",
        value: (x * x + y * y) * lattice * lattice,
        unit: "nm²",
      },
    ],
  });
  const reset = (p = params) => {
    params = p;
    temperature = parameter(p, "temperature", 650, 300, 1200);
    barrier = parameter(p, "barrier", 0.5, 0.2, 0.8);
    time = 0;
    x = 0;
    y = 0;
    hops = 0;
    rng = randomGenerator();
    return frame();
  };
  reset();
  return {
    reset,
    step(steps = 1) {
      for (let k = 0; k < countSteps(steps); k++) {
        time += -Math.log(rng()) / (4 * eventRate());
        const dir = Math.floor(rng() * 4);
        if (dir === 0) x++;
        else if (dir === 1) x--;
        else if (dir === 2) y++;
        else y--;
        hops++;
      }
      return frame();
    },
  };
}
export function createPhaseField(initial: Record<string, number>): Simulation {
  const size = 40,
    N = size * size,
    dt = 0.025;
  let params = initial,
    mobility = 1,
    gradient = 1,
    time = 0,
    field: number[] = [];
  const at = (i: number, j: number) =>
    field[((j + size) % size) * size + ((i + size) % size)];
  const frame = (): SimulationFrame => {
    let energy = 0;
    for (let j = 0; j < size; j++)
      for (let i = 0; i < size; i++) {
        const v = at(i, j);
        energy +=
          (v * v - 1) ** 2 / 4 +
          (gradient * ((at(i + 1, j) - v) ** 2 + (at(i, j + 1) - v) ** 2)) / 2;
      }
    return {
      time,
      grid: { width: size, height: size, values: [...field] },
      metrics: [
        { label: "平均自由能", value: energy / N },
        { label: "正相面积比例", value: field.filter((v) => v > 0).length / N },
        {
          label: "平均序参量（不守恒）",
          value: field.reduce((a, b) => a + b, 0) / N,
        },
        { label: "约化时间", value: time },
      ],
    };
  };
  const reset = (p = params) => {
    params = p;
    mobility = parameter(p, "mobility", 1, 0.1, 2);
    gradient = parameter(p, "gradient", 1, 0.2, 2);
    time = 0;
    const rng = randomGenerator();
    field = Array.from({ length: N }, () => 1.4 * (rng() - 0.5));
    return frame();
  };
  reset();
  return {
    reset,
    step(steps = 1) {
      for (let k = 0; k < countSteps(steps); k++) {
        const next = [...field];
        for (let j = 0; j < size; j++)
          for (let i = 0; i < size; i++) {
            const v = at(i, j),
              lap =
                at(i - 1, j) +
                at(i + 1, j) +
                at(i, j - 1) +
                at(i, j + 1) -
                4 * v;
            next[j * size + i] =
              v + dt * mobility * (gradient * lap + v - v * v * v);
          }
        field = next;
        time += dt;
      }
      return frame();
    },
  };
}
