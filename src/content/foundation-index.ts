import type { FoundationId } from "./foundations-types";
import type { MethodId } from "../types";
import type { Locale } from "../i18n";

export const foundationIndex: {
  id: FoundationId;
  group: "scales" | "atoms" | "materials";
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
}[] = [
  {
    id: "why-multiscale",
    group: "scales",
    title: { zh: "为什么需要多尺度建模？", en: "Why model across scales?" },
    summary: {
      zh: "从一根金属杆出发，连接电子、原子、缺陷与工程响应。",
      en: "Connect electrons, atoms, defects and engineering response through a metal bar.",
    },
  },
  {
    id: "scales-and-limits",
    group: "scales",
    title: { zh: "每个尺度能看见什么？", en: "What can each scale resolve?" },
    summary: {
      zh: "认识 11 种方法的假设、局限，以及收敛与验证的区别。",
      en: "Understand the assumptions and limits of eleven methods, and why convergence is not validation.",
    },
  },
  {
    id: "error-propagation",
    group: "scales",
    title: { zh: "误差怎样跨越尺度？", en: "How do errors cross scales?" },
    summary: {
      zh: "追踪不确定度、相关性与模型偏差，理解预测有多可信。",
      en: "Follow uncertainty, correlation and model bias to judge how much to trust a prediction.",
    },
  },
  {
    id: "electronic-structure",
    group: "atoms",
    title: { zh: "什么是电子结构？", en: "What is electronic structure?" },
    summary: {
      zh: "从波函数与电子密度开始，理解能量和原子间的力。",
      en: "Start with wavefunctions and electron density, then connect them to energy and forces.",
    },
  },
  {
    id: "atomic-orbitals",
    group: "atoms",
    title: {
      zh: "从氢到铁：看见原子轨道",
      en: "Atomic orbitals: from H to Fe",
    },
    summary: {
      zh: "逐层展开电子层、亚层与轨道，探索形状、相位和概率。",
      en: "Explore shells, subshells and orbitals, revealing shape, phase and probability.",
    },
  },
  {
    id: "bonding",
    group: "materials",
    title: { zh: "原子为什么会成键？", en: "Why do atoms bond?" },
    summary: {
      zh: "从两个原子的波函数叠加，走向共价键与金属键。",
      en: "Combine two atomic wavefunctions, then build intuition for covalent and metallic bonding.",
    },
  },
  {
    id: "band-structure",
    group: "materials",
    title: { zh: "能带与带隙", en: "Energy bands and band gaps" },
    summary: {
      zh: "把原子态连成能带，观察占据与周期性如何改变电子行为。",
      en: "Build bands from atomic states and explore how filling and periodicity shape electronic behavior.",
    },
  },
  {
    id: "formation-energy",
    group: "materials",
    title: { zh: "形成能与材料稳定性", en: "Formation energy and stability" },
    summary: {
      zh: "选对参考态，比较竞争相，理解负形成能为什么还不够。",
      en: "Choose reference states and competing phases to see why negative formation energy is not enough.",
    },
  },
];

export const foundationPrerequisites: Record<MethodId, FoundationId[]> = {
  dft: ["electronic-structure", "atomic-orbitals", "formation-energy"],
  hf: ["electronic-structure", "atomic-orbitals", "bonding"],
  md: ["why-multiscale", "bonding", "error-propagation"],
  mc: ["scales-and-limits", "error-propagation"],
  dd: ["why-multiscale", "scales-and-limits"],
  kmc: ["formation-energy", "error-propagation"],
  "phase-field": ["why-multiscale", "formation-energy"],
  "crystal-plasticity": ["why-multiscale", "scales-and-limits"],
  constitutive: ["why-multiscale", "error-propagation"],
  fem: ["scales-and-limits", "error-propagation"],
  fdm: ["scales-and-limits", "error-propagation"],
};
