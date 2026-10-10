import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sampleOrbital, orbitalDisplayScale } from "@/modules/dft/orbitals";

/** Compact 2p_z preview for the home hero — real orbital shape, not decoration. */
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
    camera.position.set(2.8, 1.8, 3.6);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(3, 5, 2);
    scene.add(key);

    const cloud = sampleOrbital("2pz", 9000, 7);
    const scale = orbitalDisplayScale("2pz") * 1.15;
    const colors = new Float32Array(cloud.count * 3);
    const pos = new THREE.Color(0xc23b22);
    const neg = new THREE.Color(0x1f5fbf);
    for (let i = 0; i < cloud.count; i++) {
      const c = cloud.phases[i]! >= 0 ? pos : neg;
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
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    points.rotation.x = -Math.PI / 2;
    scene.add(points);

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
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
      points.rotation.z = t * 0.25;
      camera.position.x = 3.2 * Math.cos(t * 0.15);
      camera.position.z = 3.2 * Math.sin(t * 0.15);
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
      geo.dispose();
      (points.material as THREE.Material).dispose();
      nucleus.geometry.dispose();
      (nucleus.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
