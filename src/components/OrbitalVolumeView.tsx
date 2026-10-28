import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useLanguage } from "../i18n";
import {
  buildOrbitalVolume,
  findRadialIsosurfaces,
  sampleOrbital,
  type OrbitalModel,
} from "../foundations/orbital-volume";
import {
  extractIsosurface,
  type ScalarVolume,
} from "../visualization/isosurface";

export interface OrbitalVolumeViewProps {
  model: OrbitalModel;
  representation: "surface" | "cloud";
  densityFraction: number;
  sliceAxis: "x" | "y" | "z";
  /** Fraction of the model's physical sampling extent, from -1 to +1. */
  slicePosition: number;
  showSlice: boolean;
  cutaway: boolean;
  resetToken: number;
  onUnavailable: () => void;
}

function paletteFor(element: HTMLElement) {
  const style = getComputedStyle(element);
  const read = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    positive: read("--orbital-positive", "#397fa4"),
    negative: read("--orbital-negative", "#ce8657"),
    background: read("--orbital-bg", "#f6f8fa"),
    ink: read("--figure-ink", "#5e6875"),
    grid: read("--figure-grid", "#a9b2bc"),
  };
}

function disposeTree(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();
    if (!mesh.material) return;
    for (const material of Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]) {
      (material as THREE.MeshBasicMaterial).map?.dispose();
      material.dispose();
    }
  });
}

function clearGroup(group: THREE.Group) {
  for (const child of [...group.children]) {
    disposeTree(child);
    group.remove(child);
  }
}

interface Viewer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  orbital: THREE.Group;
  axes: THREE.Group;
  slice: THREE.Group;
  clip: THREE.Plane;
  render: () => void;
}

const START = new THREE.Vector3(3.8, -5.6, 3.1);

/** Render a spatial wavefunction, never a height map of a planar diagram. */
export default function OrbitalVolumeView({
  model,
  representation,
  densityFraction,
  sliceAxis,
  slicePosition,
  showSlice,
  cutaway,
  resetToken,
  onUnavailable,
}: OrbitalVolumeViewProps) {
  const { t } = useLanguage();
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const cache = useRef<{ model: OrbitalModel; volume: ScalarVolume } | null>(
    null,
  );

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      onUnavailable();
      return;
    }
    const palette = paletteFor(container);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearColor(palette.background);
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80);
    camera.up.set(0, 0, 1);
    camera.position.copy(START);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 24;
    const orbital = new THREE.Group();
    const axes = new THREE.Group();
    const slice = new THREE.Group();
    const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    scene.add(orbital, axes, slice);
    scene.add(new THREE.AmbientLight(0xffffff, 1.65));
    const lamp = new THREE.DirectionalLight(0xffffff, 2.1);
    lamp.position.set(3, -4, 6);
    scene.add(lamp);
    const rim = new THREE.DirectionalLight(0xffffff, 0.65);
    rim.position.set(-4, 3, 1);
    scene.add(rim);

    let frame = 0;
    let disposed = false;
    let visible = true;
    const render = () => {
      if (disposed || frame || !visible || document.hidden) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        renderer.render(scene, camera);
        container.dataset.camera = JSON.stringify({
          position: camera.position.toArray(),
          target: controls.target.toArray(),
          quaternion: camera.quaternion.toArray(),
          zoom: camera.zoom,
        });
      });
    };
    const resize = () => {
      const width = Math.max(200, container.clientWidth);
      const height = Math.max(280, container.clientHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) render();
    });
    intersection.observe(container);
    const visibility = () => render();
    document.addEventListener("visibilitychange", visibility);
    controls.addEventListener("change", render);
    const lost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const keys = (event: KeyboardEvent) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "=",
          "-",
          "r",
          "R",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key.toLowerCase() === "r") {
        camera.position.copy(START);
        controls.target.set(0, 0, 0);
      } else if (["+", "=", "-"].includes(event.key)) {
        camera.position.setLength(
          Math.min(
            24,
            Math.max(
              1.8,
              camera.position.length() * (event.key === "-" ? 1.12 : 1 / 1.12),
            ),
          ),
        );
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        camera.position.applyAxisAngle(
          new THREE.Vector3(0, 0, 1),
          event.key === "ArrowLeft" ? 0.14 : -0.14,
        );
      } else {
        const side = new THREE.Vector3()
          .crossVectors(camera.position, camera.up)
          .normalize();
        camera.position.applyAxisAngle(
          side,
          event.key === "ArrowUp" ? 0.12 : -0.12,
        );
      }
      controls.update();
      render();
    };
    container.addEventListener("keydown", keys);
    viewer.current = {
      scene,
      camera,
      renderer,
      controls,
      orbital,
      axes,
      slice,
      clip,
      render,
    };
    container.dataset.ready = "true";
    controls.update();
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      container.removeEventListener("keydown", keys);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      controls.removeEventListener("change", render);
      controls.dispose();
      disposeTree(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      viewer.current = null;
      delete container.dataset.ready;
    };
  }, [onUnavailable]);

  useEffect(() => {
    const state = viewer.current;
    const container = host.current;
    if (!state || !container) return;
    const palette = paletteFor(container);
    clearGroup(state.axes);
    const physicalLength = model.displayRadius * 2;
    for (let index = 0; index < 3; index++) {
      const tip = new THREE.Vector3().setComponent(index, 2);
      const start = tip.clone().multiplyScalar(-1);
      const geometry = new THREE.BufferGeometry().setFromPoints([start, tip]);
      state.axes.add(
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: palette.grid,
            transparent: true,
            opacity: 0.65,
          }),
        ),
      );
      const label = document.createElement("canvas");
      label.width = 256;
      label.height = 64;
      const context = label.getContext("2d");
      if (context) {
        context.fillStyle = palette.ink;
        context.font = "26px system-ui";
        context.textAlign = "center";
        context.fillText(
          `${"xyz"[index]} · ${Number(physicalLength.toPrecision(3))} a₀`,
          128,
          42,
        );
      }
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(label),
          depthTest: false,
          transparent: true,
        }),
      );
      sprite.position.copy(tip).multiplyScalar(1.14);
      sprite.scale.set(1.1, 0.275, 1);
      state.axes.add(sprite);
    }
    state.render();
  }, [model]);

  useEffect(() => {
    const state = viewer.current;
    const container = host.current;
    if (!state || !container) return;
    clearGroup(state.orbital);
    const palette = paletteFor(container);
    const positive = new THREE.Color(palette.positive);
    const negative = new THREE.Color(palette.negative);
    const threshold = Math.sqrt(
      Math.max(1e-12, densityFraction) * model.maxDensity,
    );
    let vertices = 0;
    let pointCount = 0;
    let shells: { radius: number; phase: 1 | -1 }[] = [];
    const materialFor = (phase: number, opacity = 0.82) =>
      new THREE.MeshStandardMaterial({
        color: phase > 0 ? positive : negative,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.02,
        transparent: true,
        opacity,
        depthWrite: false,
      });
    if (representation === "cloud") {
      const points = sampleOrbital(model);
      const positions = new Float32Array(points.length * 3);
      const colors = new Float32Array(points.length * 3);
      points.forEach((point, index) => {
        positions.set([point.x, point.y, point.z], index * 3);
        const color = point.phase > 0 ? positive : negative;
        colors.set([color.r, color.g, color.b], index * 3);
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const cloud = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          size: 0.03,
          vertexColors: true,
          transparent: true,
          opacity: 0.57,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      );
      state.orbital.add(cloud);
      pointCount = points.length;
    } else if (model.l === 0) {
      // Spherical symmetry permits exact radial root finding. This resolves the
      // innermost Fe 4s shells that a uniform volume grid would undersample.
      const levels = findRadialIsosurfaces(model, densityFraction);
      shells = levels.map(({ radius, phase }) => ({ radius, phase }));
      for (const level of levels) {
        const geometry = new THREE.SphereGeometry(level.radius, 64, 40);
        if (level.normalSign === -1) {
          const normals = geometry.getAttribute("normal");
          for (let i = 0; i < normals.count; i++)
            normals.setXYZ(
              i,
              -normals.getX(i),
              -normals.getY(i),
              -normals.getZ(i),
            );
          // Keep the geometric face orientation consistent with inward normals.
          // Double-sided shading also uses gl_FrontFacing, not just the normal.
          const indices = geometry.getIndex()!;
          for (let i = 0; i < indices.count; i += 3) {
            const second = indices.getX(i + 1);
            indices.setX(i + 1, indices.getX(i + 2));
            indices.setX(i + 2, second);
          }
        }
        vertices += geometry.getAttribute("position").count;
        state.orbital.add(
          new THREE.Mesh(
            geometry,
            materialFor(level.phase, levels.length > 1 ? 0.53 : 0.84),
          ),
        );
      }
    } else {
      if (cache.current?.model !== model)
        cache.current = { model, volume: buildOrbitalVolume(model) };
      for (const phase of [1, -1] as const) {
        const surface = extractIsosurface(
          cache.current.volume,
          phase * threshold,
        );
        if (!surface.positions.length) continue;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(surface.positions, 3),
        );
        // The extractor normal points away from the positive excursion set;
        // the negative-phase region needs the reverse orientation.
        const normals =
          phase > 0 ? surface.normals : surface.normals.map((n) => -n);
        if (phase < 0) {
          // Reverse each unindexed triangle and its associated vertex normals.
          for (let i = 0; i < surface.positions.length; i += 9) {
            for (let coordinate = 0; coordinate < 3; coordinate++) {
              const a = i + 3 + coordinate;
              const b = i + 6 + coordinate;
              [surface.positions[a], surface.positions[b]] = [
                surface.positions[b],
                surface.positions[a],
              ];
              [normals[a], normals[b]] = [normals[b], normals[a]];
            }
          }
        }
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        vertices += surface.positions.length / 3;
        state.orbital.add(new THREE.Mesh(geometry, materialFor(phase)));
      }
    }
    state.orbital.scale.setScalar(1 / model.displayRadius);
    state.orbital.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(state.orbital);
    container.dataset.bounds = JSON.stringify(
      bounds.isEmpty()
        ? { min: [0, 0, 0], max: [0, 0, 0] }
        : { min: bounds.min.toArray(), max: bounds.max.toArray() },
    );
    container.dataset.surfaceVertices = String(vertices);
    container.dataset.pointCount = String(pointCount);
    container.dataset.sampleCount = String(pointCount);
    container.dataset.sphericalShells = JSON.stringify(shells);
    container.dataset.densityThreshold = String(threshold * threshold);
    state.render();
  }, [model, representation, densityFraction]);

  useEffect(() => {
    const state = viewer.current;
    const container = host.current;
    if (!state || !container) return;
    const axis = "xyz".indexOf(sliceAxis);
    const physical = Math.max(-1, Math.min(1, slicePosition)) * model.extent;
    state.clip.normal.set(0, 0, 0).setComponent(axis, 1);
    state.clip.constant = -physical / model.displayRadius;
    state.orbital.traverse((object) => {
      const material = (object as THREE.Mesh).material;
      if (!material) return;
      for (const item of Array.isArray(material) ? material : [material]) {
        item.clippingPlanes = cutaway ? [state.clip] : [];
        item.needsUpdate = true;
      }
    });
    clearGroup(state.slice);
    if (showSlice) {
      const palette = paletteFor(container);
      const positive = new THREE.Color(palette.positive).convertLinearToSRGB();
      const negative = new THREE.Color(palette.negative).convertLinearToSRGB();
      const resolution = 192;
      const pixels = new Uint8Array(resolution * resolution * 4);
      const other = [0, 1, 2].filter((i) => i !== axis);
      let lo = Infinity;
      let hi = 0;
      for (let row = 0; row < resolution; row++) {
        for (let column = 0; column < resolution; column++) {
          const xyz = [0, 0, 0];
          xyz[axis] = physical;
          xyz[other[0]] =
            (((column + 0.5) / resolution) * 2 - 1) * model.extent;
          xyz[other[1]] = (((row + 0.5) / resolution) * 2 - 1) * model.extent;
          const psi = model.wavefunction(xyz[0], xyz[1], xyz[2]);
          const density = psi * psi;
          lo = Math.min(lo, density);
          hi = Math.max(hi, density);
          const color = psi >= 0 ? positive : negative;
          const brightness =
            Math.log1p((1000 * density) / model.maxDensity) / Math.log(1001);
          const offset = (column + resolution * row) * 4;
          pixels[offset] = Math.round(color.r * 255);
          pixels[offset + 1] = Math.round(color.g * 255);
          pixels[offset + 2] = Math.round(color.b * 255);
          pixels[offset + 3] = Math.round(Math.min(1, brightness) * 235);
        }
      }
      const texture = new THREE.DataTexture(
        pixels,
        resolution,
        resolution,
        THREE.RGBAFormat,
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      const extent = model.extent / model.displayRadius;
      const geometry = new THREE.PlaneGeometry(extent * 2, extent * 2);
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
        }),
      );
      // Plane-local x/y coordinates follow the two remaining physical axes.
      const basisX = new THREE.Vector3().setComponent(other[0], 1);
      const basisY = new THREE.Vector3().setComponent(other[1], 1);
      const basisZ = new THREE.Vector3().crossVectors(basisX, basisY);
      mesh.setRotationFromMatrix(
        new THREE.Matrix4().makeBasis(basisX, basisY, basisZ),
      );
      mesh.position.setComponent(axis, physical / model.displayRadius);
      state.slice.add(mesh);
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({
          color: palette.grid,
          transparent: true,
          opacity: 0.6,
        }),
      );
      edge.quaternion.copy(mesh.quaternion);
      edge.position.copy(mesh.position);
      state.slice.add(edge);
      container.dataset.sliceRange = JSON.stringify([lo, hi]);
    } else {
      container.dataset.sliceRange = "[]";
    }
    container.dataset.slicePosition = String(physical);
    state.render();
  }, [
    model,
    representation,
    densityFraction,
    sliceAxis,
    slicePosition,
    showSlice,
    cutaway,
  ]);

  useEffect(() => {
    const state = viewer.current;
    if (!state) return;
    state.camera.position.copy(START);
    state.controls.target.set(0, 0, 0);
    state.controls.update();
    state.render();
  }, [resetToken]);

  return (
    <div
      ref={host}
      className="orbital-scene"
      data-testid="orbital-volume"
      data-dimensions="3"
      data-atom={model.atom}
      data-orbital={model.orbital}
      data-representation={representation}
      data-density-fraction={densityFraction}
      data-slice-axis={sliceAxis}
      data-cutaway={cutaway ? "true" : "false"}
      tabIndex={0}
      role="img"
      aria-label={t(
        "三维波函数：拖动旋转，滚轮缩放；方向键旋转，加减键缩放，R复位。剖切面显示同一空间函数的截面。",
        "Three-dimensional wavefunction: drag or use arrows to rotate, scroll or use plus/minus to zoom, R to reset. The slicing plane samples the same spatial function.",
      )}
    />
  );
}
