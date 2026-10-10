import type { ModelingModule } from "@/core/types";
import { mountSimpleScene } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Finite Element Method — continuum intro. */
export const femModule: ModelingModule = {
  id: "fem",
  title: "有限元法",
  summary: "连续介质离散：用单元与形函数求解 PDE，衔接微观本构与工程结构。",
  scale: "continuum",
  accent: "#3f5d4a",
  tags: ["PDE", "网格", "本构"],
  intro: {
    lead: "有限元把求解域剖分成单元，在弱形式下用分片多项式逼近场变量。",
    sections: [
      {
        heading: "基本流程",
        body: "几何离散 → 选择形函数 → 单元刚度 / 载荷组装 → 施加边界条件 → 求解线性（或非线性）系统 → 后处理。",
      },
      {
        heading: "与多尺度的接点",
        body: "微观计算可提供有效本构；FE²、均质化、嵌入式原子–连续耦合等方法把细观信息带入宏观 FE 模型。",
      },
    ],
    references: [
      { label: "Hughes, The Finite Element Method" },
      { label: "Zienkiewicz & Taylor, The Finite Element Method" },
    ],
  },
  render: {
    label: "网格变形示意",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xe9f0ec,
        cameraZ: 5,
        setup: (scene) => {
          const geo = new THREE.PlaneGeometry(3, 2, 12, 8);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x3f5d4a,
            wireframe: true,
          });
          const mesh = new THREE.Mesh(geo, mat);
          scene.add(mesh);
          return () => {
            geo.dispose();
            mat.dispose();
          };
        },
        onFrame: (scene, t) => {
          const mesh = scene.children.find(
            (c) => (c as THREE.Mesh).isMesh,
          ) as THREE.Mesh | undefined;
          if (!mesh) return;
          const pos = mesh.geometry.attributes.position!;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            // Mild bending wave on the wireframe plate
            pos.setZ(i, 0.2 * Math.sin(x * 2.2 + t * 2) * Math.cos(y * 1.4));
          }
          pos.needsUpdate = true;
        },
      }),
  },
  compute: {
    label: "1D 杆单元拉伸",
    description: "两节点线性杆单元：固定左端，右端受力，求位移（解析组装）。",
    params: [
      { id: "E", label: "杨氏模量 E (GPa)", type: "number", default: 200, min: 10, max: 400, step: 10 },
      { id: "A", label: "截面积 A (mm²)", type: "number", default: 100, min: 10, max: 1000, step: 10 },
      { id: "L", label: "长度 L (mm)", type: "number", default: 500, min: 50, max: 2000, step: 50 },
      { id: "F", label: "轴向力 F (kN)", type: "number", default: 10, min: 0.1, max: 100, step: 0.5 },
      { id: "nElem", label: "单元数", type: "number", default: 4, min: 1, max: 20, step: 1 },
    ],
    run: async (values, ctx) => {
      const E = Number(values.E) * 1e3; // MPa if A in mm² → N/mm²
      const A = Number(values.A);
      const L = Number(values.L);
      const F = Number(values.F) * 1e3; // N
      const nElem = Math.floor(Number(values.nElem));
      const nNode = nElem + 1;
      const le = L / nElem;
      const k = (E * A) / le;

      const K = Array.from({ length: nNode }, () => Array(nNode).fill(0));
      await forEachChunked(nElem, 2, (e) => {
        const i = e;
        const j = e + 1;
        K[i]![i]! += k;
        K[i]![j]! -= k;
        K[j]![i]! -= k;
        K[j]![j]! += k;
      }, ctx);

      // Reduce: u0 = 0, solve for free dofs
      const nFree = nNode - 1;
      const Kf = Array.from({ length: nFree }, (_, r) =>
        Array.from({ length: nFree }, (_, c) => K[r + 1]![c + 1]!),
      );
      const bf = Array(nFree).fill(0);
      bf[nFree - 1] = F;

      // Gaussian elimination for tiny systems
      for (let i = 0; i < nFree; i++) {
        let piv = i;
        for (let r = i + 1; r < nFree; r++) {
          if (Math.abs(Kf[r]![i]!) > Math.abs(Kf[piv]![i]!)) piv = r;
        }
        [Kf[i], Kf[piv]] = [Kf[piv]!, Kf[i]!];
        [bf[i], bf[piv]] = [bf[piv], bf[i]];
        for (let r = i + 1; r < nFree; r++) {
          const f = Kf[r]![i]! / Kf[i]![i]!;
          for (let c = i; c < nFree; c++) Kf[r]![c]! -= f * Kf[i]![c]!;
          bf[r]! -= f * bf[i]!;
        }
      }
      const uFree = Array(nFree).fill(0);
      for (let i = nFree - 1; i >= 0; i--) {
        let s = bf[i]!;
        for (let c = i + 1; c < nFree; c++) s -= Kf[i]![c]! * uFree[c]!;
        uFree[i] = s / Kf[i]![i]!;
      }

      const u = [0, ...uFree];
      const uTipAnalytic = (F * L) / (E * A);
      const series = u.map((ui, i) => ({ x: (i * L) / nElem, y: ui }));

      return {
        summary: `右端位移 ≈ ${u[u.length - 1]!.toFixed(6)} mm（解析 FL/EA = ${uTipAnalytic.toFixed(6)} mm）。`,
        series,
        table: {
          headers: ["节点", "x (mm)", "u (mm)"],
          rows: u.map((ui, i) => [i, ((i * L) / nElem).toFixed(2), ui.toFixed(6)]),
        },
      };
    },
  },
};
