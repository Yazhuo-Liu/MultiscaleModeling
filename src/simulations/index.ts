import type { MethodId, Simulation, SimulationDefinition } from "../types";
import {
  createDensitySimulation,
  createHartreeFockSimulation,
} from "./quantum";
import { createMolecularDynamics, createMonteCarlo } from "./atomistic";
import {
  createDislocationSimulation,
  createKineticMonteCarlo,
  createPhaseField,
} from "./mesoscopic";
import { createContinuumSimulation } from "./continuum";
export const simulationDefinitions: Record<MethodId, SimulationDefinition> = {
  dft: {
    view: "curves",
    description:
      "单电子氢样原子的高斯试探密度变分模型。横轴 r（Bohr），纵轴径向概率（Bohr⁻¹）。播放为能量优化迭代，不是真实时间；未求解 Kohn–Sham 方程。",
    controls: [
      { key: "charge", label: "核电荷 Z", min: 1, max: 3, step: 1, initial: 1 },
      {
        key: "exponent",
        label: "初始高斯指数 α",
        min: 0.1,
        max: 3,
        step: 0.1,
        initial: 1.2,
        unit: "a₀⁻²",
      },
    ],
  },
  hf: {
    view: "curves",
    description:
      "两位点 Hubbard 模型的限制性 Hartree–Fock 自洽场：2 个相反自旋电子共占一个空间轨道。横轴迭代次数，纵轴 A 位点电子数。能量单位为跃迁积分 t，未使用真实分子积分。",
    controls: [
      {
        key: "interaction",
        label: "在位排斥 U / t",
        min: 0,
        max: 4,
        step: 0.1,
        initial: 2,
      },
      {
        key: "bias",
        label: "位点能量差 Δ / t",
        min: 0,
        max: 3,
        step: 0.1,
        initial: 1,
      },
    ],
  },
  md: {
    view: "particles",
    description:
      "36 个二维 Lennard–Jones 粒子，周期边界；速度 Verlet，Δt=0.002 τLJ，势能在 2.5σ 截断并平移。参数设置初始温度，不使用恒温器；坐标单位 σ。3D 视图仍是二维运动。",
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
        label: "二维数密度",
        min: 0.3,
        max: 0.8,
        step: 0.05,
        initial: 0.6,
        unit: "σ⁻²",
      },
    ],
  },
  mc: {
    view: "field",
    description:
      "32×32 二维 Ising 模型，最近邻耦合 J=1、周期边界。每一步为 1024 次 Metropolis 翻转尝试（一个 sweep），不代表物理时间。颜色表示自旋 −1/+1。",
    controls: [
      {
        key: "temperature",
        label: "约化温度 kBT / J",
        min: 0.5,
        max: 4,
        step: 0.1,
        initial: 2.2,
      },
      {
        key: "field",
        label: "外场 h / J",
        min: -1,
        max: 1,
        step: 0.1,
        initial: 0,
      },
    ],
  },
  dd: {
    view: "mesh",
    description:
      "两端固定的位错线张力小斜率模型，∂y/∂t=τ+Γ∂²y/∂x²；横向长度 L=1。20 个稳定子步 / 帧，约化单位；忽略位错相互作用、拓扑变化与交滑移。",
    controls: [
      {
        key: "stress",
        label: "约化剪应力 τ",
        min: 0,
        max: 1,
        step: 0.05,
        initial: 0.6,
      },
      {
        key: "tension",
        label: "约化线张力 Γ",
        min: 0.2,
        max: 2,
        step: 0.1,
        initial: 1,
      },
    ],
  },
  kmc: {
    view: "particles",
    description:
      "15×15 周期方格的单空位，四个等价跃迁事件；晶格间距 0.25 nm，尝试频率 10¹² s⁻¹。橙色点表示空位，播放每步发生一次事件，时间服从指数分布。位移平方按未折回轨迹计算。",
    controls: [
      {
        key: "temperature",
        label: "温度",
        min: 300,
        max: 1200,
        step: 50,
        initial: 650,
        unit: "K",
      },
      {
        key: "barrier",
        label: "迁移势垒",
        min: 0.2,
        max: 0.8,
        step: 0.05,
        initial: 0.5,
        unit: "eV",
      },
    ],
  },
  "phase-field": {
    view: "field",
    description:
      "40×40 非守恒 Allen–Cahn 序参量，周期边界、双阱自由能，显式 Δt=0.025、Δx=1。两种颜色代表两相；全部约化单位，不适用于守恒浓度扩散。",
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
  "crystal-plasticity": {
    view: "mesh",
    description:
      "36 个理想取向晶粒的单滑移 Schmid 教学模型；每个晶粒 m=|cosθ sinθ|，τ=mσ。颜色显示 τ/τc（截断到1），达到临界值判为激活；不求解晶粒协调、硬化或完整多晶塑性。播放为加载进度。",
    controls: [
      {
        key: "stress",
        label: "目标轴向应力",
        min: 0,
        max: 200,
        step: 5,
        initial: 120,
        unit: "MPa",
      },
      {
        key: "strength",
        label: "临界分切应力 τc",
        min: 10,
        max: 100,
        step: 5,
        initial: 40,
        unit: "MPa",
      },
    ],
  },
  constitutive: {
    view: "curves",
    description:
      "Maxwell 黏弹性模型：施加并保持 ε₀=0.02，σ(t)=Eε₀ exp(−t/τ)。横轴秒、纵轴 MPa；时间步 0.04 s，用解析解更新。这是本构示例，不是完整速率与状态摩擦模型。",
    controls: [
      {
        key: "modulus",
        label: "弹性模量 E",
        min: 10,
        max: 200,
        step: 10,
        initial: 100,
        unit: "MPa",
      },
      {
        key: "relaxation",
        label: "松弛时间 τ",
        min: 0.3,
        max: 5,
        step: 0.1,
        initial: 2,
        unit: "s",
      },
    ],
  },
  fem: {
    view: "mesh",
    description:
      "20 个一维线性杆单元；组装刚度矩阵并求解，左端固定、右端点力。L=1 m，A=10⁻⁴ m²；横轴 x/L、曲线位移 μm，形变放大 10000 倍。播放为静力加载进度，不是动力学。",
    controls: [
      {
        key: "force",
        label: "端部拉力 F",
        min: 0,
        max: 100,
        step: 5,
        initial: 50,
        unit: "N",
      },
      {
        key: "modulus",
        label: "弹性模量 E",
        min: 50,
        max: 250,
        step: 10,
        initial: 100,
        unit: "GPa",
      },
    ],
  },
  fdm: {
    view: "field",
    description:
      "32×32 二维热方程显式有限差分，正方形边长1、边界温度为0；初始高斯热斑、无持续热源。Δt=0.18 Δx²，所有参数满足稳定条件。场值与时间均为约化单位。",
    controls: [
      {
        key: "diffusivity",
        label: "热扩散系数 α",
        min: 0.1,
        max: 1,
        step: 0.1,
        initial: 0.5,
      },
      {
        key: "source",
        label: "初始热斑峰值",
        min: 0.5,
        max: 2,
        step: 0.1,
        initial: 1,
      },
    ],
  },
};
export function createSimulation(
  id: MethodId,
  params: Record<string, number> = {},
): Simulation {
  switch (id) {
    case "dft":
      return createDensitySimulation(params);
    case "hf":
      return createHartreeFockSimulation(params);
    case "md":
      return createMolecularDynamics(params);
    case "mc":
      return createMonteCarlo(params);
    case "dd":
      return createDislocationSimulation(params);
    case "kmc":
      return createKineticMonteCarlo(params);
    case "phase-field":
      return createPhaseField(params);
    default:
      return createContinuumSimulation(id, params);
  }
}
