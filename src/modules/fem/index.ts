import type { ModelingModule } from "@/core/types";
import { mountSimpleScene, physicalMat } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Finite Element Method — continuum intro. */
export const femModule: ModelingModule = {
  id: "fem",
  title: "FEM",
  summary:
    "Continuum discretization: solve PDEs with elements and shape functions, linking micro constitutive laws to structures.",
  scale: "continuum",
  accent: "#3f5d4a",
  tags: ["PDE", "mesh", "constitutive law"],
  intro: {
    lead: "The finite-element method partitions a domain into elements and approximates field variables with piecewise polynomials in weak form.",
    sections: [
      {
        heading: "Basic workflow",
        body: "Discretize geometry → choose shape functions → assemble element stiffness / loads → apply boundary conditions → solve the (non)linear system → post-process.",
      },
      {
        heading: "Multiscale contact points",
        body: "Microscale calculations can supply effective constitutive responses. FE², homogenization, and atom–continuum embedding carry fine-scale information into macroscopic FE models.",
      },
    ],
    references: [
      { label: "Hughes, The Finite Element Method" },
      { label: "Zienkiewicz & Taylor, The Finite Element Method" },
    ],
  },
  render: {
    label: "Deforming mesh",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xe9f0ec,
        contactShadow: true,
        cameraPosition: [2.6, 2.2, 4.0],
        lookAt: [0, 0.1, 0],
        setup: (scene) => {
          const nx = 16;
          const ny = 10;
          const geo = new THREE.PlaneGeometry(3.4, 2.1, nx, ny);
          const base = new Float32Array(geo.attributes.position!.array as Float32Array);

          const solid = new THREE.Mesh(
            geo,
            physicalMat(0x3f5d4a, {
              metalness: 0.12,
              roughness: 0.4,
              clearcoat: 0.25,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.88,
            }),
          );
          solid.castShadow = true;
          solid.receiveShadow = true;

          const wire = new THREE.LineSegments(
            new THREE.WireframeGeometry(geo),
            new THREE.LineBasicMaterial({
              color: 0xd7e6dc,
              transparent: true,
              opacity: 0.55,
            }),
          );

          const root = new THREE.Group();
          root.add(solid, wire);
          scene.add(root);

          // Fixed / loaded edge markers
          const pinMat = physicalMat(0x1f6f78, { metalness: 0.4, roughness: 0.3 });
          const loadMat = physicalMat(0xc45c26, { metalness: 0.35, roughness: 0.3 });
          const pinGeo = new THREE.SphereGeometry(0.06, 16, 16);
          for (let j = 0; j <= ny; j++) {
            const y = -1.05 + (2.1 * j) / ny;
            const pin = new THREE.Mesh(pinGeo, pinMat);
            pin.position.set(-1.7, y, 0.02);
            pin.castShadow = true;
            root.add(pin);
          }
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1.7, 0, 0.05),
            0.55,
            0xc45c26,
            0.14,
            0.1,
          );
          root.add(arrow);
          // tip marker
          const tip = new THREE.Mesh(pinGeo, loadMat);
          tip.position.set(1.7, 0, 0.02);
          root.add(tip);

          scene.userData.fem = { geo, base, solid, wire, root, nx, ny };

          return () => {
            geo.dispose();
            (solid.material as THREE.Material).dispose();
            wire.geometry.dispose();
            (wire.material as THREE.Material).dispose();
            pinGeo.dispose();
            pinMat.dispose();
            loadMat.dispose();
          };
        },
        onFrame: (scene, t, camera) => {
          const data = scene.userData.fem as
            | {
                geo: THREE.PlaneGeometry;
                base: Float32Array;
                solid: THREE.Mesh;
                wire: THREE.LineSegments;
                root: THREE.Group;
                nx: number;
                ny: number;
              }
            | undefined;
          if (!data) return;

          const pos = data.geo.attributes.position!;
          const amp = 0.22 * (0.55 + 0.45 * Math.sin(t * 1.4));
          for (let i = 0; i < pos.count; i++) {
            const x0 = data.base[i * 3]!;
            const y0 = data.base[i * 3 + 1]!;
            // Cantilever-like deflection increasing with x
            const xi = (x0 + 1.7) / 3.4;
            const defl = amp * xi * xi * (1 + 0.15 * Math.sin(y0 * 3 + t));
            pos.setXYZ(i, x0, y0 + defl * 0.15, defl);
          }
          pos.needsUpdate = true;
          data.geo.computeVertexNormals();

          // Refresh wireframe to match deformed solid
          data.wire.geometry.dispose();
          data.wire.geometry = new THREE.WireframeGeometry(data.geo);

          camera.position.x = 2.6 * Math.cos(t * 0.12);
          camera.position.z = 3.2 + Math.sin(t * 0.12) * 1.2;
          camera.lookAt(0, 0.1, 0);
        },
      }),
  },
  compute: {
    label: "1D bar element stretch",
    description:
      "Two-node linear bar elements: fix the left end, load the right end, solve for nodal displacements.",
    params: [
      { id: "E", label: "Young’s modulus E (GPa)", type: "number", default: 200, min: 10, max: 400, step: 10 },
      { id: "A", label: "Area A (mm²)", type: "number", default: 100, min: 10, max: 1000, step: 10 },
      { id: "L", label: "Length L (mm)", type: "number", default: 500, min: 50, max: 2000, step: 50 },
      { id: "F", label: "Axial force F (kN)", type: "number", default: 10, min: 0.1, max: 100, step: 0.5 },
      { id: "nElem", label: "Elements", type: "number", default: 4, min: 1, max: 20, step: 1 },
    ],
    run: async (values, ctx) => {
      const E = Number(values.E) * 1e3;
      const A = Number(values.A);
      const L = Number(values.L);
      const F = Number(values.F) * 1e3;
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

      const nFree = nNode - 1;
      const Kf = Array.from({ length: nFree }, (_, r) =>
        Array.from({ length: nFree }, (_, c) => K[r + 1]![c + 1]!),
      );
      const bf = Array(nFree).fill(0);
      bf[nFree - 1] = F;

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
        summary: `Tip displacement ≈ ${u[u.length - 1]!.toFixed(6)} mm (analytic FL/EA = ${uTipAnalytic.toFixed(6)} mm).`,
        series,
        table: {
          headers: ["node", "x (mm)", "u (mm)"],
          rows: u.map((ui, i) => [i, ((i * L) / nElem).toFixed(2), ui.toFixed(6)]),
        },
      };
    },
  },
};
