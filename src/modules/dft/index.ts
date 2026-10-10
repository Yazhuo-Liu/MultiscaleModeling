import type { ModelingModule } from "@/core/types";
import { mountSimpleScene, physicalMat } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Density Functional Theory — electronic-structure intro + demos. */
export const dftModule: ModelingModule = {
  id: "dft",
  title: "DFT",
  summary:
    "Density functional theory: approximate many-body Schrödinger physics through the electron density.",
  scale: "electronic",
  accent: "#1f6f78",
  tags: ["first-principles", "electronic structure", "exchange–correlation"],
  intro: {
    lead: "DFT replaces the many-electron wavefunction with the electron density, making electronic-structure calculations practical for materials.",
    sections: [
      {
        heading: "Core idea",
        body: "The Hohenberg–Kohn theorems show that ground-state properties are uniquely determined by the electron density. Kohn–Sham DFT maps the interacting problem onto effective single-particle equations; most of the remaining difficulty sits in the exchange–correlation functional.",
      },
      {
        heading: "Common approximations",
        body: "LDA, GGA, meta-GGA, and hybrid functionals form a ladder of XC approximations. Plane-wave pseudopotential codes and localized-basis codes are the two dominant implementation families. Demos here are conceptual toys—not substitutes for VASP, Quantum ESPRESSO, and similar production codes.",
      },
      {
        heading: "Typical uses",
        body: "Equilibrium structures, bands, densities of states, defect formation energies, and early reaction-path screening. Strong correlation, excitations, and very large systems need other methods or embedded multiscale strategies.",
      },
    ],
    references: [
      { label: "Kohn & Sham, Phys. Rev. 140, A1133 (1965)" },
      { label: "Martin, Electronic Structure (Cambridge)" },
    ],
  },
  render: {
    label: "Electron density",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xe7f0ef,
        contactShadow: true,
        cameraPosition: [1.8, 1.4, 3.6],
        setup: (scene) => {
          const disposables: { dispose: () => void }[] = [];

          const nucleus = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 48, 48),
            physicalMat(0xf0d5a8, { metalness: 0.55, roughness: 0.25, clearcoat: 0.8 }),
          );
          nucleus.castShadow = true;
          scene.add(nucleus);
          disposables.push(nucleus.geometry, nucleus.material);

          // Nested isosurfaces suggesting ρ(r) shells
          const shells = [
            { r: 0.72, color: 0x1f6f78, opacity: 0.55 },
            { r: 1.15, color: 0x3d9aa3, opacity: 0.28 },
            { r: 1.65, color: 0x7eb8c9, opacity: 0.14 },
          ];
          for (const s of shells) {
            const mesh = new THREE.Mesh(
              new THREE.IcosahedronGeometry(s.r, 4),
              physicalMat(s.color, {
                transparent: true,
                opacity: s.opacity,
                roughness: 0.15,
                metalness: 0,
                clearcoat: 1,
                transmission: 0.35,
                thickness: 0.4,
                depthWrite: false,
              }),
            );
            mesh.castShadow = true;
            scene.add(mesh);
            disposables.push(mesh.geometry, mesh.material);
          }

          // Orbital probability cloud
          const count = 420;
          const positions = new Float32Array(count * 3);
          const colors = new Float32Array(count * 3);
          const cInner = new THREE.Color(0x2a6f4e);
          const cOuter = new THREE.Color(0x7eb8c9);
          for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            // Prefer denser samples near the nucleus (toy exponential)
            const r = -Math.log(1 - Math.random() * 0.92) * 0.55;
            const rr = Math.min(r, 2.1);
            positions[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = rr * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = rr * Math.cos(phi);
            const col = cInner.clone().lerp(cOuter, Math.min(rr / 2, 1));
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
          }
          const cloudGeo = new THREE.BufferGeometry();
          cloudGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          cloudGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          const cloud = new THREE.Points(
            cloudGeo,
            new THREE.PointsMaterial({
              size: 0.035,
              vertexColors: true,
              transparent: true,
              opacity: 0.85,
              depthWrite: false,
              sizeAttenuation: true,
            }),
          );
          scene.add(cloud);
          disposables.push(cloudGeo, cloud.material);

          return () => {
            for (const d of disposables) d.dispose();
          };
        },
        onFrame: (scene, t) => {
          scene.traverse((obj) => {
            if (
              obj instanceof THREE.Mesh &&
              obj.geometry instanceof THREE.IcosahedronGeometry
            ) {
              obj.rotation.y = t * 0.22;
              obj.rotation.x = Math.sin(t * 0.35) * 0.12;
            }
            if (obj instanceof THREE.Points) {
              obj.rotation.y = t * 0.18;
              obj.rotation.z = Math.sin(t * 0.25) * 0.08;
            }
          });
        },
      }),
  },
  compute: {
    label: "1D well levels",
    description:
      "Analytic levels of an infinite square well, Eₙ ∝ n² / L². Vary width and quantum number to see level spacing — a pre-DFT quantum toy.",
    params: [
      { id: "L", label: "Well width L (Å)", type: "number", default: 5, min: 1, max: 20, step: 0.5 },
      { id: "nMax", label: "Max quantum number n", type: "number", default: 6, min: 1, max: 12, step: 1 },
      {
        id: "mass",
        label: "Effective mass m*/mₑ",
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
        summary: `First ${nMax} levels of an infinite well (toy model, eV).`,
        table: { headers: ["n", "E (eV)"], rows },
        series,
      };
    },
  },
};
