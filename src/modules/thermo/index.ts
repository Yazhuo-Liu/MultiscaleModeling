import type { ModelingModule } from "@/core/types";
import { mountSimpleScene } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Materials thermodynamics — phase equilibria & free energy toys. */
export const thermoModule: ModelingModule = {
  id: "thermo",
  title: "材料热力学",
  summary: "相平衡、自由能与相图：连接原子计算与工艺设计的热力学语言。",
  scale: "cross-scale",
  accent: "#6b4f3a",
  tags: ["自由能", "相图", "CALPHAD"],
  intro: {
    lead: "材料热力学用自由能极小化描述相平衡，是跨尺度建模中承上启下的骨架。",
    sections: [
      {
        heading: "从第一性原理到相图",
        body: "DFT 总能、声子与团簇展开可参数化自由能；CALPHAD 则用评估数据库在成分–温度空间插值与外推，服务合金设计。",
      },
      {
        heading: "本站 demo",
        body: "提供规则溶液模型的二元混溶隙示意，帮助理解相互作用参数与临界温度关系。",
      },
    ],
    references: [
      { label: "DeHoff, Thermodynamics in Materials Science" },
      { label: "Saunders & Miodownik, CALPHAD" },
    ],
  },
  render: {
    label: "自由能曲面示意",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xf3eee8,
        cameraZ: 5,
        setup: (scene, camera) => {
          camera.position.set(2.5, 2.2, 4);
          camera.lookAt(0, 0, 0);
          const geo = new THREE.PlaneGeometry(3.2, 3.2, 40, 40);
          const pos = geo.attributes.position!;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z =
              0.35 * Math.sin(x * 2) * Math.cos(y * 2) +
              0.15 * (x * x + y * y);
            pos.setZ(i, z);
          }
          geo.computeVertexNormals();
          const mesh = new THREE.Mesh(
            geo,
            new THREE.MeshStandardMaterial({
              color: 0x6b4f3a,
              wireframe: false,
              flatShading: true,
              side: THREE.DoubleSide,
            }),
          );
          mesh.rotation.x = -Math.PI / 2.6;
          scene.add(mesh);
        },
        onFrame: (scene, t) => {
          scene.rotation.y = t * 0.2;
        },
      }),
  },
  compute: {
    label: "规则溶液混溶隙",
    description:
      "二元规则溶液 G_mix = Ω x(1-x) + RT[x ln x + (1-x) ln(1-x)]，扫描温度看混溶隙。",
    params: [
      { id: "omega", label: "Ω (J/mol)", type: "number", default: 16000, min: 5000, max: 40000, step: 500 },
      { id: "T", label: "温度 T (K)", type: "number", default: 800, min: 300, max: 2000, step: 50 },
    ],
    run: async (values, ctx) => {
      const omega = Number(values.omega);
      const T = Number(values.T);
      const R = 8.314;
      const series: { x: number; y: number }[] = [];
      const n = 99;

      await forEachChunked(n, 20, (i) => {
        const x = (i + 1) / (n + 1);
        const g =
          omega * x * (1 - x) +
          R * T * (x * Math.log(x) + (1 - x) * Math.log(1 - x));
        series.push({ x, y: g });
      }, ctx);

      const Tc = omega / (2 * R);
      return {
        summary: `当前 T=${T} K；规则溶液临界温度 Tc ≈ ${Tc.toFixed(1)} K（T < Tc 时出现混溶隙）。`,
        series,
      };
    },
  },
};
