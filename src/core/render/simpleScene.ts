import * as THREE from "three";
import type { RenderContext } from "../types";

export interface SimpleSceneOptions {
  background?: number;
  cameraZ?: number;
  /** Called each frame with elapsed seconds. */
  onFrame?: (scene: THREE.Scene, t: number) => void;
  /** Optional setup after scene/camera/renderer exist. */
  setup?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ) => void | (() => void);
}

/**
 * Minimal Three.js bootstrap for educational demos.
 * Prefer this over raw WebGL unless you need custom shaders.
 */
export function mountSimpleScene(
  ctx: RenderContext,
  options: SimpleSceneOptions = {},
): () => void {
  const renderer = new THREE.WebGLRenderer({
    canvas: ctx.canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(ctx.width, ctx.height, false);
  renderer.setClearColor(options.background ?? 0x0b1220, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    ctx.width / Math.max(ctx.height, 1),
    0.1,
    100,
  );
  camera.position.z = options.cameraZ ?? 4;

  const ambient = new THREE.AmbientLight(0xb8c4d8, 0.55);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  scene.add(ambient, key);

  const extraDispose = options.setup?.(scene, camera, renderer);

  let frameId = 0;
  const t0 = performance.now();

  const tick = (now: number) => {
    const t = (now - t0) / 1000;
    options.onFrame?.(scene, t);
    renderer.render(scene, camera);
    frameId = ctx.requestFrame(tick);
  };
  frameId = ctx.requestFrame(tick);

  const onResize = () => {
    renderer.setSize(ctx.width, ctx.height, false);
    camera.aspect = ctx.width / Math.max(ctx.height, 1);
    camera.updateProjectionMatrix();
  };

  // Host calls resize on window events; re-sync once in case size changed.
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
