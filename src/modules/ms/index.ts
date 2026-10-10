import type { ModelingModule } from "@/core/types";
import { mountSimpleScene } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Molecular Simulation / Molecular Statics — structure optimization at atomic scale. */
export const msModule: ModelingModule = {
  id: "ms",
  title: "MS",
  summary: "分子模拟 / 分子静力学：势函数驱动的构型搜索与能量最小化。",
  scale: "atomic",
  accent: "#2a6f4e",
  tags: ["势函数", "能量最小化", "构型"],
  intro: {
    lead: "分子静力学在给定势函数下寻找局部能量极小构型，是原子尺度建模的基础操作。",
    sections: [
      {
        heading: "与 MD 的关系",
        body: "MS 忽略热涨落，关注 0 K 附近的稳定结构；MD 则积分牛顿方程追踪有限温度动力学。二者常共用同一套原子间势或力场。",
      },
      {
        heading: "优化算法",
        body: "最速下降、共轭梯度、L-BFGS 等用于弛豫。约束优化、NEB 初猜与缺陷超胞构建常与 MS 串联。",
      },
    ],
    references: [
      { label: "Frenkel & Smit, Understanding Molecular Simulation" },
    ],
  },
  render: {
    label: "晶格弛豫示意",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xeaf3ef,
        cameraZ: 5,
        setup: (scene) => {
          const group = new THREE.Group();
          const mat = new THREE.MeshStandardMaterial({ color: 0x2a6f4e });
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              for (let k = 0; k < 3; k++) {
                const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), mat);
                ball.position.set((i - 1) * 0.9, (j - 1) * 0.9, (k - 1) * 0.9);
                group.add(ball);
              }
            }
          }
          scene.add(group);
          return () => mat.dispose();
        },
        onFrame: (scene, t) => {
          const stretch = 1 + 0.04 * Math.sin(t * 2);
          scene.children.forEach((c) => {
            if (c instanceof THREE.Group) {
              c.scale.set(stretch, 1 / Math.sqrt(stretch), 1 / Math.sqrt(stretch));
              c.rotation.y = t * 0.25;
            }
          });
        },
      }),
  },
  compute: {
    label: "1D Lennard-Jones 最小化",
    description: "对双原子 LJ 势做简单梯度下降，观察平衡间距收敛。",
    params: [
      { id: "eps", label: "ε (能量单位)", type: "number", default: 1, min: 0.1, max: 5, step: 0.1 },
      { id: "sigma", label: "σ", type: "number", default: 1, min: 0.5, max: 2, step: 0.05 },
      { id: "r0", label: "初猜间距", type: "number", default: 1.5, min: 0.8, max: 3, step: 0.05 },
      { id: "steps", label: "迭代步数", type: "number", default: 40, min: 10, max: 200, step: 5 },
    ],
    run: async (values, ctx) => {
      const eps = Number(values.eps);
      const sigma = Number(values.sigma);
      const steps = Math.floor(Number(values.steps));
      let r = Number(values.r0);
      const lr = 0.05;
      const series: { x: number; y: number }[] = [];

      const energy = (x: number) => {
        const sr = sigma / x;
        const sr6 = sr ** 6;
        return 4 * eps * (sr6 * sr6 - sr6);
      };

      await forEachChunked(steps, 5, (i) => {
        const sr = sigma / r;
        const sr6 = sr ** 6;
        const force = (24 * eps / r) * (2 * sr6 * sr6 - sr6);
        r += lr * force;
        r = Math.max(0.6 * sigma, r);
        series.push({ x: i, y: energy(r) });
      }, ctx);

      const rEq = sigma * 2 ** (1 / 6);
      return {
        summary: `收敛间距 ≈ ${r.toFixed(4)}（解析最小值 ${rEq.toFixed(4)}），E ≈ ${energy(r).toFixed(4)}`,
        series,
      };
    },
  },
};
