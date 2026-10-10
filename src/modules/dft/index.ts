import type { ModelingModule } from "@/core/types";
import { mountSimpleScene } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Density Functional Theory — electronic-structure intro + demos. */
export const dftModule: ModelingModule = {
  id: "dft",
  title: "DFT",
  summary: "密度泛函理论：从电子密度出发近似求解多体薛定谔方程。",
  scale: "electronic",
  accent: "#1f6f78",
  tags: ["第一性原理", "电子结构", "交换关联"],
  intro: {
    lead: "DFT 用电子密度替代多电子波函数，使材料电子结构计算在实践上可行。",
    sections: [
      {
        heading: "核心思想",
        body: "Hohenberg–Kohn 定理表明基态性质由电子密度唯一确定。Kohn–Sham 方法引入无相互作用参考体系，把多体问题映射为一组有效单粒子方程，复杂度主要落在交换关联泛函。",
      },
      {
        heading: "常见近似",
        body: "LDA / GGA / meta-GGA / 杂化泛函递进描述交换关联。平面波赝势与局域基组是两类主流实现。本站 demo 只做概念级数值玩具，不能替代 VASP、Quantum ESPRESSO 等生产代码。",
      },
      {
        heading: "适用场景",
        body: "平衡结构、能带、态密度、缺陷形成能、反应路径初筛等。强关联、激发态与超大体系需其它方法或嵌入式多尺度策略。",
      },
    ],
    references: [
      { label: "Kohn & Sham, Phys. Rev. 140, A1133 (1965)" },
      { label: "Martin, Electronic Structure (Cambridge)" },
    ],
  },
  render: {
    label: "电子云示意",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xe8f1f0,
        setup: (scene) => {
          const geo = new THREE.IcosahedronGeometry(1.1, 2);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x1f6f78,
            flatShading: true,
            transparent: true,
            opacity: 0.92,
          });
          const core = new THREE.Mesh(geo, mat);
          scene.add(core);

          const shell = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.55, 1),
            new THREE.MeshStandardMaterial({
              color: 0x7eb8c9,
              wireframe: true,
              transparent: true,
              opacity: 0.55,
            }),
          );
          scene.add(shell);

          const dots = new THREE.Points(
            new THREE.BufferGeometry().setFromPoints(
              Array.from({ length: 80 }, () => {
                const v = new THREE.Vector3().randomDirection().multiplyScalar(1.2 + Math.random());
                return v;
              }),
            ),
            new THREE.PointsMaterial({ color: 0x2a6f4e, size: 0.05 }),
          );
          scene.add(dots);

          return () => {
            geo.dispose();
            mat.dispose();
          };
        },
        onFrame: (scene, t) => {
          scene.rotation.y = t * 0.35;
          scene.rotation.x = Math.sin(t * 0.4) * 0.15;
        },
      }),
  },
  compute: {
    label: "1D 势阱能级",
    description:
      "无限深方势阱解析能级 E_n ∝ n² / L²。调节宽度与量子数，观察能级稀疏化——DFT 之前的量子玩具。",
    params: [
      { id: "L", label: "阱宽 L (Å)", type: "number", default: 5, min: 1, max: 20, step: 0.5 },
      { id: "nMax", label: "最高量子数 n", type: "number", default: 6, min: 1, max: 12, step: 1 },
      {
        id: "mass",
        label: "有效质量比 m*/m_e",
        type: "number",
        default: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
    ],
    run: async (values, ctx) => {
      const L = Number(values.L);
      const nMax = Math.floor(Number(values.nMax));
      const mass = Number(values.mass);
      // Hartree atomic units scaled toy: E(eV) ~ (n² hbar² π²) / (2 m L²)
      const prefactor = 37.603 / (mass * L * L);
      const rows: (string | number)[][] = [];
      const series: { x: number; y: number }[] = [];

      await forEachChunked(nMax, 2, (i) => {
        const n = i + 1;
        const E = prefactor * n * n;
        rows.push([n, E.toFixed(4)]);
        series.push({ x: n, y: E });
      }, ctx);

      return {
        summary: `无限深势阱前 ${nMax} 个能级（玩具模型，单位 eV）。`,
        table: { headers: ["n", "E (eV)"], rows },
        series,
      };
    },
  },
};
