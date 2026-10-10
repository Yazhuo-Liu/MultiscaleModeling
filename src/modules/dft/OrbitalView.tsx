import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createRenderHost } from "@/core/render/createRenderHost";
import {
  ORBITALS,
  type OrbitalId,
  buildOrbitalSurfaces,
  lobeMaterial,
} from "./orbitals";

const POS = 0xc23b22;
const NEG = 0x1f5fbf;

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
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0xeef2f4, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      ctx.width / Math.max(ctx.height, 1),
      0.1,
      100,
    );
    camera.position.set(3.4, 2.2, 4.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b8c0, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(4, 7, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0e4ff, 0.4);
    fill.position.set(-4, 1, -2);
    scene.add(fill);

    const axes = new THREE.Group();
    const axis = (to: THREE.Vector3, color: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        to,
      ]);
      return new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 }),
      );
    };
    axes.add(axis(new THREE.Vector3(2.1, 0, 0), 0xb85c38));
    axes.add(axis(new THREE.Vector3(0, 2.1, 0), 0x2f6b4f));
    axes.add(axis(new THREE.Vector3(0, 0, 2.1), 0x2f5f8f));
    scene.add(axes);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 28, 28),
      new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.35,
        metalness: 0.45,
      }),
    );
    scene.add(nucleus);

    const surfaces = buildOrbitalSurfaces(orbital, 5);
    const root = new THREE.Group();
    // Map orbital z → scene y (chemistry convention)
    root.rotation.x = -Math.PI / 2;
    root.scale.setScalar(surfaces.displayScale);

    const posMat = lobeMaterial(POS, 0.56);
    const negMat = lobeMaterial(NEG, 0.56);
    const posMesh = new THREE.Mesh(surfaces.positive, posMat);
    const negMesh = new THREE.Mesh(surfaces.negative, negMat);
    root.add(posMesh, negMesh);
    scene.add(root);

    let frameId = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      root.rotation.z = t * 0.28;
      camera.position.x = 4.3 * Math.cos(t * 0.14);
      camera.position.z = 4.3 * Math.sin(t * 0.14);
      camera.position.y = 2.0 + Math.sin(t * 0.22) * 0.3;
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
      surfaces.positive.dispose();
      surfaces.negative.dispose();
      posMat.dispose();
      negMat.dispose();
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
        <canvas ref={canvasRef} className="render-canvas" aria-label="Atomic orbital isosurface" />
      </div>
      <p className="orbital-caption">
        Translucent isosurfaces of constant |ψ| (hydrogenic).{" "}
        <span className="phase pos">Red</span> = ψ &gt; 0 lobe,{" "}
        <span className="phase neg">blue</span> = ψ &lt; 0 lobe — the usual
        textbook orbital shells (1s sphere, 2p dumbbells, 3d clover / d<sub>z²</sub>).
      </p>
    </div>
  );
}
