import MathMarkdown from "./MathMarkdown";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Download,
  Box,
  Scan,
  ChevronDown,
  Info,
} from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createSimulation, simulationDefinitions } from "../simulations";
import {
  createSpatialSimulation,
  spatialSimulationDefinitions,
  type SpatialMethodId,
} from "../simulations/spatial";
import SpatialVolumeView from "./SpatialVolumeView";
import { useLanguage, type Locale } from "../i18n";
import {
  translateSimulationText,
  simulationDescription,
  spatialSimulationDescription,
} from "../content/simulation-i18n";
import type {
  Method,
  MethodId,
  SimulationFrame,
  SimulationDefinition,
} from "../types";

const palette = ["#268b81", "#6574c4", "#d69451", "#bc6d84"];
const axisLabels: Partial<Record<MethodId, { x: string; y: string }>> = {
  dft: { x: "径向距离 r / a₀", y: "径向概率 / a₀⁻¹" },
  hf: { x: "SCF 迭代次数", y: "A 位点电子数 nA" },
  constitutive: { x: "时间 t / s", y: "应力 σ / MPa" },
  fem: { x: "杆长坐标 x / m", y: "位移 u / μm" },
};
const positionLabels: Partial<Record<MethodId, string>> = {
  md: "x / σ · y / σ",
  dd: "x / L · y / L",
  kmc: "x / nm · y / nm",
  fem: "杆形变示意 · 位移放大 10⁴ 倍",
};
const formatNumber = (n: number, locale: Locale) =>
  !Number.isFinite(n)
    ? "—"
    : n !== 0 && (Math.abs(n) < 0.001 || Math.abs(n) > 1e5)
      ? n.toExponential(2)
      : n.toLocaleString(locale === "zh" ? "zh-CN" : "en", {
          maximumFractionDigits: 4,
        });
const limits = (values: number[]) => {
  let lo = Infinity,
    hi = -Infinity;
  for (const v of values)
    if (Number.isFinite(v)) {
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
  if (!Number.isFinite(lo)) return [0, 1];
  if (hi - lo < 1e-8) return [lo - 0.5, hi + 0.5];
  return [lo, hi];
};
const fieldExtent = (
  id: MethodId,
  frame: SimulationFrame,
): [number, number] | undefined => {
  if (id === "mc" || id === "phase-field") return [-1, 1];
  if (id === "crystal-plasticity") return [0, 1];
  if (id === "fdm" && frame.grid)
    return [0, Math.max(...frame.grid.values, 1e-12)];
  return undefined;
};
const fieldColor = (t: number) =>
  new THREE.Color().setHSL(
    0.57 - 0.43 * Math.max(0, Math.min(1, t)),
    0.46,
    0.43 + 0.23 * t,
  );

function CanvasView({
  frame,
  definition,
  methodId,
  fieldRange,
}: {
  frame: SimulationFrame;
  definition: SimulationDefinition;
  methodId: MethodId;
  fieldRange?: [number, number];
}) {
  const { locale, t } = useLanguage();
  const number = (n: number) => formatNumber(n, locale);
  const label = (value: string) => translateSimulationText(locale, value);
  const ref = useRef<HTMLCanvasElement>(null);
  const pointBounds = useRef<{ x: number; y: number; range: number } | null>(
    null,
  );
  const [size, setSize] = useState({ width: 700, height: 360 });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width: Math.max(width, 1), height: Math.max(height, 1) });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = size;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f6f9fa";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#dbe5e7";
    for (let x = 20; x < w; x += 22)
      for (let y = 20; y < h; y += 22) {
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, 2 * Math.PI);
        ctx.fill();
      }
    const pad = { l: 66, r: 28, t: 36, b: 50 };
    const iw = w - pad.l - pad.r,
      ih = h - pad.t - pad.b;
    ctx.font = "13px ui-monospace, monospace";
    if (frame.grid) {
      const { width, height, values } = frame.grid;
      const side = Math.min(iw, ih),
        left = (w - side) / 2,
        top = (h - side) / 2 - 5;
      const [lo, hi] = fieldRange ?? limits(values);
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          ctx.fillStyle = `#${fieldColor((values[y * width + x] - lo) / (hi - lo)).getHexString()}`;
          ctx.fillRect(
            left + (x * side) / width,
            top + (y * side) / height,
            side / width + 0.4,
            side / height + 0.4,
          );
        }
      ctx.strokeStyle = "#8caaad";
      ctx.strokeRect(left, top, side, side);
      ctx.fillStyle = "#60777d";
      ctx.textAlign = "center";
      const barWidth = side * 0.62,
        barLeft = left + (side - barWidth) / 2;
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = `#${fieldColor(i / 79).getHexString()}`;
        ctx.fillRect(
          barLeft + (i * barWidth) / 80,
          top + side + 12,
          barWidth / 80 + 0.4,
          6,
        );
      }
      ctx.fillStyle = "#60777d";
      ctx.textAlign = "right";
      ctx.fillText(number(lo), barLeft - 6, top + side + 20);
      ctx.textAlign = "left";
      ctx.fillText(number(hi), barLeft + barWidth + 6, top + side + 20);
      ctx.textAlign = "center";
      ctx.fillText(
        `${width} × ${height} ${t("网格 · 固定色标", "grid · fixed color scale")}`,
        w / 2,
        top + side + 35,
      );
      ctx.textAlign = "left";
      ctx.fillText(`min ${number(Math.min(...values))}`, 18, 22);
      ctx.textAlign = "right";
      ctx.fillText(`max ${number(Math.max(...values))}`, w - 18, 22);
    } else if (definition.view === "curves" && frame.curves?.length) {
      const curves = frame.curves;
      const [xmin, xmax] = limits(
        curves.flatMap((c) => c.points.map((p) => p[0])),
      );
      const [ymin, ymax] = limits(
        curves.flatMap((c) => c.points.map((p) => p[1])),
      );
      const toX = (v: number) => pad.l + ((v - xmin) / (xmax - xmin)) * iw;
      const toY = (v: number) => pad.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
      const axes = axisLabels[methodId];
      if (axes) {
        ctx.fillStyle = "#536c74";
        ctx.textAlign = "left";
        ctx.fillText(label(axes.y), pad.l, 17);
        ctx.textAlign = "center";
        ctx.fillText(label(axes.x), pad.l + iw / 2, h - 4);
      }
      ctx.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (i * ih) / 4;
        ctx.strokeStyle = "#e1e8eb";
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
        ctx.fillStyle = "#65777d";
        ctx.fillText(number(ymax - (i * (ymax - ymin)) / 4), pad.l - 8, y + 4);
      }
      ctx.textAlign = "center";
      for (let i = 0; i <= 4; i++)
        ctx.fillText(
          number(xmin + (i * (xmax - xmin)) / 4),
          pad.l + (i * iw) / 4,
          h - 22,
        );
      curves.forEach((curve, c) => {
        ctx.strokeStyle = palette[c % palette.length];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        curve.points.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(toX(x), toY(y));
          else ctx.lineTo(toX(x), toY(y));
        });
        ctx.stroke();
        if (curve.points.length === 1) {
          const [x, y] = curve.points[0];
          ctx.fillStyle = palette[c % palette.length];
          ctx.beginPath();
          ctx.arc(toX(x), toY(y), 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    } else if (frame.points?.length) {
      const points = frame.points;
      const [xmin, xmax] = limits(points.map((p) => p.x));
      const [ymin, ymax] = limits(points.map((p) => p.y));
      if (!pointBounds.current || frame.time === 0)
        pointBounds.current = {
          x: frame.box ? 0 : (xmin + xmax) / 2,
          y: frame.box ? 0 : (ymin + ymax) / 2,
          range: frame.box
            ? frame.box * 1.15
            : Math.max(xmax - xmin, ymax - ymin, 1) * 1.3,
        };
      const bounds = pointBounds.current;
      const scale = Math.min(iw, ih) / bounds.range;
      const toX = (v: number) => w / 2 + (v - bounds.x) * scale;
      const toY = (v: number) => h / 2 - (v - bounds.y) * scale;
      ctx.strokeStyle = "#a9bdc5";
      ctx.lineWidth = 1.6;
      frame.edges?.forEach(([a, b]) => {
        if (!points[a] || !points[b]) return;
        ctx.beginPath();
        ctx.moveTo(toX(points[a].x), toY(points[a].y));
        ctx.lineTo(toX(points[b].x), toY(points[b].y));
        ctx.stroke();
      });
      const [vlo, vhi] = limits(points.map((p) => p.value ?? 0));
      points.forEach((p) => {
        const radius = p.radius
          ? Math.max(2.5, Math.min(13, p.radius * scale))
          : points.length > 100
            ? 3.4
            : 6;
        ctx.fillStyle =
          p.value === undefined
            ? "#358f89"
            : `#${fieldColor((p.value - vlo) / (vhi - vlo)).getHexString()}`;
        ctx.beginPath();
        ctx.arc(toX(p.x), toY(p.y), radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      ctx.fillStyle = "#65777d";
      ctx.textAlign = "left";
      ctx.fillText(
        label(positionLabels[methodId] ?? "x–y 投影"),
        18,
        23,
        w - 120,
      );
      ctx.textAlign = "right";
      ctx.fillText(`${points.length} ${t("个节点", "nodes")}`, w - 18, 23);
      ctx.textAlign = "center";
      ctx.fillText(
        `x: ${number(xmin)} → ${number(xmax)}  ·  y: ${number(ymin)} → ${number(ymax)}`,
        w / 2,
        h - 16,
      );
    }
  }, [frame, size, definition, methodId, fieldRange, locale]);
  return (
    <canvas
      ref={ref}
      className="lab-canvas"
      role="img"
      aria-label={t(
        "模拟结果的二维视图，数值结果见下方读数",
        "Two-dimensional view of simulation results; numerical values are listed below",
      )}
    />
  );
}

function ThreeView({
  frame,
  definition,
  active,
  onError,
  fieldRange,
}: {
  frame: SimulationFrame;
  definition: SimulationDefinition;
  active: boolean;
  onError: () => void;
  fieldRange?: [number, number];
}) {
  const { locale, t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const pointBounds = useRef<{
    x: number;
    y: number;
    z: number;
    range: number;
  } | null>(null);
  const state = useRef<{
    scene: THREE.Scene;
    group: THREE.Group;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    camera: THREE.PerspectiveCamera;
    signature: string;
  } | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor("#f6f9fa");
    node.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      t(
        "三维视图：拖拽旋转，滚轮缩放",
        "Three-dimensional view: drag to rotate, scroll to zoom",
      ),
    );
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.tabIndex = 0;
    renderer.domElement.title = t(
      "拖拽旋转，滚轮缩放；聚焦后方向键平移",
      "Drag to rotate; scroll to zoom; focus and use arrow keys to pan",
    );
    const contextLost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(7, 6, 8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 25;
    controls.listenToKeyEvents(renderer.domElement);
    controls.target.set(0, 0.25, 0);
    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(4, 6, 4);
    scene.add(light);
    const base = new THREE.GridHelper(7, 14, "#b9cccf", "#e0e8ea");
    base.position.y = -1.6;
    scene.add(base);
    state.current = { scene, group, renderer, controls, camera, signature: "" };
    const resize = () => {
      const w = node.clientWidth || 600,
        h = node.clientHeight || 360;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    resize();
    let animation = 0;
    const render = () => {
      animation = requestAnimationFrame(render);
      if (!activeRef.current || document.hidden) return;
      controls.update();
      renderer.render(scene, camera);
    };
    render();
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.Line
        ) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((m) => m.dispose());
        }
      });
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      state.current = null;
    };
  }, [onError]);
  useEffect(() => {
    const canvas = state.current?.renderer.domElement;
    if (canvas) {
      canvas.setAttribute(
        "aria-label",
        t(
          "三维视图：拖拽旋转，滚轮缩放",
          "Three-dimensional view: drag to rotate, scroll to zoom",
        ),
      );
      canvas.title = t(
        "拖拽旋转，滚轮缩放；聚焦后方向键平移",
        "Drag to rotate; scroll to zoom; focus and use arrow keys to pan",
      );
    }
  }, [locale, onError]);
  useEffect(() => {
    const context = state.current;
    if (!context) return;
    const { group } = context;
    const mode = frame.grid
      ? "field"
      : definition.view === "curves" && frame.curves?.length
        ? "curves"
        : "points";
    const signature = `${mode}-${frame.grid?.width}-${frame.grid?.height}-${frame.points?.length}-${frame.edges?.length}-${frame.curves?.map((c) => c.name).join(",")}`;
    if (context.signature !== signature) {
      while (group.children.length) {
        const child = group.children[0];
        child.traverse((object) => {
          if (
            object instanceof THREE.Mesh ||
            object instanceof THREE.Points ||
            object instanceof THREE.Line
          ) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((m) => m.dispose());
          }
        });
        group.remove(child);
      }
      context.signature = signature;
      if (mode === "field" && frame.grid) {
        const geometry = new THREE.PlaneGeometry(
          5,
          5,
          frame.grid.width - 1,
          frame.grid.height - 1,
        );
        geometry.rotateX(-Math.PI / 2);
        geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(
            new Float32Array(frame.grid.values.length * 3),
            3,
          ),
        );
        group.add(
          new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({
              vertexColors: true,
              side: THREE.DoubleSide,
              roughness: 0.7,
            }),
          ),
        );
      } else if (mode === "curves") {
        frame.curves?.forEach((_, i) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(8192 * 3), 3).setUsage(
              THREE.DynamicDrawUsage,
            ),
          );
          const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: palette[i % palette.length] }),
          );
          // A point marker keeps the initial single-iteration SCF state visible.
          const markerGeometry = new THREE.BufferGeometry();
          markerGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(3), 3),
          );
          line.add(
            new THREE.Points(
              markerGeometry,
              new THREE.PointsMaterial({
                color: palette[i % palette.length],
                size: 0.1,
              }),
            ),
          );
          group.add(line);
        });
      } else {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(
            new Float32Array((frame.points?.length ?? 0) * 3),
            3,
          ),
        );
        geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(
            new Float32Array((frame.points?.length ?? 0) * 3),
            3,
          ),
        );
        group.add(
          new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
              size: 0.14,
              vertexColors: true,
              sizeAttenuation: true,
            }),
          ),
        );
        if (frame.edges?.length) {
          const lines = new THREE.BufferGeometry();
          lines.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
              new Float32Array(frame.edges.length * 6),
              3,
            ),
          );
          group.add(
            new THREE.LineSegments(
              lines,
              new THREE.LineBasicMaterial({ color: "#89a5ad" }),
            ),
          );
        }
      }
    }
    if (mode === "field" && frame.grid) {
      const mesh = group.children[0] as THREE.Mesh;
      const vertices = mesh.geometry.getAttribute("position");
      const colors = mesh.geometry.getAttribute("color");
      const [lo, hi] = fieldRange ?? limits(frame.grid.values);
      frame.grid.values.forEach((value, i) => {
        const t = (value - lo) / (hi - lo);
        vertices.setY(i, 2 * t - 1);
        const color = fieldColor(t);
        colors.setXYZ(i, color.r, color.g, color.b);
      });
      vertices.needsUpdate = true;
      colors.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    } else if (mode === "curves" && frame.curves) {
      const [xmin, xmax] = limits(
        frame.curves.flatMap((c) => c.points.map((p) => p[0])),
      );
      const [ymin, ymax] = limits(
        frame.curves.flatMap((c) => c.points.map((p) => p[1])),
      );
      frame.curves.forEach((curve, i) => {
        const line = group.children[i] as THREE.Line;
        const positions = line.geometry.getAttribute("position");
        const visiblePoints = curve.points.slice(-8192);
        visiblePoints.forEach(([x, y], j) =>
          positions.setXYZ(
            j,
            ((x - xmin) / (xmax - xmin)) * 5 - 2.5,
            ((y - ymin) / (ymax - ymin)) * 3 - 1,
            0,
          ),
        );
        positions.needsUpdate = true;
        line.geometry.setDrawRange(0, visiblePoints.length);
        line.geometry.computeBoundingSphere();
        const marker = line.children[0] as THREE.Points;
        const lastPoint = visiblePoints.at(-1);
        marker.visible = Boolean(lastPoint);
        if (lastPoint) {
          const vertices = marker.geometry.getAttribute("position");
          vertices.setXYZ(
            0,
            ((lastPoint[0] - xmin) / (xmax - xmin)) * 5 - 2.5,
            ((lastPoint[1] - ymin) / (ymax - ymin)) * 3 - 1,
            0,
          );
          vertices.needsUpdate = true;
          marker.geometry.computeBoundingSphere();
        }
      });
    } else if (frame.points?.length) {
      const points = frame.points;
      const [xmin, xmax] = limits(points.map((p) => p.x)),
        [ymin, ymax] = limits(points.map((p) => p.y)),
        [zmin, zmax] = limits(points.map((p) => p.z));
      const [vlo, vhi] = limits(points.map((p) => p.value ?? 0));
      if (!pointBounds.current || frame.time === 0)
        pointBounds.current = {
          x: (xmin + xmax) / 2,
          y: (ymin + ymax) / 2,
          z: (zmin + zmax) / 2,
          range: Math.max(xmax - xmin, ymax - ymin, zmax - zmin, 1),
        };
      const bounds = pointBounds.current;
      const scale = 5 / bounds.range;
      const xyz = points.map(
        (p) =>
          new THREE.Vector3(
            (p.x - bounds.x) * scale,
            (p.z - bounds.z) * scale,
            (p.y - bounds.y) * scale,
          ),
      );
      const mesh = group.children[0] as THREE.Points;
      const vertices = mesh.geometry.getAttribute("position"),
        colors = mesh.geometry.getAttribute("color");
      points.forEach((p, i) => {
        vertices.setXYZ(i, xyz[i].x, xyz[i].y, xyz[i].z);
        const color =
          p.value === undefined
            ? new THREE.Color("#358f89")
            : fieldColor((p.value - vlo) / (vhi - vlo));
        colors.setXYZ(i, color.r, color.g, color.b);
      });
      vertices.needsUpdate = true;
      colors.needsUpdate = true;
      mesh.geometry.computeBoundingSphere();
      if (frame.edges?.length && group.children[1]) {
        const line = group.children[1] as THREE.LineSegments;
        const positions = line.geometry.getAttribute("position");
        frame.edges.forEach(([a, b], i) => {
          if (xyz[a] && xyz[b]) {
            positions.setXYZ(2 * i, xyz[a].x, xyz[a].y, xyz[a].z);
            positions.setXYZ(2 * i + 1, xyz[b].x, xyz[b].y, xyz[b].z);
          }
        });
        positions.needsUpdate = true;
        line.geometry.computeBoundingSphere();
      }
    }
  }, [frame, definition, fieldRange]);
  return <div ref={ref} className="lab-three" />;
}

function exportFrame(frame: SimulationFrame, name: string, locale: Locale) {
  const label = (value: string) => translateSimulationText(locale, value);
  const rows: (string | number)[][] = [
    ["type", "index", "x", "y", "z", "value"],
  ];
  frame.points?.forEach((p, i) =>
    rows.push(["point", i, p.x, p.y, p.z, p.value ?? ""]),
  );
  frame.grid?.values.forEach((v, i) =>
    rows.push([
      "grid",
      i,
      i % frame.grid!.width,
      Math.floor(i / frame.grid!.width),
      "",
      v,
    ]),
  );
  frame.volume?.values.forEach((v, i) => {
    const { width, height, depth } = frame.volume!;
    const box = frame.box ?? width;
    rows.push([
      "volume",
      i,
      (((i % width) + 0.5) / width - 0.5) * box,
      (((Math.floor(i / width) % height) + 0.5) / height - 0.5) * box,
      ((Math.floor(i / (width * height)) + 0.5) / depth - 0.5) * box,
      v,
    ]);
  });
  frame.curves?.forEach((c) =>
    c.points.forEach(([x, y], i) =>
      rows.push([label(c.name), i, x, y, "", ""]),
    ),
  );
  frame.metrics.forEach((m) =>
    rows.push(["metric", label(m.label), "", "", label(m.unit ?? ""), m.value]),
  );
  const text = rows
    .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff", text], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}-snapshot.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function SimulationLab({ method }: { method: Method }) {
  const { locale, t } = useLanguage();
  const number = (n: number) => formatNumber(n, locale);
  const label = (value: string) => translateSimulationText(locale, value);
  const supportsSpatial = method.id === "md" || method.id === "phase-field";
  const [dimension, setDimension] = useState<2 | 3>(3);
  const spatial = supportsSpatial && dimension === 3;
  const definition = spatial
    ? spatialSimulationDefinitions[method.id as SpatialMethodId]
    : simulationDefinitions[method.id];
  const defaults = useMemo(
    () =>
      Object.fromEntries(definition.controls.map((c) => [c.key, c.initial])),
    [definition],
  );
  const model = useMemo(
    () =>
      spatial
        ? createSpatialSimulation(method.id as SpatialMethodId, defaults)
        : createSimulation(method.id, defaults),
    [method.id, defaults, spatial],
  );
  const [params, setParams] = useState(defaults);
  const [frame, setFrame] = useState(() => model.reset(defaults));
  const [fieldRange, setFieldRange] = useState(() =>
    fieldExtent(method.id, frame),
  );
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState<"2d" | "3d">(spatial ? "3d" : "2d");
  const [sliceIndex, setSliceIndex] = useState(12);
  const [showSlice, setShowSlice] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [steps, setSteps] = useState(0);
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const onWebglError = useMemo(
    () => () => {
      setWebglFailed(true);
      setMode("2d");
    },
    [],
  );
  useEffect(() => {
    const next = model.reset(defaults);
    setParams(defaults);
    setFrame(next);
    setFieldRange(fieldExtent(method.id, next));
    setSteps(0);
    setRunning(false);
    setError("");
    setSliceIndex(12);
    setShowSlice(false);
  }, [defaults, model, method.id]);
  useEffect(() => {
    setMode(spatial && !webglFailed ? "3d" : "2d");
  }, [spatial, method.id, webglFailed]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!running || !visible) return;
    let animation = 0,
      last = 0;
    const interval = spatial && method.id === "phase-field" ? 120 : 60;
    const tick = (time: number) => {
      animation = requestAnimationFrame(tick);
      if (document.hidden || time - last < interval) return;
      last = time;
      try {
        setFrame(model.step(speed));
        setSteps((n) => n + speed);
      } catch {
        setError("本次参数计算未能完成，请重置实验。");
        setRunning(false);
      }
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, [model, running, speed, visible, spatial, method.id]);
  const reset = (next = defaults) => {
    const initialFrame = model.reset(next);
    setParams(next);
    setFrame(initialFrame);
    setFieldRange(fieldExtent(method.id, initialFrame));
    setSteps(0);
    setError("");
    setSliceIndex(12);
    setShowSlice(false);
  };
  const step = () => {
    try {
      setFrame(model.step());
      setSteps((n) => n + 1);
    } catch {
      setError("计算未能完成，请重置实验。");
    }
  };
  const displayFrame = useMemo(() => {
    if (!frame.volume) return frame;
    const volume = frame.volume;
    const index = Math.max(0, Math.min(volume.depth - 1, sliceIndex));
    const offset = volume.width * volume.height * index;
    return {
      ...frame,
      grid: {
        width: volume.width,
        height: volume.height,
        values: volume.values.slice(
          offset,
          offset + volume.width * volume.height,
        ),
      },
    };
  }, [frame, sliceIndex]);
  return (
    <div
      className="simulation-lab"
      ref={root}
      data-model-dimension={spatial ? "3" : "2"}
    >
      {supportsSpatial && (
        <div className="lab-model-selector">
          <span>{t("计算模型", "Model dimension")}</span>
          <div role="group" aria-label={t("计算模型维度", "Model dimension")}>
            {([2, 3] as const).map((value) => (
              <button
                key={value}
                data-testid={`lab-dimension-${value}`}
                aria-pressed={dimension === value}
                onClick={() => {
                  setRunning(false);
                  setDimension(value);
                }}
              >
                {value === 3
                  ? t("三维模型", "3D model")
                  : t("二维模型", "2D model")}
              </button>
            ))}
          </div>
          <small>
            {t(
              "切换模型会重新开始",
              "Changing the model restarts the experiment",
            )}
          </small>
        </div>
      )}
      <div className="lab-workspace">
        <div className="lab-display">
          <div className="lab-display-toolbar">
            <div
              className="lab-mode"
              role="group"
              aria-label={t("可视化维度", "Visualization dimension")}
            >
              <button
                className={mode === "2d" ? "active" : ""}
                aria-pressed={mode === "2d"}
                onClick={() => setMode("2d")}
              >
                <Scan size={15} />
                {spatial
                  ? frame.volume
                    ? t("截面", "Slice")
                    : t("投影", "Projection")
                  : "2D"}
              </button>
              <button
                className={mode === "3d" ? "active" : ""}
                aria-pressed={mode === "3d"}
                disabled={webglFailed}
                onClick={() => setMode("3d")}
              >
                <Box size={15} />
                {spatial ? "3D" : t("立体图示", "Perspective")}
              </button>
            </div>
            <span className="lab-step">
              {running ? t("运行中", "Running") : t("已暂停", "Paused")} ·{" "}
              {steps} {t("步", "steps")}
            </span>
          </div>
          <div className="lab-viewport">
            {mode === "2d" ? (
              <CanvasView
                frame={displayFrame}
                definition={definition}
                methodId={method.id}
                fieldRange={fieldRange}
              />
            ) : spatial ? (
              <SpatialVolumeView
                key={method.id}
                frame={frame}
                sliceIndex={sliceIndex}
                showSlice={showSlice}
                active={visible}
                onError={onWebglError}
              />
            ) : (
              <ThreeView
                frame={frame}
                definition={definition}
                active={visible}
                onError={onWebglError}
                fieldRange={fieldRange}
              />
            )}
          </div>
          {spatial && frame.volume && (
            <div className="lab-volume-controls">
              {mode === "3d" && (
                <label className="lab-volume-toggle">
                  <input
                    data-testid="lab-volume-slice-enabled"
                    type="checkbox"
                    checked={showSlice}
                    onChange={(event) => setShowSlice(event.target.checked)}
                  />
                  <span>{t("显示剖切面", "Show section plane")}</span>
                </label>
              )}
              <label>
                <span>
                  {t("剖切深度", "Section depth")} · z ={" "}
                  {number(
                    ((Math.min(sliceIndex, frame.volume.depth - 1) + 0.5) /
                      frame.volume.depth -
                      0.5) *
                      (frame.box ?? frame.volume.depth),
                  )}{" "}
                  Δx
                </span>
                <input
                  data-testid="lab-volume-slice"
                  aria-label={t("剖面 z 层", "Slice z layer")}
                  type="range"
                  min="0"
                  max={frame.volume.depth - 1}
                  step="1"
                  value={Math.min(sliceIndex, frame.volume.depth - 1)}
                  onChange={(event) => {
                    setSliceIndex(Number(event.target.value));
                    setShowSlice(true);
                  }}
                />
              </label>
            </div>
          )}
          <div className="lab-view-hint">
            {mode === "3d" ? (
              <>
                {t("拖拽旋转 · 滚轮缩放", "Drag to rotate · Scroll to zoom")}
                {spatial
                  ? frame.volume
                    ? ` · ${t("φ = 0 三维相界 · 移动剖面查看内部", "φ = 0 spatial interface · move the section to inspect the interior")}`
                    : ` · ${t("真实 x、y、z 运动 · 周期模拟盒", "Physical x, y, z motion · periodic simulation box")}`
                  : frame.grid
                    ? ` · ${t("二维场值高度图", "Height plot of a two-dimensional field")}`
                    : definition.view === "curves"
                      ? ` · ${t("曲线图示", "Curve presentation")} · ${label(axisLabels[method.id]?.x ?? "x")} / ${label(axisLabels[method.id]?.y ?? "y")}`
                      : ` · ${t("二维平面模型", "Two-dimensional planar model")}`}
              </>
            ) : spatial ? (
              frame.volume ? (
                t(
                  "三维体数据的 xy 截面 · 固定色标 −1 至 +1",
                  "An xy section of the 3D volume · fixed color range −1 to +1",
                )
              ) : (
                t(
                  "三维粒子的 xy 投影；z 方向仍参与计算",
                  "xy projection of 3D particles; z still participates in the dynamics",
                )
              )
            ) : frame.grid ? (
              t("固定色标", "Fixed color scale")
            ) : definition.view === "curves" ? (
              t("坐标范围随数据调整", "Axes adjust to the data range")
            ) : (
              t(
                "固定比例显示运动与形变",
                "Fixed scale for motion and deformation",
              )
            )}
            {webglFailed &&
              t(
                " · 当前设备未提供 WebGL，已使用二维视图",
                " · 3D is unavailable on this device; showing 2D",
              )}
          </div>
          {frame.curves?.length && definition.view === "curves" ? (
            <div className="lab-legend">
              {frame.curves.map((curve, i) => (
                <span key={label(curve.name)}>
                  <i className={`legend-dot legend-dot-${i % 4}`} />
                  {label(curve.name)}
                </span>
              ))}
            </div>
          ) : null}
          <div className="lab-playback">
            <button
              className="lab-play primary-button"
              onClick={() => setRunning(!running)}
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? t("暂停", "Pause") : t("运行实验", "Run experiment")}
            </button>
            <button
              className="lab-icon-button"
              onClick={step}
              disabled={running}
              aria-label={t("前进一步", "Step forward")}
              title={t("前进一步", "Step forward")}
            >
              <SkipForward size={17} />
            </button>
            <button
              className="lab-icon-button"
              onClick={() => {
                setRunning(false);
                reset();
              }}
              aria-label={t(
                "重置参数与实验",
                "Reset parameters and experiment",
              )}
              title={t("重置参数与实验", "Reset parameters and experiment")}
            >
              <RotateCcw size={16} />
            </button>
            <label className="lab-speed">
              {t("速度", "Speed")}
              <select
                aria-label={t("模拟速度", "Simulation speed")}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value="1">1×</option>
                <option value="3">3×</option>
                <option value="8">8×</option>
              </select>
              <ChevronDown size={12} />
            </label>
            <button
              className="lab-export lab-icon-button"
              onClick={() => exportFrame(frame, method.id, locale)}
              aria-label={t("导出当前数值 CSV", "Export current data as CSV")}
              title={t("导出当前数值 CSV", "Export current data as CSV")}
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="lab-controls">
          <div className="lab-controls-title">
            {t("实验参数", "Parameters")}
            <span>
              {t("调节后重新开始", "Changing a parameter resets the model")}
            </span>
          </div>
          {definition.controls.map((control) => (
            <label className="lab-control" key={control.key}>
              <span>
                {label(control.label)}
                <output>
                  {number(params[control.key] ?? control.initial)}{" "}
                  {label(control.unit ?? "")}
                </output>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={params[control.key] ?? control.initial}
                onChange={(e) =>
                  reset({ ...params, [control.key]: Number(e.target.value) })
                }
              />
              <span className="lab-range">
                <span>{number(control.min)}</span>
                <span>{number(control.max)}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      {error && (
        <p className="lab-error" role="alert">
          {label(error)}
        </p>
      )}
      <div
        className="lab-metrics"
        aria-label={t("当前模拟数值", "Current simulation values")}
      >
        {frame.metrics.map((metric) => (
          <div className="lab-metric" key={metric.label}>
            <span>{label(metric.label)}</span>
            <strong>
              {number(metric.value)}
              <small>{label(metric.unit ?? "")}</small>
            </strong>
          </div>
        ))}
      </div>
      <details className="lab-model-note">
        <summary>
          <Info size={14} />
          {t("模型、坐标与单位说明", "Model, axes and units")}
        </summary>
        <p>
          {spatial
            ? spatialSimulationDescription(
                locale,
                method.id as SpatialMethodId,
                definition.description,
              )
            : simulationDescription(locale, method.id, definition.description)}
        </p>
        {!spatial && (
          <MathMarkdown>{method.experiment.limitations}</MathMarkdown>
        )}
      </details>
    </div>
  );
}
