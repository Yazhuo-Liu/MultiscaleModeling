import { useEffect, useRef, useState, useTransition } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createRenderHost } from "@/core/render/createRenderHost";
import {
  ORBITALS,
  type OrbitalId,
  LOBE_NEG,
  LOBE_POS,
  buildOrbitalSurfaces,
  lobeMaterial,
} from "./orbitals";

export function OrbitalView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orbital, setOrbital] = useState<OrbitalId>("2pz");
  const [pending, startTransition] = useTransition();

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
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0xf4f6f8, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf4f6f8, 8, 18);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      36,
      ctx.width / Math.max(ctx.height, 1),
      0.05,
      100,
    );
    camera.position.set(3.6, 2.0, 4.8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(5, 8, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb8d4ff, 0.55);
    rim.position.set(-5, 2, -3);
    scene.add(rim);
    const bounce = new THREE.DirectionalLight(0xfff0e8, 0.35);
    bounce.position.set(0, -4, 2);
    scene.add(bounce);

    // Soft ground disc for depth (not a “card”)
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 64),
      new THREE.MeshStandardMaterial({
        color: 0xe8ecf0,
        roughness: 1,
        metalness: 0,
        transparent: true,
        opacity: 0.65,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.55;
    scene.add(ground);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 48, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x2a2e33,
        roughness: 0.25,
        metalness: 0.85,
        clearcoat: 0.6,
        envMapIntensity: 1,
      }),
    );
    scene.add(nucleus);

    const surfaces = buildOrbitalSurfaces(orbital, 88);
    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    root.scale.setScalar(surfaces.displayScale);

    const posMat = lobeMaterial(LOBE_POS, env);
    const negMat = lobeMaterial(LOBE_NEG, env);
    const posMesh = new THREE.Mesh(surfaces.positive, posMat);
    const negMesh = new THREE.Mesh(surfaces.negative, negMat);
    // Render translucent back faces first for nicer glass
    posMesh.renderOrder = 1;
    negMesh.renderOrder = 1;
    root.add(posMesh, negMesh);
    scene.add(root);

    let frameId = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      root.rotation.z = t * 0.22;
      const az = t * 0.11;
      camera.position.x = 5.0 * Math.cos(az);
      camera.position.z = 5.0 * Math.sin(az);
      camera.position.y = 1.85 + Math.sin(t * 0.17) * 0.35;
      camera.lookAt(0, -0.05, 0);
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
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      env.dispose();
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
            onClick={() => startTransition(() => setOrbital(o.id))}
          >
            {o.label}
          </button>
        ))}
        {pending ? <span className="orbital-busy">Building surface…</span> : null}
      </div>
      <div className="render-stage orbital-stage">
        <canvas
          ref={canvasRef}
          className="render-canvas"
          aria-label="Atomic orbital isosurface"
        />
      </div>
      <p className="orbital-caption">
        Smooth marching-cubes isosurfaces of constant |ψ|.{" "}
        <span className="phase pos">Coral</span> = ψ &gt; 0,{" "}
        <span className="phase neg">blue</span> = ψ &lt; 0.
      </p>
    </div>
  );
}
