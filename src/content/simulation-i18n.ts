import type { Locale } from "../i18n";
import type { MethodId } from "../types";

const text: Record<string, string> = {
  "径向距离 r / a₀": "Radial distance r / a₀",
  "径向概率 / a₀⁻¹": "Radial probability / a₀⁻¹",
  "SCF 迭代次数": "SCF iteration",
  "A 位点电子数 nA": "Site A occupation nA",
  "时间 t / s": "Time t / s",
  "应力 σ / MPa": "Stress σ / MPa",
  "杆长坐标 x / m": "Position x / m",
  "位移 u / μm": "Displacement u / μm",
  "杆形变示意 · 位移放大 10⁴ 倍": "Bar displacement magnified ×10⁴",
  "x–y 投影": "x–y projection",
  "核电荷 Z": "Nuclear charge Z",
  "初始高斯指数 α": "Initial Gaussian exponent α",
  "在位排斥 U / t": "On-site repulsion U / t",
  "位点能量差 Δ / t": "Site energy difference Δ / t",
  初始约化温度: "Initial reduced temperature",
  二维数密度: "2D number density",
  三维数密度: "3D number density",
  "约化温度 kBT / J": "Reduced temperature kBT / J",
  "外场 h / J": "External field h / J",
  "约化剪应力 τ": "Reduced shear stress τ",
  "约化线张力 Γ": "Reduced line tension Γ",
  温度: "Temperature",
  迁移势垒: "Migration barrier",
  "迁移率 M": "Mobility M",
  "梯度能系数 κ": "Gradient-energy coefficient κ",
  目标轴向应力: "Target axial stress",
  "临界分切应力 τc": "Critical resolved shear stress τc",
  "弹性模量 E": "Young’s modulus E",
  "松弛时间 τ": "Relaxation time τ",
  "端部拉力 F": "End load F",
  "热扩散系数 α": "Thermal diffusivity α",
  初始热斑峰值: "Initial peak temperature",
  "径向概率 4πr²n(r)（a₀⁻¹）": "Radial probability 4πr²n(r) (a₀⁻¹)",
  变分能量: "Variational energy",
  "高斯指数 α": "Gaussian exponent α",
  迭代次数: "Iterations",
  "精确氢样能量（比较）": "Exact hydrogenic energy",
  "A 位点电子占据数": "Site A electron occupation",
  "A 位点占据": "Site A occupation",
  "B 位点占据": "Site B occupation",
  平均场能量: "Mean-field energy",
  自洽残差: "SCF residual",
  约化温度: "Reduced temperature",
  "总能量 / 粒子": "Total energy / particle",
  粒子数: "Particles",
  模拟时间: "Simulation time",
  平均磁化强度: "Mean magnetization",
  "能量 / 自旋": "Energy / spin",
  蒙特卡洛扫描: "Monte Carlo sweeps",
  接受比例: "Acceptance fraction",
  "位错线挠度 y / L": "Dislocation deflection y / L",
  最大弓出量: "Maximum bow-out",
  "静态极限（小斜率）": "Equilibrium limit (small slope)",
  约化时间: "Reduced time",
  固定端点数: "Pinned endpoints",
  经过时间: "Elapsed time",
  单方向跃迁速率: "Rate per hopping direction",
  空位跳跃数: "Vacancy hops",
  单轨迹位移平方: "Squared displacement (one trajectory)",
  平均自由能: "Mean free energy",
  正相面积比例: "Positive-phase area fraction",
  正相体积分数: "Positive-phase volume fraction",
  "平均序参量（不守恒）": "Mean order parameter (nonconserved)",
  "中线温度 T*（x*）": "Centerline temperature T* (x*)",
  "最高温度 T*": "Maximum temperature T*",
  "总热量 ∫T* dA*": "Total heat ∫T* dA*",
  "扩散时间 t*": "Diffusion time t*",
  "稳定系数 α*Δt*/Δx*²": "Stability number α*Δt*/Δx*²",
  "松弛应力 σ / MPa（t / s）": "Relaxation stress σ / MPa (t / s)",
  "应力 σ": "Stress σ",
  "固定总应变 ε₀": "Held total strain ε₀",
  "粘度 η = Eτ": "Viscosity η = Eτ",
  "轴向位移 u / μm（x / m）": "Axial displacement u / μm (x / m)",
  "端部位移 u(L)": "End displacement u(L)",
  "当前拉力 F": "Applied load F",
  "轴向应力 σ": "Axial stress σ",
  变形显示放大倍数: "Displacement magnification",
  "Schmid 因子 m（取向角 θ / °）": "Schmid factor m (orientation θ / °)",
  当前轴向应力: "Applied axial stress",
  达到滑移阈值的晶粒: "Grains at the slip threshold",
  最大分解剪应力: "Maximum resolved shear stress",
  "临界分解剪应力 τc": "Critical resolved shear stress τc",
  "本次参数计算未能完成，请重置实验。":
    "The calculation could not continue. Please reset the experiment.",
  "计算未能完成，请重置实验。":
    "The calculation could not continue. Please reset the experiment.",
};

const descriptions: Record<MethodId, string> = {
  dft: "Variational model of a single-electron hydrogenic atom with a Gaussian trial density. The horizontal axis is r in Bohr; the vertical axis is radial probability in Bohr⁻¹. Steps minimize energy rather than advance physical time. This example does not solve the Kohn–Sham equations.",
  hf: "Restricted Hartree–Fock self-consistency for a two-site Hubbard model: two opposite-spin electrons share one spatial orbital. The axes show iteration and site A occupation. Energies are in units of the hopping integral t; these are model parameters, not molecular integrals.",
  md: "36 two-dimensional Lennard–Jones particles with periodic boundaries, velocity Verlet, Δt = 0.002 τLJ, and a potential truncated and shifted at 2.5σ. The temperature control sets the initial kinetic temperature; there is no thermostat. Position is measured in σ. Rotating the plot does not change the two-dimensional dynamics.",
  mc: "A 32 × 32 two-dimensional Ising lattice with nearest-neighbor coupling J = 1 and periodic boundaries. One step contains 1,024 attempted Metropolis flips (one sweep), not a physical time interval. Color represents spin −1 or +1.",
  dd: "A pinned dislocation line in the small-slope line-tension approximation: ∂y/∂t = τ + Γ∂²y/∂x², with span L = 1. Reduced units and stable substeps are used. Dislocation interactions, topology changes, and cross-slip are omitted.",
  kmc: "One vacancy on a periodic 15 × 15 square lattice with four equivalent hopping events. Lattice spacing is 0.25 nm and attempt frequency is 10¹² s⁻¹. The orange point marks the vacancy. Each step selects an event and an exponentially distributed waiting time. Squared displacement uses the unwrapped trajectory.",
  "phase-field":
    "A 40 × 40 nonconserved Allen–Cahn order parameter with periodic boundaries and a double-well free energy. Explicit stepping uses Δt = 0.025 and Δx = 1. The two colors represent the two phases. All quantities are reduced; this model does not describe diffusion of a conserved concentration.",
  "crystal-plasticity":
    "A single-slip Schmid model for 36 idealized grain orientations: m = |cosθ sinθ| and τ = mσ. Color represents τ/τc, capped at 1; a grain activates when the threshold is reached. Compatibility, hardening, and full polycrystal plasticity are omitted. Steps advance the loading ramp, not physical time.",
  constitutive:
    "A Maxwell viscoelastic element held at total strain ε₀ = 0.02: σ(t) = Eε₀ exp(−t/τ). Time is in seconds and stress in MPa; the analytic solution advances in 0.04 s increments. This constitutive example does not solve a rate-and-state friction law.",
  fem: "Twenty linear one-dimensional bar elements, assembled into a global stiffness matrix. The left end is fixed and the right end carries a point load. L = 1 m and A = 10⁻⁴ m². The displacement curve is in μm; the deformed shape is magnified 10,000 times. Steps advance a static loading ramp, not dynamics.",
  fdm: "An explicit finite-difference solution of the 2D heat equation on a 32 × 32 grid. The square has unit side length and zero boundary temperature. Initially there is a Gaussian hot spot, with no sustained heat source. Δt = 0.18 Δx²; every allowed diffusivity satisfies the stability condition. Temperature and time are reduced quantities.",
};

export function translateSimulationText(locale: Locale, value: string): string {
  return locale === "zh" ? value : (text[value] ?? value);
}
export function simulationDescription(
  locale: Locale,
  id: MethodId,
  original: string,
): string {
  return locale === "zh" ? original : descriptions[id];
}

const spatialDescriptions = {
  md: "108 three-dimensional Lennard–Jones particles start from 3 × 3 × 3 FCC cells. All three directions contribute to forces, velocities, positions and periodic boundaries. Velocity Verlet uses Δt = 0.002 τLJ; the potential is truncated and shifted at 2.5σ. Initial temperature uses 3(N−1) degrees of freedom. There is no thermostat, and an FCC initial arrangement need not remain solid. Number density is in σ⁻³; the box length follows from particle count and density.",
  "phase-field":
    "A 24 × 24 × 24 three-dimensional Allen–Cahn volume, with six spatial neighbors, periodic boundaries in all three directions and a double-well free energy. Explicit steps use Δt = 0.015 and Δx = 1. The φ = 0 isosurface marks the phase interface; the movable section displays the actual data at that depth. The order parameter is nonconserved. All quantities are reduced; this model does not describe diffusion of a conserved concentration.",
};

export function spatialSimulationDescription(
  locale: Locale,
  id: "md" | "phase-field",
  original: string,
): string {
  return locale === "zh" ? original : spatialDescriptions[id];
}
