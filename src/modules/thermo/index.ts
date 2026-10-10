import type { ModelingModule } from "@/core/types";
import { mountSimpleScene, physicalMat } from "@/core/render/simpleScene";
import { forEachChunked } from "@/core/compute/runSafely";
import * as THREE from "three";

/** Materials thermodynamics — phase equilibria & free energy toys. */
export const thermoModule: ModelingModule = {
  id: "thermo",
  title: "Thermodynamics",
  summary:
    "Phase equilibria, free energy, and phase diagrams—the thermodynamic language linking atoms to processing.",
  scale: "cross-scale",
  accent: "#6b4f3a",
  tags: ["free energy", "phase diagram", "CALPHAD"],
  intro: {
    lead: "Materials thermodynamics describes phase equilibria via free-energy minimization—a backbone that bridges scales.",
    sections: [
      {
        heading: "From first principles to phase diagrams",
        body: "DFT total energies, phonons, and cluster expansions can parameterize free energies. CALPHAD interpolates assessed databases across composition–temperature space for alloy design.",
      },
      {
        heading: "This demo",
        body: "A regular-solution binary miscibility gap illustrates how the interaction parameter sets a critical temperature.",
      },
    ],
    references: [
      { label: "DeHoff, Thermodynamics in Materials Science" },
      { label: "Saunders & Miodownik, CALPHAD" },
    ],
  },
  render: {
    label: "Free-energy surface",
    mount: (ctx) =>
      mountSimpleScene(ctx, {
        background: 0xf3eee8,
        fog: 0xf3eee8,
        contactShadow: true,
        cameraPosition: [3.2, 2.6, 3.8],
        lookAt: [0, 0.2, 0],
        setup: (scene) => {
          const seg = 48;
          const geo = new THREE.PlaneGeometry(3.4, 3.4, seg, seg);
          const pos = geo.attributes.position!;
          const colors = new Float32Array(pos.count * 3);
          const cLow = new THREE.Color(0xc4a574);
          const cHigh = new THREE.Color(0x6b4f3a);
          const cMid = new THREE.Color(0x1f6f78);

          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const nx = x / 1.7;
            const ny = y / 1.7;
            // Toy free-energy landscape with two basins
            const z =
              0.55 * (nx * nx - 0.6) ** 2 +
              0.35 * (ny * ny - 0.45) ** 2 +
              0.12 * Math.sin(nx * 3) * Math.cos(ny * 3) -
              0.15;
            pos.setZ(i, z);
            const t = THREE.MathUtils.clamp((z + 0.2) / 0.9, 0, 1);
            const col =
              t < 0.5
                ? cLow.clone().lerp(cMid, t * 2)
                : cMid.clone().lerp(cHigh, (t - 0.5) * 2);
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
          }
          geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          geo.computeVertexNormals();

          const mesh = new THREE.Mesh(
            geo,
            new THREE.MeshPhysicalMaterial({
              vertexColors: true,
              roughness: 0.45,
              metalness: 0.08,
              clearcoat: 0.35,
              side: THREE.DoubleSide,
            }),
          );
          mesh.rotation.x = -Math.PI / 2.35;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);

          // Wire overlay for “mesh” feel without heavy cards
          const wire = new THREE.LineSegments(
            new THREE.WireframeGeometry(geo),
            new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.12,
            }),
          );
          wire.rotation.copy(mesh.rotation);
          scene.add(wire);

          const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 20, 20),
            physicalMat(0xc45c26, { emissive: 0x401808, emissiveIntensity: 0.25 }),
          );
          marker.castShadow = true;
          scene.add(marker);

          scene.userData.thermo = { mesh, wire, marker, geo };

          return () => {
            geo.dispose();
            (mesh.material as THREE.Material).dispose();
            wire.geometry.dispose();
            (wire.material as THREE.Material).dispose();
            marker.geometry.dispose();
            (marker.material as THREE.Material).dispose();
          };
        },
        onFrame: (scene, t, camera) => {
          const data = scene.userData.thermo as
            | {
                mesh: THREE.Mesh;
                wire: THREE.LineSegments;
                marker: THREE.Mesh;
              }
            | undefined;
          if (!data) return;
          data.mesh.rotation.z = t * 0.18;
          data.wire.rotation.z = data.mesh.rotation.z;
          const u = (Math.sin(t * 0.7) + 1) / 2;
          const v = (Math.cos(t * 0.55) + 1) / 2;
          const x = (u - 0.5) * 2.8;
          const z = (v - 0.5) * 2.8;
          const y =
            0.55 * ((x / 1.7) ** 2 - 0.6) ** 2 +
            0.35 * ((z / 1.7) ** 2 - 0.45) ** 2 -
            0.05;
          // Marker in world space roughly on the tilted plane
          data.marker.position.set(x * 0.85, y + 0.15, z * 0.85);
          camera.position.x = 3.2 * Math.cos(t * 0.1);
          camera.position.z = 3.8 * Math.sin(t * 0.1) + 1.5;
          camera.lookAt(0, 0.2, 0);
        },
      }),
  },
  compute: {
    label: "Regular-solution miscibility gap",
    description:
      "Binary regular solution G_mix = Ω x(1−x) + RT[x ln x + (1−x) ln(1−x)]. Scan T against the critical temperature.",
    params: [
      { id: "omega", label: "Ω (J/mol)", type: "number", default: 16000, min: 5000, max: 40000, step: 500 },
      { id: "T", label: "Temperature T (K)", type: "number", default: 800, min: 300, max: 2000, step: 50 },
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
        summary: `T = ${T} K; regular-solution Tc ≈ ${Tc.toFixed(1)} K (miscibility gap when T < Tc).`,
        series,
      };
    },
  },
};
