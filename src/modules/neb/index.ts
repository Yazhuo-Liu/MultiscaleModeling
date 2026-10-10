import type { ModelingModule } from "@/core/types";
import { mountSimpleScene, physicalMat } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Nudged Elastic Band — transition path finding. */
export const nebModule: ModelingModule = {
  id: "neb",
  title: "NEB",
  summary:
    "Nudged elastic band: find a minimum-energy path and saddle between end states.",
  scale: "atomic",
  accent: "#c45c26",
  tags: ["transition state", "energy barrier", "reaction path"],
  intro: {
    lead: "NEB connects reactants and products with a chain of images, using spring forces and projected potential forces to locate the minimum-energy path (MEP).",
    sections: [
      {
        heading: "Method essentials",
        body: "Tangential spring forces keep image spacing; forces perpendicular to the path drive images onto the MEP. Climbing-image NEB lets the highest image ascend along the tangent to pin the saddle.",
      },
      {
        heading: "Practical notes",
        body: "Initial-path quality affects convergence; you need enough images and a sensible spring constant. NEB is often paired with DFT or empirical force evaluations.",
      },
    ],
  },
  render: {
    label: "Path images",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xf3ebe4,
        contactShadow: true,
        cameraPosition: [0.2, 2.2, 4.8],
        lookAt: [0, 0.3, 0],
        setup: (scene) => {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2.2, -0.55, 0),
            new THREE.Vector3(-1.1, 0.55, 0.35),
            new THREE.Vector3(0, 1.25, 0),
            new THREE.Vector3(1.1, 0.45, -0.35),
            new THREE.Vector3(2.2, -0.5, 0),
          ]);

          const tube = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 96, 0.035, 12, false),
            physicalMat(0xc45c26, {
              metalness: 0.2,
              roughness: 0.35,
              clearcoat: 0.5,
            }),
          );
          tube.castShadow = true;
          scene.add(tube);

          // Energy ribbon under the path
          const ribbonPts: THREE.Vector3[] = [];
          for (let i = 0; i <= 40; i++) {
            const p = curve.getPoint(i / 40);
            ribbonPts.push(new THREE.Vector3(p.x, -1.05, p.z));
          }
          const ribbon = new THREE.Mesh(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(ribbonPts),
              64,
              0.02,
              8,
              false,
            ),
            physicalMat(0xd9c4b0, { roughness: 0.7, metalness: 0 }),
          );
          scene.add(ribbon);

          const images = new THREE.Group();
          const n = 9;
          for (let i = 0; i <= n; i++) {
            const u = i / n;
            const p = curve.getPoint(u);
            const isSaddle = i === Math.floor(n / 2);
            const m = new THREE.Mesh(
              new THREE.SphereGeometry(isSaddle ? 0.15 : 0.1, 28, 28),
              physicalMat(isSaddle ? 0x1f6f78 : 0x5c4033, {
                metalness: isSaddle ? 0.45 : 0.2,
                roughness: 0.25,
                clearcoat: 0.7,
                emissive: isSaddle ? 0x0a3035 : 0x000000,
                emissiveIntensity: isSaddle ? 0.15 : 0,
              }),
            );
            m.position.copy(p);
            m.castShadow = true;
            images.add(m);

            // Drop line to “energy axis”
            if (i % 2 === 0 || isSaddle) {
              const h = p.y + 1.05;
              const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.012, 0.012, h, 8),
                physicalMat(0xb08968, { transparent: true, opacity: 0.45, roughness: 0.6 }),
              );
              stem.position.set(p.x, p.y - h / 2, p.z);
              images.add(stem);
            }
          }
          scene.add(images);
          scene.userData.neb = { tube, images };

          return () => {
            tube.geometry.dispose();
            (tube.material as THREE.Material).dispose();
            ribbon.geometry.dispose();
            (ribbon.material as THREE.Material).dispose();
          };
        },
        onFrame: (scene, t, camera) => {
          const root = scene.userData.neb as
            | { images: THREE.Group }
            | undefined;
          if (root) {
            root.images.rotation.y = Math.sin(t * 0.35) * 0.2;
          }
          camera.position.x = Math.sin(t * 0.15) * 0.4;
          camera.lookAt(0, 0.3, 0);
        },
      }),
  },
  compute: {
    label: "1D double-well MEP toy",
    description:
      "Place images on a double-well potential and iterate a simplified NEB to estimate the barrier.",
    params: [
      { id: "nImages", label: "Number of images", type: "number", default: 9, min: 5, max: 21, step: 2 },
      { id: "k", label: "Spring constant", type: "number", default: 5, min: 0.5, max: 20, step: 0.5 },
      { id: "iters", label: "Iterations", type: "number", default: 80, min: 20, max: 300, step: 10 },
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
        summary: `Estimated barrier ≈ ${barrier.toFixed(4)} (analytic saddle V(0)=1).`,
        series,
        table: {
          headers: ["image", "x", "V(x)"],
          rows: xs.map((x, i) => [i, x.toFixed(4), V(x).toFixed(4)]),
        },
      };
    },
  },
};
