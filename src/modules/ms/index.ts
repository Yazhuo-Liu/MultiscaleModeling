import type { ModelingModule } from "@/core/types";
import { mountSimpleScene, physicalMat } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Molecular Simulation / Molecular Statics — structure optimization at atomic scale. */
export const msModule: ModelingModule = {
  id: "ms",
  title: "MS",
  summary:
    "Molecular statics: potential-driven configuration search and energy minimization.",
  scale: "atomic",
  accent: "#2a6f4e",
  tags: ["interatomic potential", "energy minimization", "configuration"],
  intro: {
    lead: "Molecular statics seeks a local energy minimum for a given potential—foundational atomic-scale structure work.",
    sections: [
      {
        heading: "Relation to MD",
        body: "MS neglects thermal fluctuations and focuses on near–0 K stable structures; MD integrates Newton’s equations at finite temperature. Both often share the same interatomic potential or force field.",
      },
      {
        heading: "Optimizers",
        body: "Steepest descent, conjugate gradient, and L-BFGS are common relaxers. Constrained optimization, NEB initial guesses, and defect supercell construction frequently sit next to MS in a workflow.",
      },
    ],
    references: [
      { label: "Frenkel & Smit, Understanding Molecular Simulation" },
    ],
  },
  render: {
    label: "Lattice relaxation",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xeaf3ef,
        contactShadow: true,
        cameraPosition: [2.4, 2.0, 3.8],
        lookAt: [0, 0, 0],
        setup: (scene) => {
          const group = new THREE.Group();
          const atomMat = physicalMat(0x2a6f4e, {
            metalness: 0.35,
            roughness: 0.28,
            clearcoat: 0.55,
          });
          const bondMat = physicalMat(0x8fb5a0, {
            metalness: 0.1,
            roughness: 0.45,
            transparent: true,
            opacity: 0.75,
          });
          const atomGeo = new THREE.SphereGeometry(0.18, 32, 32);
          const atoms: THREE.Mesh[] = [];
          const spacing = 0.85;

          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              for (let k = 0; k < 3; k++) {
                const ball = new THREE.Mesh(atomGeo, atomMat);
                ball.position.set((i - 1) * spacing, (j - 1) * spacing, (k - 1) * spacing);
                ball.castShadow = true;
                ball.receiveShadow = true;
                group.add(ball);
                atoms.push(ball);
              }
            }
          }

          // Bonds along nearest neighbors on a simple cubic lattice
          const bondGeo = new THREE.CylinderGeometry(0.03, 0.03, spacing, 10);
          const dirs: [number, number, number][] = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ];
          for (const a of atoms) {
            for (const [dx, dy, dz] of dirs) {
              const neighbor = atoms.find(
                (b) =>
                  Math.abs(b.position.x - (a.position.x + dx * spacing)) < 1e-6 &&
                  Math.abs(b.position.y - (a.position.y + dy * spacing)) < 1e-6 &&
                  Math.abs(b.position.z - (a.position.z + dz * spacing)) < 1e-6,
              );
              if (!neighbor) continue;
              const bond = new THREE.Mesh(bondGeo, bondMat);
              const mid = new THREE.Vector3().addVectors(a.position, neighbor.position).multiplyScalar(0.5);
              bond.position.copy(mid);
              bond.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(dx, dy, dz).normalize(),
              );
              group.add(bond);
            }
          }

          scene.add(group);
          scene.userData.lattice = group;

          return () => {
            atomGeo.dispose();
            bondGeo.dispose();
            atomMat.dispose();
            bondMat.dispose();
          };
        },
        onFrame: (scene, t) => {
          const group = scene.userData.lattice as THREE.Group | undefined;
          if (!group) return;
          const stretch = 1 + 0.045 * Math.sin(t * 1.8);
          group.scale.set(stretch, 1 / Math.sqrt(stretch), 1 / Math.sqrt(stretch));
          group.rotation.y = t * 0.28;
          group.rotation.x = 0.25 + Math.sin(t * 0.4) * 0.05;
        },
      }),
  },
  compute: {
    label: "1D Lennard-Jones minimize",
    description:
      "Simple gradient descent on a diatomic LJ potential to watch the equilibrium spacing converge.",
    params: [
      { id: "eps", label: "ε (energy units)", type: "number", default: 1, min: 0.1, max: 5, step: 0.1 },
      { id: "sigma", label: "σ", type: "number", default: 1, min: 0.5, max: 2, step: 0.05 },
      { id: "r0", label: "Initial spacing", type: "number", default: 1.5, min: 0.8, max: 3, step: 0.05 },
      { id: "steps", label: "Iterations", type: "number", default: 40, min: 10, max: 200, step: 5 },
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
        summary: `Converged spacing ≈ ${r.toFixed(4)} (analytic min ${rEq.toFixed(4)}), E ≈ ${energy(r).toFixed(4)}`,
        series,
      };
    },
  },
};
