import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createRenderHost } from "@/core/render/createRenderHost";
import {
  ORBITALS,
  type OrbitalId,
  orbitalDisplayScale,
  sampleOrbital,
} from "./orbitals";

const POS_COLOR = new THREE.Color(0xc23b22); // positive lobe
const NEG_COLOR = new THREE.Color(0x1f5fbf); // negative lobe

export function OrbitalView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orbital, setOrbital] = useState<OrbitalId>("2pz");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const host = createRenderHost(canvas);
    const { ctx } = host;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(ctx.width, ctx.height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0xeef2f4, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeef2f4, 0.035);

    const camera = new THREE.PerspectiveCamera(
      40,
      ctx.width / Math.max(ctx.height, 1),
      0.1,
      100,
    );
    camera.position.set(3.2, 2.4, 4.6);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 6, 3);
    scene.add(key);

    // Subtle axis guide (z vertical for chemistry convention in view)
    const axes = new THREE.Group();
    const axisMat = (c: number) =>
      new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.35 });
    const mkAxis = (to: THREE.Vector3, color: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        to,
      ]);
      return new THREE.Line(geo, axisMat(color));
    };
    axes.add(mkAxis(new THREE.Vector3(2.2, 0, 0), 0xb85c38));
    axes.add(mkAxis(new THREE.Vector3(0, 2.2, 0), 0x2f6b4f));
    axes.add(mkAxis(new THREE.Vector3(0, 0, 2.2), 0x2f5f8f));
    scene.add(axes);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.35,
        metalness: 0.4,
      }),
    );
    scene.add(nucleus);

    const cloud = sampleOrbital(orbital, 14000, 42);
    const scale = orbitalDisplayScale(orbital);
    const colors = new Float32Array(cloud.count * 3);
    for (let i = 0; i < cloud.count; i++) {
      const c = cloud.phases[i]! >= 0 ? POS_COLOR : NEG_COLOR;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      cloud.positions[i * 3]! *= scale;
      cloud.positions[i * 3 + 1]! *= scale;
      cloud.positions[i * 3 + 2]! *= scale;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(cloud.positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    // Chemistry: z up in orbital plots — map orbital z → scene y
    points.rotation.x = -Math.PI / 2;
    scene.add(points);

    let frameId = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      points.rotation.z = t * 0.22;
      camera.position.x = 4.2 * Math.cos(t * 0.12);
      camera.position.z = 4.2 * Math.sin(t * 0.12);
      camera.position.y = 2.1 + Math.sin(t * 0.2) * 0.25;
      camera.lookAt(0, 0.05, 0);
      renderer.render(scene, camera);
      frameId = ctx.requestFrame(tick);
    };
    frameId = ctx.requestFrame(tick);

    const onResize = () => {
      host.resize();
      renderer.setSize(ctx.width, ctx.height, false);
      camera.aspect = ctx.width / Math.max(ctx.height, 1);
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    if (canvas.parentElement) ro?.observe(canvas.parentElement);

    return () => {
      ctx.cancelFrame(frameId);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      geo.dispose();
      (points.material as THREE.Material).dispose();
      nucleus.geometry.dispose();
      (nucleus.material as THREE.Material).dispose();
      axes.traverse((o) => {
        const line = o as THREE.Line;
        line.geometry?.dispose();
        (line.material as THREE.Material | undefined)?.dispose();
      });
      renderer.dispose();
      host.destroy();
    };
  }, [orbital]);

  return (
    <div className="orbital-view">
      <div className="orbital-toolbar" role="toolbar" aria-label="Orbital selection">
        {ORBITALS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={orbital === o.id ? "active" : undefined}
            onClick={() => setOrbital(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="render-stage orbital-stage">
        <canvas ref={canvasRef} className="render-canvas" aria-label="Atomic orbital" />
      </div>
      <p className="orbital-caption">
        Hydrogen-like orbital probability density |ψ|² (rejection sampled).{" "}
        <span className="phase pos">Red</span> = ψ &gt; 0,{" "}
        <span className="phase neg">blue</span> = ψ &lt; 0. Shapes follow real
        spherical harmonics (1s sphere, 2p dumbbells, 3d clover / d<sub>z²</sub>).
      </p>
    </div>
  );
}
