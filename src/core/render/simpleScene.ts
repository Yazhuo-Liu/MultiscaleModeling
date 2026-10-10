import * as THREE from "three";
import type { RenderContext } from "../types";

export interface SimpleSceneOptions {
  background?: number;
  /** Soft ground fog color; omit to disable. */
  fog?: number | null;
  cameraZ?: number;
  cameraPosition?: [number, number, number];
  lookAt?: [number, number, number];
  /** Enable a soft contact shadow plane. */
  contactShadow?: boolean;
  /** Called each frame with elapsed seconds. */
  onFrame?: (
    scene: THREE.Scene,
    t: number,
    camera: THREE.PerspectiveCamera,
  ) => void;
  /** Optional setup after scene/camera/renderer exist. */
  setup?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ) => void | (() => void);
}

/**
 * Higher-quality Three.js bootstrap for educational demos:
 * ACES tone mapping, physically based lights, optional fog & contact shadow.
 */
export function mountSimpleScene(
  ctx: RenderContext,
  options: SimpleSceneOptions = {},
): () => void {
  const renderer = new THREE.WebGLRenderer({
    canvas: ctx.canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(ctx.width, ctx.height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = Boolean(options.contactShadow);
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const bg = options.background ?? 0xe8f1f0;
  renderer.setClearColor(bg, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  if (options.fog !== null) {
    const fogColor = options.fog ?? bg;
    scene.fog = new THREE.FogExp2(fogColor, 0.045);
  }

  const camera = new THREE.PerspectiveCamera(
    42,
    ctx.width / Math.max(ctx.height, 1),
    0.1,
    100,
  );
  if (options.cameraPosition) {
    camera.position.set(...options.cameraPosition);
  } else {
    camera.position.set(0.35, 0.55, options.cameraZ ?? 4.2);
  }
  const look = options.lookAt ?? [0, 0, 0];
  camera.lookAt(...look);

  const hemi = new THREE.HemisphereLight(0xf2f7f6, 0x8aa39a, 0.85);
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(3.2, 5.5, 4.2);
  key.castShadow = Boolean(options.contactShadow);
  if (key.castShadow) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 20;
    key.shadow.radius = 3;
  }
  const fill = new THREE.DirectionalLight(0xb8d4e0, 0.45);
  fill.position.set(-3.5, 1.5, -2);
  const rim = new THREE.DirectionalLight(0xffe0c8, 0.35);
  rim.position.set(-1.5, 2.5, 4);
  scene.add(hemi, key, fill, rim);

  if (options.contactShadow) {
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.5, 64),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.35;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  const extraDispose = options.setup?.(scene, camera, renderer);

  let frameId = 0;
  const t0 = performance.now();

  const tick = (now: number) => {
    const t = (now - t0) / 1000;
    options.onFrame?.(scene, t, camera);
    renderer.render(scene, camera);
    frameId = ctx.requestFrame(tick);
  };
  frameId = ctx.requestFrame(tick);

  const onResize = () => {
    renderer.setSize(ctx.width, ctx.height, false);
    camera.aspect = ctx.width / Math.max(ctx.height, 1);
    camera.updateProjectionMatrix();
  };
  onResize();

  return () => {
    ctx.cancelFrame(frameId);
    if (typeof extraDispose === "function") extraDispose();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
    renderer.dispose();
  };
}

/** Shared physical material helper for polished demos. */
export function physicalMat(
  color: number,
  extras: THREE.MeshPhysicalMaterialParameters = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    ...extras,
  });
}
