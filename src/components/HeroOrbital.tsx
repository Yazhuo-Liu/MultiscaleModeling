import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  LOBE_NEG,
  LOBE_POS,
  buildOrbitalSurfaces,
  lobeMaterial,
} from "@/modules/dft/orbitals";

/** High-quality 2p_z isosurface for the home hero. */
export function HeroOrbital() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf4f6f8, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 50);
    camera.position.set(3.2, 1.6, 3.8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb8d4ff, 0.5);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const surfaces = buildOrbitalSurfaces("2pz", 72);
    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    root.scale.setScalar(surfaces.displayScale * 1.08);

    const posMat = lobeMaterial(LOBE_POS, env);
    const negMat = lobeMaterial(LOBE_NEG, env);
    root.add(
      new THREE.Mesh(surfaces.positive, posMat),
      new THREE.Mesh(surfaces.negative, negMat),
    );
    scene.add(root);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x2a2e33,
        roughness: 0.25,
        metalness: 0.85,
        clearcoat: 0.5,
      }),
    );
    scene.add(nucleus);

    const resize = () => {
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 320;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    let id = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      root.rotation.z = t * 0.24;
      camera.position.x = 3.6 * Math.cos(t * 0.13);
      camera.position.z = 3.6 * Math.sin(t * 0.13);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      surfaces.positive.dispose();
      surfaces.negative.dispose();
      posMat.dispose();
      negMat.dispose();
      nucleus.geometry.dispose();
      (nucleus.material as THREE.Material).dispose();
      env.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
