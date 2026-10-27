import type { Simulation, SimulationFrame, Point3 } from "../types";

type ContinuumId = "crystal-plasticity" | "constitutive" | "fem" | "fdm";
const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));
const safeSteps = (value = 1) =>
  Math.floor(clamp(Number.isFinite(value) ? value : 1, 0, 200));
const defaults: Record<ContinuumId, Record<string, number>> = {
  "crystal-plasticity": { stress: 120, strength: 40 },
  constitutive: { modulus: 100, relaxation: 2 },
  fem: { force: 50, modulus: 100 },
  fdm: { diffusivity: 0.5, source: 1 },
};
const ranges: Record<ContinuumId, Record<string, [number, number]>> = {
  "crystal-plasticity": { stress: [0, 200], strength: [10, 100] },
  constitutive: { modulus: [10, 200], relaxation: [0.3, 5] },
  fem: { force: [0, 100], modulus: [50, 250] },
  fdm: { diffusivity: [0.1, 1], source: [0.5, 2] },
};

/** Linear two-node bar FE assembly. SI inputs; the left node is fixed, force acts at the right. */
export function solveAxialBar(
  force: number,
  modulusPa: number,
  elements = 20,
): number[] {
  const length = 1;
  const area = 1e-4;
  const n = elements + 1;
  const k = (modulusPa * area) / (length / elements);
  // Assemble the full matrix before applying the essential boundary condition.
  const stiffness = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let element = 0; element < elements; element++) {
    stiffness[element][element] += k;
    stiffness[element][element + 1] -= k;
    stiffness[element + 1][element] -= k;
    stiffness[element + 1][element + 1] += k;
  }
  // u(0)=0: eliminate row/column 0; the reduced SPD matrix is tridiagonal.
  const diagonal = Array.from(
    { length: elements },
    (_, i) => stiffness[i + 1][i + 1],
  );
  const right = Array<number>(elements).fill(0);
  right[elements - 1] = force;
  for (let i = 1; i < elements; i++) {
    const multiplier = stiffness[i + 1][i] / diagonal[i - 1];
    diagonal[i] -= multiplier * stiffness[i][i + 1];
    right[i] -= multiplier * right[i - 1];
  }
  const displacement = Array<number>(n).fill(0);
  displacement[elements] = right[elements - 1] / diagonal[elements - 1];
  for (let i = elements - 2; i >= 0; i--) {
    displacement[i + 1] =
      (right[i] - stiffness[i + 1][i + 2] * displacement[i + 2]) / diagonal[i];
  }
  return displacement;
}

/** A diffusion substep with prescribed zero Dirichlet boundaries, alpha*dt/dx² <= 1/4. */
export function heatStep(
  values: number[],
  width: number,
  coefficient: number,
): number[] {
  if (coefficient < 0 || coefficient > 0.25)
    throw new RangeError(
      "2D explicit diffusion requires 0 <= alpha*dt/dx² <= 0.25",
    );
  const next = Array<number>(values.length).fill(0);
  const height = values.length / width;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      next[i] =
        values[i] +
        coefficient *
          (values[i - 1] +
            values[i + 1] +
            values[i - width] +
            values[i + width] -
            4 * values[i]);
    }
  }
  return next;
}

export function createContinuumSimulation(
  id: ContinuumId,
  supplied: Record<string, number>,
): Simulation {
  let params: Record<string, number> = {};
  let time = 0;
  let field: number[] = [];
  const size = 32;
  const dx = 1 / (size - 1);
  // Stable for every diffusivity permitted by the controls; the physical timestep stays fixed.
  const heatDt = 0.18 * dx * dx;
  const angles = Array.from(
    { length: 36 },
    (_, i) => ((((i * 17) % 36) + 0.5) * Math.PI) / 72,
  );
  const schmid = angles.map((theta) =>
    Math.abs(Math.cos(theta) * Math.sin(theta)),
  );

  function frame(): SimulationFrame {
    if (id === "fdm") {
      return {
        time,
        grid: { width: size, height: size, values: field.slice() },
        curves: [
          {
            name: "中线温度 T*（x*）",
            points: Array.from({ length: size }, (_, x) => [
              x * dx,
              field[Math.floor(size / 2) * size + x],
            ]),
          },
        ],
        metrics: [
          { label: "最高温度 T*", value: Math.max(...field) },
          {
            label: "总热量 ∫T* dA*",
            value: field.reduce((a, b) => a + b, 0) * dx * dx,
          },
          { label: "扩散时间 t*", value: time },
          { label: "稳定系数 α*Δt*/Δx*²", value: 0.18 * params.diffusivity },
        ],
      };
    }
    if (id === "constitutive") {
      const strain = 0.02;
      const sigma0 = params.modulus * strain;
      const sigma = sigma0 * Math.exp(-time / params.relaxation);
      const horizon = Math.max(0.04, time);
      return {
        time,
        curves: [
          {
            name: "松弛应力 σ / MPa（t / s）",
            points: Array.from({ length: 121 }, (_, i) => {
              const t = (i * horizon) / 120;
              return [t, sigma0 * Math.exp(-t / params.relaxation)];
            }),
          },
        ],
        metrics: [
          { label: "应力 σ", value: sigma, unit: "MPa" },
          { label: "固定总应变 ε₀", value: strain },
          { label: "松弛时间 τ", value: params.relaxation, unit: "s" },
          {
            label: "粘度 η = Eτ",
            value: params.modulus * params.relaxation,
            unit: "MPa·s",
          },
        ],
      };
    }
    if (id === "fem") {
      const fraction = Math.min(1, time);
      const load = params.force * fraction;
      const displacement = solveAxialBar(load, params.modulus * 1e9);
      const elements = displacement.length - 1;
      const points: Point3[] = [];
      // A narrow bar prism is only a display of the underlying axial 1D solution.
      const edges: [number, number][] = [];
      for (let i = 0; i <= elements; i++) {
        for (let c = 0; c < 4; c++) {
          points.push({
            x: -1 + 2 * (i / elements + displacement[i] * 10000),
            y: c < 2 ? -0.1 : 0.1,
            z: c % 2 ? -0.1 : 0.1,
            value: displacement[i] * 1e5,
            radius: 0.022,
          });
          if (i > 0) edges.push([(i - 1) * 4 + c, i * 4 + c]);
        }
        edges.push(
          [i * 4, i * 4 + 1],
          [i * 4, i * 4 + 2],
          [i * 4 + 1, i * 4 + 3],
          [i * 4 + 2, i * 4 + 3],
        );
      }
      return {
        time,
        points,
        edges,
        curves: [
          {
            name: "轴向位移 u / μm（x / m）",
            points: displacement.map((u, i) => [i / elements, u * 1e6]),
          },
        ],
        metrics: [
          {
            label: "端部位移 u(L)",
            value: displacement[elements] * 1e6,
            unit: "μm",
          },
          { label: "当前拉力 F", value: load, unit: "N" },
          { label: "轴向应力 σ", value: load / 1e-4 / 1e6, unit: "MPa" },
          { label: "变形显示放大倍数", value: 10000 },
        ],
      };
    }
    const applied = params.stress * Math.min(time, 1);
    const resolved = schmid.map((m) => applied * m);
    const activation = resolved.map((tau) => tau / params.strength);
    return {
      time,
      grid: {
        width: 6,
        height: 6,
        values: activation.map((ratio) => Math.min(1, ratio)),
      },
      points: angles.map((theta, i) => ({
        x: ((i % 6) - 2.5) * 0.34,
        y: (Math.floor(i / 6) - 2.5) * 0.34,
        z: 0.12 * Math.sin(theta * 2),
        value: Math.min(1, activation[i]),
        radius: 0.12,
      })),
      curves: [
        {
          name: "Schmid 因子 m（取向角 θ / °）",
          points: Array.from({ length: 91 }, (_, degree) => [
            degree,
            Math.abs(
              Math.cos((degree * Math.PI) / 180) *
                Math.sin((degree * Math.PI) / 180),
            ),
          ]),
        },
      ],
      metrics: [
        { label: "当前轴向应力", value: applied, unit: "MPa" },
        {
          label: "达到滑移阈值的晶粒",
          value: resolved.filter((tau) => tau >= params.strength).length,
          unit: "/ 36",
        },
        { label: "最大分解剪应力", value: Math.max(...resolved), unit: "MPa" },
        { label: "临界分解剪应力 τc", value: params.strength, unit: "MPa" },
      ],
    };
  }

  function reset(next = supplied): SimulationFrame {
    params = {};
    for (const key of Object.keys(defaults[id])) {
      const value = next[key];
      const [low, high] = ranges[id][key];
      params[key] = clamp(
        Number.isFinite(value) ? value : defaults[id][key],
        low,
        high,
      );
    }
    supplied = { ...params };
    time = 0;
    if (id === "fdm") {
      field = Array.from({ length: size * size }, (_, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        if (x === 0 || y === 0 || x === size - 1 || y === size - 1) return 0;
        return (
          params.source *
          Math.exp(-40 * ((x * dx - 0.5) ** 2 + (y * dx - 0.5) ** 2))
        );
      });
    }
    return frame();
  }
  reset(supplied);
  return {
    reset,
    step(count = 1) {
      const n = safeSteps(count);
      for (let step = 0; step < n; step++) {
        if (id === "fdm") {
          field = heatStep(field, size, params.diffusivity * 0.18);
          time += heatDt;
        } else if (id === "constitutive") {
          time = Math.min(100, time + 0.04);
        } else {
          // Quasistatic loading progress, not a prediction of physical transient dynamics.
          time = Math.min(1, time + 0.02);
        }
      }
      return frame();
    },
  };
}
