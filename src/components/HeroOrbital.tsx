import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildOrbitalSurfaces, lobeMaterial } from "@/modules/dft/orbitals";

/** Compact 2p_z isosurface preview for the home hero. */
export function HeroOrbital() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xeef2f4, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(2.8, 1.6, 3.4);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b8c0, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(3, 5, 2);
    scene.add(key);

    const surfaces = buildOrbitalSurfaces("2pz", 4);
    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    root.scale.setScalar(surfaces.displayScale * 1.05);

    const posMat = lobeMaterial(0xc23b22, 0.58);
    const negMat = lobeMaterial(0x1f5fbf, 0.58);
    root.add(
      new THREE.Mesh(surfaces.positive, posMat),
      new THREE.Mesh(surfaces.negative, negMat),
    );
    scene.add(root);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 }),
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
      root.rotation.z = t * 0.3;
      camera.position.x = 3.1 * Math.cos(t * 0.16);
      camera.position.z = 3.1 * Math.sin(t * 0.16);
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
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
