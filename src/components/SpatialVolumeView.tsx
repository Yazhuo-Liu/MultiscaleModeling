import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useLanguage } from "../i18n";
import type { SimulationFrame } from "../types";
import { extractIsosurface } from "../visualization/isosurface";

function colors(element: Element) {
  const css = getComputedStyle(element);
  const read = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  return {
    positive: read("--spatial-positive", "#4f958c"),
    negative: read("--spatial-negative", "#ba879c"),
    background: read("--spatial-background", "#f6f9fa"),
    line: read("--spatial-line", "#9eb9b5"),
    ink: read("--spatial-ink", "#536c74"),
  };
}

function dispose(object: THREE.Object3D) {
  object.traverse((child) => {
    if (
      child instanceof THREE.Mesh ||
      child instanceof THREE.Line ||
      child instanceof THREE.Sprite
    ) {
      if ("geometry" in child) child.geometry.dispose();
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      for (const material of materials) {
        (material as THREE.MeshBasicMaterial).map?.dispose();
        material.dispose();
      }
    }
  });
}

interface SceneState {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  particles: THREE.InstancedMesh | null;
  surface: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null;
  slice: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null;
  render: () => void;
}

/** Render the model's physical xyz data, rather than a raised 2D field. */
export default function SpatialVolumeView({
  frame,
  sliceIndex,
  showSlice,
  active,
  onError,
}: {
  frame: SimulationFrame;
  sliceIndex: number;
  showSlice: boolean;
  active: boolean;
  onError: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const { t, locale } = useLanguage();

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      onError();
      return;
    }
    const palette = colors(element);
    renderer.setClearColor(palette.background);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.localClippingEnabled = true;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.up.set(0, 0, 1);
    camera.position.set(8, -10, 8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.minDistance = 5;
    controls.maxDistance = 28;
    controls.enablePan = false;
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const light = new THREE.DirectionalLight(0xffffff, 2.4);
    light.position.set(4, -5, 8);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffffff, 1.2);
    fill.position.set(-5, 3, 2);
    scene.add(fill);
    const cube = new THREE.BoxGeometry(5, 5, 5);
    const box = new THREE.LineSegments(
      new THREE.EdgesGeometry(cube),
      new THREE.LineBasicMaterial({ color: palette.line }),
    );
    cube.dispose();
    scene.add(box);
    for (let axis = 0; axis < 3; axis++) {
      const start = new THREE.Vector3(-2.75, -2.75, -2.75);
      const end = start.clone();
      end.setComponent(axis, 3.05);
      scene.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([start, end]),
          new THREE.LineBasicMaterial({ color: palette.line }),
        ),
      );
      const label = document.createElement("canvas");
      label.width = 64;
      label.height = 64;
      const ctx = label.getContext("2d");
      if (ctx) {
        ctx.fillStyle = palette.ink;
        ctx.font = "36px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("xyz"[axis], 32, 43);
      }
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(label),
          depthTest: false,
          transparent: true,
        }),
      );
      sprite.position.copy(end);
      sprite.position.setComponent(axis, 3.3);
      sprite.scale.set(0.35, 0.35, 0.35);
      scene.add(sprite);
    }
    let request = 0;
    let disposed = false;
    const render = () => {
      if (disposed || request || !activeRef.current || document.hidden) return;
      request = requestAnimationFrame(() => {
        request = 0;
        if (disposed || !activeRef.current || document.hidden) return;
        renderer.render(scene, camera);
        element.dataset.camera = JSON.stringify({
          position: camera.position.toArray(),
          quaternion: camera.quaternion.toArray(),
          target: controls.target.toArray(),
        });
      });
    };
    state.current = {
      scene,
      renderer,
      camera,
      controls,
      particles: null,
      surface: null,
      slice: null,
      render,
    };
    controls.addEventListener("change", render);
    const resize = () => {
      const width = Math.max(element.clientWidth, 180);
      const height = Math.max(element.clientHeight, 240);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const contextLost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", render);
    const keys = (event: KeyboardEvent) => {
      if (!/^Arrow|^[+\-=rR]$/.test(event.key)) return;
      event.preventDefault();
      if (event.key.toLowerCase() === "r") camera.position.set(8, -10, 8);
      else if (["+", "=", "-"].includes(event.key))
        camera.position.setLength(
          Math.max(
            5,
            Math.min(
              28,
              camera.position.length() * (event.key === "-" ? 1.12 : 1 / 1.12),
            ),
          ),
        );
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight")
        camera.position.applyAxisAngle(
          camera.up,
          event.key === "ArrowLeft" ? 0.14 : -0.14,
        );
      else {
        const axis = camera.position.clone().cross(camera.up).normalize();
        camera.position.applyAxisAngle(
          axis,
          event.key === "ArrowUp" ? 0.12 : -0.12,
        );
      }
      controls.update();
      render();
    };
    element.addEventListener("keydown", keys);
    resize();
    controls.update();
    return () => {
      disposed = true;
      cancelAnimationFrame(request);
      observer.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      element.removeEventListener("keydown", keys);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", render);
      dispose(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      state.current = null;
    };
  }, [onError]);

  useEffect(() => {
    state.current?.renderer.domElement.setAttribute(
      "aria-label",
      t(
        "三维空间模型：拖动旋转，滚轮缩放",
        "Three-dimensional spatial model: drag to rotate, scroll to zoom",
      ),
    );
  }, [locale, onError]);

  useEffect(() => {
    const current = state.current;
    const element = host.current;
    if (!current || !element) return;
    const palette = colors(element);
    element.dataset.frameTime = String(frame.time);
    if (frame.volume) {
      const volume = frame.volume;
      const mesh = extractIsosurface(
        {
          size: volume.width,
          extent: (2.5 * (volume.width - 1)) / volume.width,
          values: Float32Array.from(volume.values),
        },
        0,
      );
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(mesh.positions, 3),
      );
      geometry.setAttribute(
        "normal",
        new THREE.BufferAttribute(mesh.normals, 3),
      );
      if (current.surface) {
        current.surface.geometry.dispose();
        current.surface.geometry = geometry;
      } else {
        current.surface = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            color: palette.positive,
            side: THREE.DoubleSide,
            roughness: 0.55,
            metalness: 0.05,
          }),
        );
        current.scene.add(current.surface);
      }
      element.dataset.spatialKind = "volume";
      element.dataset.volumeSize = `${volume.width},${volume.height},${volume.depth}`;
      element.dataset.isosurfaceVertices = String(mesh.positions.length / 3);
    } else if (frame.points && frame.box) {
      if (!current.particles) {
        current.particles = new THREE.InstancedMesh(
          new THREE.SphereGeometry(1, 16, 12),
          new THREE.MeshStandardMaterial({
            color: palette.positive,
            roughness: 0.3,
            metalness: 0.08,
          }),
          frame.points.length,
        );
        current.particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        current.scene.add(current.particles);
      }
      const dummy = new THREE.Object3D();
      const scale = 5 / frame.box;
      for (let i = 0; i < frame.points.length; i++) {
        const p = frame.points[i];
        dummy.position.set(p.x * scale, p.y * scale, p.z * scale);
        dummy.scale.setScalar((p.radius ?? 0.23) * scale);
        dummy.updateMatrix();
        current.particles.setMatrixAt(i, dummy.matrix);
      }
      current.particles.instanceMatrix.needsUpdate = true;
      current.particles.computeBoundingSphere();
      element.dataset.spatialKind = "particles";
      element.dataset.zSpread = String(
        Math.max(...frame.points.map((p) => p.z)) -
          Math.min(...frame.points.map((p) => p.z)),
      );
      element.dataset.particleCount = String(frame.points.length);
    }
    current.render();
  }, [frame]);

  useEffect(() => {
    const current = state.current;
    const volume = frame.volume;
    const element = host.current;
    if (!current || !volume || !element) return;
    const palette = colors(element);
    const positive = new THREE.Color(palette.positive);
    const negative = new THREE.Color(palette.negative);
    const mid = new THREE.Color(palette.background);
    const color = new THREE.Color();
    const rgb = new THREE.Color();
    const index = Math.max(0, Math.min(volume.depth - 1, sliceIndex));
    const pixels = new Uint8Array(volume.width * volume.height * 4);
    let checksum = 0;
    for (let i = 0; i < volume.width * volume.height; i++) {
      const value = volume.values[i + volume.width * volume.height * index];
      checksum += value * (i + 1);
      color
        .copy(mid)
        .lerp(value >= 0 ? positive : negative, Math.min(1, Math.abs(value)));
      color.getRGB(rgb, THREE.SRGBColorSpace);
      pixels[4 * i] = Math.round(rgb.r * 255);
      pixels[4 * i + 1] = Math.round(rgb.g * 255);
      pixels[4 * i + 2] = Math.round(rgb.b * 255);
      pixels[4 * i + 3] = 255;
    }
    const texture = new THREE.DataTexture(
      pixels,
      volume.width,
      volume.height,
      THREE.RGBAFormat,
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    if (!current.slice) {
      current.slice = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture }),
      );
      current.scene.add(current.slice);
    } else {
      current.slice.material.map?.dispose();
      current.slice.material.map = texture;
      current.slice.material.needsUpdate = true;
    }
    const z = ((index + 0.5) / volume.depth) * 5 - 2.5;
    current.slice.position.z = z;
    current.slice.visible = showSlice;
    // Keep the upper volume above the section, visible from the default +z view.
    // The uncut interface is the default; an opaque section must not hide it.
    if (current.surface) {
      const planes = current.surface.material.clippingPlanes;
      if (!showSlice) {
        if (planes?.length) {
          current.surface.material.clippingPlanes = [];
          current.surface.material.needsUpdate = true;
        }
      } else if (planes?.length) planes[0].constant = -z;
      else {
        current.surface.material.clippingPlanes = [
          new THREE.Plane(new THREE.Vector3(0, 0, 1), -z),
        ];
        current.surface.material.needsUpdate = true;
      }
    }
    element.dataset.sliceIndex = String(index);
    element.dataset.sliceChecksum = String(checksum);
    current.render();
  }, [frame, sliceIndex, showSlice]);

  useEffect(() => state.current?.render(), [active, locale]);
  return (
    <div
      ref={host}
      className="lab-spatial"
      data-show-slice={showSlice}
      tabIndex={0}
      role="img"
      aria-label={t(
        "三维空间模型：拖动旋转，滚轮缩放；方向键旋转，加减键缩放，R复位",
        "Three-dimensional spatial model: drag to rotate, scroll to zoom; arrows rotate, plus/minus zoom, R resets",
      )}
    />
  );
}
