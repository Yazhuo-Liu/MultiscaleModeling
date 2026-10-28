import { useEffect, useRef, useState } from "react";
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
    reference: read("--spatial-reference", "#b18b5c"),
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
  startingSites: THREE.InstancedMesh | null;
  offsets: THREE.LineSegments | null;
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
  resetToken = 0,
}: {
  frame: SimulationFrame;
  sliceIndex: number;
  showSlice: boolean;
  active: boolean;
  onError: () => void;
  resetToken?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const { t, locale } = useLanguage();
  const [compareStart, setCompareStart] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const reference = useRef<{
    token: number;
    box: number | undefined;
    time: number;
    energy: number;
    points: [number, number, number][];
  } | null>(null);
  // Reference positions belong to the current view; resetting a model captures
  // its new initial state. Switching language does not replace this reference.
  if (
    !reference.current ||
    frame.time === 0 ||
    reference.current.token !== resetToken ||
    reference.current.box !== frame.box ||
    frame.time < reference.current.time ||
    reference.current.points.length !== (frame.points?.length ?? 0)
  ) {
    reference.current = {
      token: resetToken,
      box: frame.box,
      time: frame.time,
      energy: frame.metrics[0]?.value ?? 0,
      points: frame.points?.map((p) => [p.x, p.y, p.z]) ?? [],
    };
  }
  const first = reference.current;
  const offsets =
    frame.points?.map((p, i) =>
      [p.x, p.y, p.z].map((value, axis) => {
        const delta = value - first.points[i][axis];
        return frame.box
          ? delta - frame.box * Math.round(delta / frame.box)
          : delta;
      }),
    ) ?? [];
  const rmsOffset = Math.sqrt(
    offsets.reduce(
      (sum, delta) =>
        sum + delta.reduce((total, value) => total + value * value, 0),
      0,
    ) / Math.max(1, offsets.length),
  );
  const energyRemaining =
    first.energy > 0
      ? (100 * (frame.metrics[0]?.value ?? 0)) / first.energy
      : 100;
  const positiveFraction = frame.volume
    ? frame.volume.values.reduce((n, value) => n + Number(value > 0), 0) /
      frame.volume.values.length
    : 0;
  useEffect(() => {
    setCompareStart(false);
    setWireframe(false);
  }, [resetToken]);

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
      startingSites: null,
      offsets: null,
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
      if (event.target !== element && event.target !== renderer.domElement)
        return;
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
      if (!current.startingSites) {
        current.startingSites = new THREE.InstancedMesh(
          new THREE.SphereGeometry(1, 12, 8),
          new THREE.MeshBasicMaterial({
            color: palette.reference,
            wireframe: true,
            transparent: true,
            opacity: 0.38,
          }),
          frame.points.length,
        );
        current.scene.add(current.startingSites);
        current.offsets = new THREE.LineSegments(
          new THREE.BufferGeometry(),
          new THREE.LineBasicMaterial({
            color: palette.reference,
            transparent: true,
            opacity: 0.75,
          }),
        );
        current.scene.add(current.offsets);
      }
      const lines: number[] = [];
      const half = frame.box / 2;
      for (let i = 0; i < frame.points.length; i++) {
        const start = first.points[i];
        dummy.position.set(
          start[0] * scale,
          start[1] * scale,
          start[2] * scale,
        );
        dummy.scale.setScalar((frame.points[i].radius ?? 0.23) * scale);
        dummy.updateMatrix();
        current.startingSites.setMatrixAt(i, dummy.matrix);
        const delta = offsets[i];
        // Split a minimum-image connection where it crosses a periodic face,
        // rather than drawing a spurious line through the whole simulation box.
        const cuts = [0, 1];
        for (let axis = 0; axis < 3; axis++) {
          const end = start[axis] + delta[axis];
          if (end > half || end < -half) {
            const edge = end > half ? half : -half;
            cuts.push((edge - start[axis]) / delta[axis]);
          }
        }
        cuts.sort((a, b) => a - b);
        for (let segment = 1; segment < cuts.length; segment++) {
          const a = cuts[segment - 1],
            b = cuts[segment];
          if (b - a < 1e-9) continue;
          const middle = (a + b) / 2;
          const shift = start.map(
            (value, axis) =>
              frame.box! *
              Math.floor((value + delta[axis] * middle + half) / frame.box!),
          );
          for (const fraction of [a, b])
            for (let axis = 0; axis < 3; axis++)
              lines.push(
                (start[axis] + delta[axis] * fraction - shift[axis]) * scale,
              );
        }
      }
      current.startingSites.instanceMatrix.needsUpdate = true;
      current.startingSites.computeBoundingSphere();
      current.startingSites.visible = compareStart;
      if (current.offsets) {
        current.offsets.geometry.dispose();
        current.offsets.geometry = new THREE.BufferGeometry();
        current.offsets.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(lines, 3),
        );
        current.offsets.visible = compareStart;
      }
      element.dataset.rmsOffset = String(rmsOffset);
      element.dataset.offsetSegments = String(lines.length / 6);
      element.dataset.spatialKind = "particles";
      element.dataset.zSpread = String(
        Math.max(...frame.points.map((p) => p.z)) -
          Math.min(...frame.points.map((p) => p.z)),
      );
      element.dataset.particleCount = String(frame.points.length);
    }
    current.render();
  }, [frame, resetToken]);

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

  useEffect(() => {
    const current = state.current;
    if (!current) return;
    if (current.startingSites) current.startingSites.visible = compareStart;
    if (current.offsets) current.offsets.visible = compareStart;
    if (current.surface) current.surface.material.wireframe = wireframe;
    current.render();
  }, [compareStart, wireframe, frame.volume !== undefined]);

  useEffect(() => state.current?.render(), [active, locale]);
  return (
    <div className="spatial-observation">
      <div className="spatial-observation-tools">
        {frame.volume ? (
          <div
            role="group"
            aria-label={t("观察相界", "Inspect the phase boundary")}
          >
            <button
              data-testid="spatial-surface"
              aria-pressed={!wireframe}
              onClick={() => setWireframe(false)}
            >
              {t("相界表面", "Surface")}
            </button>
            <button
              data-testid="spatial-wireframe"
              aria-pressed={wireframe}
              onClick={() => setWireframe(true)}
            >
              {t("查看曲面网格", "Surface mesh")}
            </button>
          </div>
        ) : (
          <label>
            <input
              data-testid="spatial-compare-start"
              type="checkbox"
              checked={compareStart}
              onChange={(event) => setCompareStart(event.target.checked)}
            />
            {t("和起始排列对比", "Compare with the starting arrangement")}
          </label>
        )}
      </div>
      <div
        ref={host}
        className="lab-spatial"
        data-show-slice={showSlice}
        data-compare-start={compareStart}
        data-wireframe={wireframe}
        data-energy-remaining={energyRemaining}
        data-positive-fraction={positiveFraction}
        data-testid={frame.volume ? "phenomenon-phase-field" : "phenomenon-md"}
        tabIndex={0}
        role="img"
        aria-label={t(
          "三维空间模型：拖动旋转，滚轮缩放；方向键旋转，加减键缩放，R复位",
          "Three-dimensional spatial model: drag to rotate, scroll to zoom; arrows rotate, plus/minus zoom, R resets",
        )}
      />
      <div className="spatial-observation-readout">
        {frame.volume ? (
          <>
            <span>
              {t("剩余自由能", "Free energy remaining")}{" "}
              <strong data-testid="spatial-energy-remaining">
                {energyRemaining.toFixed(1)}%
              </strong>
            </span>
            <span>
              {t("正相体积", "Positive-phase volume")}{" "}
              <strong>{(positiveFraction * 100).toFixed(1)}%</strong>
            </span>
            <small>
              {t(
                "看界面如何变光滑；相的体积分数可以改变。",
                "Watch the interface smooth out; phase volume fractions may change.",
              )}
            </small>
          </>
        ) : (
          <>
            <span>
              {t("整体偏离起点", "Overall offset from the start")}{" "}
              <strong data-testid="spatial-rms-offset">
                {rmsOffset.toFixed(3)} σ
              </strong>
            </span>
            <small>
              {compareStart
                ? t(
                    "细线球为起始位置，连线取穿过周期边界的最短距离。",
                    "Wire spheres mark starting sites; connectors use the shortest distance across periodic boundaries.",
                  )
                : t(
                    "观察原子离开起始位置，看看整个排列怎样变化。",
                    "Watch atoms leave their starting sites and the whole arrangement change.",
                  )}
            </small>
          </>
        )}
        <details>
          <summary>{t("读数说明", "About these readings")}</summary>
          <p>
            {frame.volume
              ? t(
                  "自由能以本次进入三维视图或重置时的值为100%；正相表示序参量大于零的体网格。曲面网格是显示用的三角形，不是额外的计算模型。",
                  "Free energy is relative to its value when this 3D view opens or the model resets. Positive phase means volume cells with an order parameter above zero. The surface mesh is a rendering triangulation, not another simulation model.",
                )
              : t(
                  "偏离量是所有原子相对本次视图起点的最短周期距离的均方根，单位为原子长度σ。它不累计跨边界的行程，也不用于求扩散系数。",
                  "The offset is the root-mean-square minimum-image distance from each atom's position when this view opens, in atomic length units σ. It does not accumulate travel across the boundaries or determine a diffusion coefficient.",
                )}
          </p>
        </details>
      </div>
    </div>
  );
}
