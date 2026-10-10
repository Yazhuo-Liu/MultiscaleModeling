import type { ModelingModule } from "@/core/types";
import { mountSimpleScene, physicalMat } from "@/core/render/simpleScene";
import { forEachChunked, throwIfAborted } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Molecular Dynamics — finite-temperature atomic trajectories. */
export const mdModule: ModelingModule = {
  id: "md",
  title: "MD",
  summary:
    "Molecular dynamics: integrate Newton’s equations to follow atoms at finite temperature.",
  scale: "atomic",
  accent: "#3d5a80",
  tags: ["trajectory", "ensemble", "potential"],
  intro: {
    lead: "MD drives atoms with forces from a potential, linking microscopic interactions to macroscopic observables under a classical approximation.",
    sections: [
      {
        heading: "Integrators and ensembles",
        body: "Verlet / velocity-Verlet are standard integrators. NVE, NVT, and NPT ensembles are realized with thermostats and barostats. The time step is limited by the highest vibrational frequency.",
      },
      {
        heading: "Browser demo limits",
        body: "This module ships a tiny LJ-gas toy to illustrate kinetic temperature—not a production MD engine. Prefer LAMMPS, GROMACS, and similar codes for real work.",
      },
    ],
  },
  render: {
    label: "Thermal motion",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xe8eef4,
        contactShadow: true,
        cameraPosition: [2.8, 2.4, 4.2],
        lookAt: [0, 0, 0],
        setup: (scene) => {
          const box = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(3.2, 3.2, 3.2)),
            new THREE.LineBasicMaterial({
              color: 0x3d5a80,
              transparent: true,
              opacity: 0.35,
            }),
          );
          scene.add(box);

          const group = new THREE.Group();
          const geo = new THREE.SphereGeometry(0.12, 24, 24);
          const mats = [
            physicalMat(0x3d5a80, { metalness: 0.4, roughness: 0.25, clearcoat: 0.6 }),
            physicalMat(0x6b8cae, { metalness: 0.35, roughness: 0.3, clearcoat: 0.5 }),
            physicalMat(0x1f6f78, { metalness: 0.3, roughness: 0.28, clearcoat: 0.55 }),
          ];

          type Particle = {
            mesh: THREE.Mesh;
            vel: THREE.Vector3;
            pos: THREE.Vector3;
          };
          const particles: Particle[] = [];
          const n = 28;
          for (let i = 0; i < n; i++) {
            const mesh = new THREE.Mesh(geo, mats[i % mats.length]!);
            mesh.castShadow = true;
            const pos = new THREE.Vector3(
              (Math.random() - 0.5) * 2.4,
              (Math.random() - 0.5) * 2.4,
              (Math.random() - 0.5) * 2.4,
            );
            mesh.position.copy(pos);
            group.add(mesh);
            particles.push({
              mesh,
              pos,
              vel: new THREE.Vector3(
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 1.2,
              ),
            });
          }
          scene.add(group);
          scene.userData.md = { particles, half: 1.45 };

          return () => {
            geo.dispose();
            mats.forEach((m) => m.dispose());
            box.geometry.dispose();
            (box.material as THREE.Material).dispose();
          };
        },
        onFrame: (scene, t, camera) => {
          const data = scene.userData.md as
            | { particles: { mesh: THREE.Mesh; vel: THREE.Vector3; pos: THREE.Vector3 }[]; half: number }
            | undefined;
          if (!data) return;
          const dt = 0.016;
          for (const p of data.particles) {
            p.pos.addScaledVector(p.vel, dt);
            for (const axis of ["x", "y", "z"] as const) {
              if (p.pos[axis] > data.half) {
                p.pos[axis] = data.half;
                p.vel[axis] *= -1;
              } else if (p.pos[axis] < -data.half) {
                p.pos[axis] = -data.half;
                p.vel[axis] *= -1;
              }
            }
            p.mesh.position.copy(p.pos);
          }
          camera.position.x = 2.8 * Math.cos(t * 0.12);
          camera.position.z = 4.2 * Math.sin(t * 0.12) + 2.5;
          camera.lookAt(0, 0, 0);
        },
      }),
  },
  compute: {
    label: "2D LJ gas temperature",
    description:
      "Tiny velocity-Verlet + LJ gas; report a kinetic-temperature indicator (toy units).",
    params: [
      { id: "n", label: "Particle count", type: "number", default: 16, min: 4, max: 36, step: 1 },
      { id: "T0", label: "Target initial T", type: "number", default: 1.0, min: 0.2, max: 3, step: 0.1 },
      { id: "steps", label: "Steps", type: "number", default: 200, min: 50, max: 800, step: 50 },
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
      const vels = positions.map(() => ({
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
            const sr6 = inv * inv * inv;
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

      const T = series.length > 0 ? series[series.length - 1]!.y : 0;
      return {
        summary: `Final kinetic-temperature indicator ≈ ${T.toFixed(4)} (reduced units, toy stats).`,
        series,
      };
    },
  },
};
