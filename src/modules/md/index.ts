import type { ModelingModule } from "@/core/types";
import { mountSimpleScene } from "@/core/render/simpleScene";
import { forEachChunked, throwIfAborted } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Molecular Dynamics — finite-temperature atomic trajectories. */
export const mdModule: ModelingModule = {
  id: "md",
  title: "MD",
  summary: "分子动力学：积分牛顿方程，在有限温度下追踪原子轨迹。",
  scale: "atomic",
  accent: "#3d5a80",
  tags: ["轨迹", "系综", "势函数"],
  intro: {
    lead: "MD 在经典近似下用势函数力推动原子运动，连接微观相互作用与宏观可观测量。",
    sections: [
      {
        heading: "积分与系综",
        body: "Verlet / velocity-Verlet 是常用积分器。NVE、NVT、NPT 等系综通过恒温器与恒压器实现。时间步长受最高频振动约束。",
      },
      {
        heading: "浏览器 demo 边界",
        body: "本模块提供极少粒子的 LJ 气体玩具，用于理解温度与动能关系；生产级 MD 请使用 LAMMPS、GROMACS 等。",
      },
    ],
  },
  render: {
    label: "粒子热运动",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xe8eef4,
        cameraZ: 6,
        setup: (scene) => {
          const group = new THREE.Group();
          const mat = new THREE.MeshStandardMaterial({ color: 0x3d5a80 });
          for (let i = 0; i < 24; i++) {
            const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), mat);
            m.userData.phase = Math.random() * Math.PI * 2;
            m.userData.radius = 0.8 + Math.random() * 1.6;
            group.add(m);
          }
          scene.add(group);
          return () => mat.dispose();
        },
        onFrame: (scene, t) => {
          const g = scene.children.find((c) => c instanceof THREE.Group) as THREE.Group | undefined;
          g?.children.forEach((child, i) => {
            const phase = child.userData.phase as number;
            const r = child.userData.radius as number;
            child.position.set(
              Math.cos(t * (0.7 + i * 0.03) + phase) * r,
              Math.sin(t * (0.9 + i * 0.02) + phase * 1.3) * r * 0.7,
              Math.sin(t * 0.5 + phase) * 0.8,
            );
          });
        },
      }),
  },
  compute: {
    label: "2D LJ 气体温度",
    description: "极少粒子 velocity-Verlet + LJ，统计动能温度（玩具）。",
    params: [
      { id: "n", label: "粒子数", type: "number", default: 16, min: 4, max: 36, step: 1 },
      { id: "T0", label: "初温目标", type: "number", default: 1.0, min: 0.2, max: 3, step: 0.1 },
      { id: "steps", label: "步数", type: "number", default: 200, min: 50, max: 800, step: 50 },
    ],
    run: async (values, ctx) => {
      const n = Math.floor(Number(values.n));
      const T0 = Number(values.T0);
      const steps = Math.floor(Number(values.steps));
      const box = 8;
      const dt = 0.005;
      const positions = Array.from({ length: n }, (_, i) => ({
        x: (i % Math.ceil(Math.sqrt(n))) * (box / Math.ceil(Math.sqrt(n))) + 0.5,
        y: Math.floor(i / Math.ceil(Math.sqrt(n))) * (box / Math.ceil(Math.sqrt(n))) + 0.5,
      }));
      let vels = positions.map(() => ({
        x: (Math.random() - 0.5) * Math.sqrt(T0),
        y: (Math.random() - 0.5) * Math.sqrt(T0),
      }));

      const forces = () => {
        const f = positions.map(() => ({ x: 0, y: 0 }));
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            let dx = positions[i]!.x - positions[j]!.x;
            let dy = positions[i]!.y - positions[j]!.y;
            if (dx > box / 2) dx -= box;
            if (dx < -box / 2) dx += box;
            if (dy > box / 2) dy -= box;
            if (dy < -box / 2) dy += box;
            const r2 = dx * dx + dy * dy;
            if (r2 > 6.25 || r2 < 1e-6) continue;
            const inv = 1 / r2;
            const sr2 = inv;
            const sr6 = sr2 * sr2 * sr2;
            const ff = 24 * (2 * sr6 * sr6 - sr6) * inv;
            f[i]!.x += ff * dx;
            f[i]!.y += ff * dy;
            f[j]!.x -= ff * dx;
            f[j]!.y -= ff * dy;
          }
        }
        return f;
      };

      let f = forces();
      const series: { x: number; y: number }[] = [];

      await forEachChunked(steps, 20, (step) => {
        throwIfAborted(ctx.signal);
        for (let i = 0; i < n; i++) {
          vels[i]!.x += 0.5 * dt * f[i]!.x;
          vels[i]!.y += 0.5 * dt * f[i]!.y;
          positions[i]!.x = (positions[i]!.x + dt * vels[i]!.x + box) % box;
          positions[i]!.y = (positions[i]!.y + dt * vels[i]!.y + box) % box;
        }
        f = forces();
        for (let i = 0; i < n; i++) {
          vels[i]!.x += 0.5 * dt * f[i]!.x;
          vels[i]!.y += 0.5 * dt * f[i]!.y;
        }
        if (step % 10 === 0) {
          const ke =
            vels.reduce((s, v) => s + 0.5 * (v.x * v.x + v.y * v.y), 0) / n;
          series.push({ x: step, y: ke });
        }
      }, ctx);

      const T =
        series.length > 0 ? series[series.length - 1]!.y : 0;
      return {
        summary: `末态动能温度指标 ≈ ${T.toFixed(4)}（约化单位，玩具统计）。`,
        series,
      };
    },
  },
};
