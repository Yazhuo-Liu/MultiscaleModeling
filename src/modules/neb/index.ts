import type { ModelingModule } from "@/core/types";
import { mountSimpleScene } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Nudged Elastic Band — transition path finding. */
export const nebModule: ModelingModule = {
  id: "neb",
  title: "NEB",
  summary: "弹性带方法：在初末态之间寻找最小能量路径与鞍点。",
  scale: "atomic",
  accent: "#c45c26",
  tags: ["过渡态", "能垒", "反应路径"],
  intro: {
    lead: "NEB 用一串“像”连接反应物与产物，通过弹簧力与投影力寻找最小能量路径（MEP）。",
    sections: [
      {
        heading: "方法要点",
        body: "切向弹簧力保持像间距，垂直势能力驱动像落到 MEP 上。Climbing-image NEB 让最高像沿切向上爬以精确落在鞍点。",
      },
      {
        heading: "实践注意",
        body: "初猜路径质量影响收敛；需足够像密度与合适弹簧常数。常与 DFT / 经验势力计算联用。",
      },
    ],
  },
  render: {
    label: "路径上的像",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xf3ebe4,
        cameraZ: 5.5,
        setup: (scene) => {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, -0.4, 0),
            new THREE.Vector3(-1, 0.6, 0.2),
            new THREE.Vector3(0, 1.1, 0),
            new THREE.Vector3(1, 0.5, -0.2),
            new THREE.Vector3(2, -0.3, 0),
          ]);
          const tube = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 64, 0.04, 8, false),
            new THREE.MeshStandardMaterial({ color: 0xc45c26 }),
          );
          scene.add(tube);
          const images = new THREE.Group();
          for (let i = 0; i <= 8; i++) {
            const p = curve.getPoint(i / 8);
            const m = new THREE.Mesh(
              new THREE.SphereGeometry(i === 4 ? 0.16 : 0.11, 16, 16),
              new THREE.MeshStandardMaterial({
                color: i === 4 ? 0x1f6f78 : 0x5c4033,
              }),
            );
            m.position.copy(p);
            images.add(m);
          }
          scene.add(images);
        },
        onFrame: (scene, t) => {
          scene.rotation.y = Math.sin(t * 0.3) * 0.35;
        },
      }),
  },
  compute: {
    label: "1D 双阱 MEP 玩具",
    description: "在双阱势上放置若干像，用简化 NEB 迭代估计能垒。",
    params: [
      { id: "nImages", label: "像数量", type: "number", default: 9, min: 5, max: 21, step: 2 },
      { id: "k", label: "弹簧常数", type: "number", default: 5, min: 0.5, max: 20, step: 0.5 },
      { id: "iters", label: "迭代次数", type: "number", default: 80, min: 20, max: 300, step: 10 },
    ],
    run: async (values, ctx) => {
      const n = Math.floor(Number(values.nImages));
      const k = Number(values.k);
      const iters = Math.floor(Number(values.iters));
      const V = (x: number) => (x * x - 1) ** 2;
      const dV = (x: number) => 4 * x * (x * x - 1);

      const xs = Array.from({ length: n }, (_, i) => -1.2 + (2.4 * i) / (n - 1));
      const series: { x: number; y: number }[] = [];

      await forEachChunked(iters, 8, () => {
        const forces = xs.map((x, i) => {
          if (i === 0 || i === n - 1) return 0;
          const tau = xs[i + 1]! - xs[i - 1]!;
          const tHat = tau === 0 ? 0 : Math.sign(tau);
          const spring = k * ((xs[i + 1]! - x) - (x - xs[i - 1]!));
          const fSpring = spring * tHat;
          const fPot = -dV(x);
          const fPotPerp = fPot - fPot * tHat * tHat;
          return fSpring + fPotPerp;
        });
        for (let i = 1; i < n - 1; i++) xs[i]! += 0.02 * forces[i]!;
      }, ctx);

      let barrier = -Infinity;
      for (let i = 0; i < n; i++) {
        const e = V(xs[i]!);
        series.push({ x: xs[i]!, y: e });
        barrier = Math.max(barrier, e);
      }

      return {
        summary: `估计能垒 ≈ ${barrier.toFixed(4)}（双阱解析鞍点 V(0)=1）。`,
        series,
        table: {
          headers: ["像", "x", "V(x)"],
          rows: xs.map((x, i) => [i, x.toFixed(4), V(x).toFixed(4)]),
        },
      };
    },
  },
};
