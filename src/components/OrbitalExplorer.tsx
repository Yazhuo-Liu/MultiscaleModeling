import { useCallback, useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useLanguage } from "../i18n";
import MathMarkdown from "./MathMarkdown";
import {
  GROUND_SUBSHELLS,
  HYDROGEN_EXTENT,
  HYDROGEN_ORBITALS,
  IRON_ORBITALS,
  ORBITAL_LATEX,
  hydrogenRadialProbability,
  hydrogenWavefunction,
  hundOccupancy,
  ironAngularAmplitude,
  ironAngularSurface,
  ironSlicePlane,
  sampleHydrogen,
  shellPopulation,
  type Atom,
  type HydrogenOrbital,
  type IronOrbital,
} from "../foundations/orbitals";

const POSITIVE = "var(--orbital-positive, #397fa4)";
const NEGATIVE = "var(--orbital-negative, #ce8657)";
const INK = "var(--figure-ink, #5e6875)";
const GRID = "var(--figure-grid, #a9b2bc)";
type Level = "shells" | "subshells" | "shape";

function orbitalPalette(element: Element) {
  const style = getComputedStyle(element);
  const color = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    positive: color("--orbital-positive", "#397fa4"),
    negative: color("--orbital-negative", "#ce8657"),
    background: color("--orbital-bg", "#f6f8fa"),
    ink: color("--figure-ink", "#5e6875"),
    grid: color("--figure-grid", "#a9b2bc"),
  };
}

function rgbBytes(color: string) {
  const rgb = new THREE.Color(color).getRGB(
    new THREE.Color(),
    THREE.SRGBColorSpace,
  );
  return [rgb.r * 255, rgb.g * 255, rgb.b * 255];
}

function OrbitalSlice({
  atom,
  hydrogen,
  iron,
}: {
  atom: Atom;
  hydrogen: HydrogenOrbital;
  iron: IronOrbital;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { t, locale } = useLanguage();
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;
    const draw = () => {
      const palette = orbitalPalette(element);
      const positiveRGB = rgbBytes(palette.positive),
        negativeRGB = rgbBytes(palette.negative),
        backgroundRGB = rgbBytes(palette.background);
      const w = 600,
        h = 440,
        cx = 300,
        cy = 210,
        half = 176;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, w, h);
      const extent = hydrogen === "1s" ? 4 : 12;
      if (atom === "H") {
        const size = 352;
        const pixels = ctx.createImageData(size, size);
        const maxPsi =
          hydrogen === "1s"
            ? hydrogenWavefunction(hydrogen, 0, 0, 0)
            : hydrogen === "2s"
              ? hydrogenWavefunction(hydrogen, 0, 0, 0)
              : hydrogenWavefunction(hydrogen, 0, 0, 2);
        for (let j = 0; j < size; j++)
          for (let i = 0; i < size; i++) {
            const x = (((i + 0.5) / size) * 2 - 1) * extent;
            const z = (1 - ((j + 0.5) / size) * 2) * extent;
            const psi = hydrogenWavefunction(hydrogen, x, 0, z);
            // A declared logarithmic density color scale makes weak tails visible.
            const alpha =
              Math.log1p((100 * psi * psi) / (maxPsi * maxPsi)) / Math.log(101);
            const rgb = psi >= 0 ? positiveRGB : negativeRGB;
            const offset = (j * size + i) * 4;
            for (let c = 0; c < 3; c++)
              pixels.data[offset + c] = Math.round(
                backgroundRGB[c] * (1 - alpha) + rgb[c] * alpha,
              );
            pixels.data[offset + 3] = 255;
          }
        ctx.putImageData(pixels, cx - half, cy - half);
        if (hydrogen === "2s") {
          ctx.beginPath();
          ctx.arc(cx, cy, (2 / extent) * half, 0, 2 * Math.PI);
          ctx.strokeStyle = palette.ink;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        const plane = ironSlicePlane(iron);
        let currentSign = 0;
        const finish = () => {
          ctx.lineTo(cx, cy);
          ctx.closePath();
          ctx.globalAlpha = 0.32;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.stroke();
        };
        for (let i = 0; i <= 720; i++) {
          const angle = (2 * Math.PI * i) / 720;
          const u = Math.cos(angle),
            v = Math.sin(angle);
          const amplitude =
            plane === "xy"
              ? ironAngularAmplitude(iron, u, v, 0)
              : plane === "yz"
                ? ironAngularAmplitude(iron, 0, u, v)
                : ironAngularAmplitude(iron, u, 0, v);
          const sign = amplitude >= 0 ? 1 : -1;
          if (sign !== currentSign) {
            if (currentSign) finish();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.fillStyle = sign > 0 ? palette.positive : palette.negative;
            ctx.strokeStyle = sign > 0 ? palette.positive : palette.negative;
            ctx.lineWidth = 2;
            currentSign = sign;
          }
          const radius = 250 * Math.abs(amplitude);
          ctx.lineTo(cx + radius * u, cy - radius * v);
        }
        finish();
      }
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - half - 10, cy);
      ctx.lineTo(cx + half + 14, cy);
      ctx.moveTo(cx, cy + half + 10);
      ctx.lineTo(cx, cy - half - 14);
      ctx.stroke();
      ctx.fillStyle = palette.ink;
      const fontSize = Math.min(
        30,
        Math.max(15, (15 * w) / Math.max(element.clientWidth, 250)),
      );
      ctx.font = `${fontSize}px system-ui`;
      const plane = atom === "H" ? "xz" : ironSlicePlane(iron);
      ctx.fillText(plane[0], cx + half + 20, cy + 5);
      ctx.fillText(plane[1], cx + 10, Math.max(fontSize + 4, cy - half - 20));
      if (atom === "H") {
        ctx.textAlign = "center";
        for (const fraction of [-1, -0.5, 0.5, 1]) {
          const x = cx + fraction * half;
          ctx.beginPath();
          ctx.moveTo(x, cy - 3);
          ctx.lineTo(x, cy + 3);
          ctx.stroke();
          ctx.fillText(String(fraction * extent), x, cy + 22);
        }
        ctx.fillText(t("坐标单位：a₀", "Coordinates in a₀"), cx, h - 15);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(t("角向振幅示意", "Angular amplitude only"), cx, h - 15);
      }
      ctx.textAlign = "left";
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [atom, hydrogen, iron, locale]);
  return (
    <canvas
      ref={canvas}
      className="orbital-slice"
      width={600}
      height={440}
      role="img"
      aria-label={
        atom === "H"
          ? t(
              "氢原子轨道在 xz 平面上的截面，颜色区分相位，深浅按概率密度的对数色阶显示",
              "Hydrogen orbital in the xz plane: color shows phase; intensity uses a logarithmic density scale",
            )
          : t(
              "铁原子 d 轨道角向振幅的二维截面，颜色区分相位",
              "Two-dimensional section of a d orbital's angular amplitude; colors distinguish phase",
            )
      }
    >
      {t("轨道截面", "Orbital section")}
    </canvas>
  );
}

function RadialPlot({ orbital }: { orbital: HydrogenOrbital }) {
  const { t } = useLanguage();
  const extent = HYDROGEN_EXTENT[orbital];
  const points = Array.from({ length: 241 }, (_, i) => [
    (i / 240) * extent,
    hydrogenRadialProbability(orbital, (i / 240) * extent),
  ]);
  const maximum = Math.max(...points.map((p) => p[1])) * 1.12;
  const x = (r: number) => 50 + (r / extent) * 290;
  const y = (value: number) => 192 - (value / maximum) * 142;
  const path = points
    .map(
      (p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(2)},${y(p[1]).toFixed(2)}`,
    )
    .join(" ");
  const peak = orbital === "1s" ? 1 : orbital === "2s" ? 3 + Math.sqrt(5) : 4;
  return (
    <div className="orbital-radial">
      <h4>{t("径向概率", "Radial probability")}</h4>
      <MathMarkdown
        display
      >{String.raw`P(r)=r^2\int |\psi(r,\theta,\phi)|^2\,d\Omega`}</MathMarkdown>
      <svg
        viewBox="0 0 370 245"
        role="img"
        aria-label={t(
          "氢原子径向概率曲线；横轴为距核距离，纵轴为每单位半径的概率",
          "Hydrogen radial probability: radius on the horizontal axis; probability per unit radius vertically",
        )}
      >
        <path d="M50 42V192H345" fill="none" stroke={GRID} />
        <path
          d={`${path} L340,192 L50,192 Z`}
          fill={POSITIVE}
          fillOpacity={0.095}
        />
        <path d={path} fill="none" stroke={POSITIVE} strokeWidth="2.5" />
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <text
              x="42"
              y={y(f * maximum) + 4}
              textAnchor="end"
              fontSize="11"
              fill={INK}
            >
              {(f * maximum).toFixed(2)}
            </text>
            <path d={`M47 ${y(f * maximum)}h3`} stroke={GRID} />
          </g>
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <text
            key={f}
            x={x(f * extent)}
            y="212"
            textAnchor="middle"
            fontSize="12"
            fill={INK}
          >
            {f * extent}
          </text>
        ))}
        <path
          d={`M${x(peak)} ${y(hydrogenRadialProbability(orbital, peak))}V192`}
          stroke={POSITIVE}
          strokeDasharray="4 4"
        />
        {orbital === "2s" && (
          <g>
            <circle cx={x(2)} cy={192} r="4" fill={NEGATIVE} />
            <text
              x={x(2)}
              y="173"
              fontSize="11"
              textAnchor="middle"
              fill={NEGATIVE}
            >
              2a₀
            </text>
          </g>
        )}
        <text x="50" y="25" fontSize="12" fill={INK}>
          P(r) / a₀⁻¹
        </text>
        <text x="340" y="236" textAnchor="end" fontSize="12" fill={INK}>
          r / a₀
        </text>
      </svg>
      <MathMarkdown>
        {orbital === "1s"
          ? t(
              "$1s$ 的密度在核处最大，但 $P(r)$ 在 $r=a_0$ 达到峰值：球壳体积也在增加。",
              "$1s$ density is greatest at the nucleus, but $P(r)$ peaks at $r=a_0$: spherical-shell volume matters too.",
            )
          : orbital === "2s"
            ? t(
                "$2s$ 在 $r=2a_0$ 有径向节点；节点两侧相位相反，概率仍非负。",
                "$2s$ has a radial node at $r=2a_0$. Phase changes across it, while probability stays nonnegative.",
              )
            : t(
                "$2p_z$ 的径向概率在 $r=4a_0$ 最大，没有径向节点；$z=0$ 平面是角节点。",
                "$2p_z$ radial probability peaks at $r=4a_0$ and has no radial node. The $z=0$ plane is an angular node.",
              )}
      </MathMarkdown>
    </div>
  );
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();
    if (mesh.material)
      for (const material of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        const mapped = material as THREE.MeshBasicMaterial;
        mapped.map?.dispose();
        material.dispose();
      }
  });
}

interface SceneState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  object: THREE.Object3D | null;
  render: () => void;
}
function OrbitalScene({
  atom,
  hydrogen,
  iron,
  resetToken,
  onUnavailable,
}: {
  atom: Atom;
  hydrogen: HydrogenOrbital;
  iron: IronOrbital;
  resetToken: number;
  onUnavailable: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<SceneState | null>(null);
  const { t } = useLanguage();
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
    const palette = orbitalPalette(container);
    renderer.setClearColor(palette.background);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.up.set(0, 0, 1);
    camera.position.set(3.6, -4.8, 3);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 13;
    scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const lamp = new THREE.DirectionalLight(0xffffff, 2.2);
    lamp.position.set(3, -4, 5);
    scene.add(lamp);
    const axes = new THREE.Group();
    for (let axis = 0; axis < 3; axis++) {
      const point = new THREE.Vector3();
      point.setComponent(axis, 2);
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        point,
      ]);
      axes.add(
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
      label.width = 64;
      label.height = 64;
      const ctx = label.getContext("2d");
      if (ctx) {
        ctx.font = "32px system-ui";
        ctx.fillStyle = palette.ink;
        ctx.textAlign = "center";
        ctx.fillText("xyz"[axis], 32, 44);
      }
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(label),
          transparent: true,
          depthTest: false,
        }),
      );
      sprite.position.copy(point).multiplyScalar(1.07);
      sprite.scale.set(0.22, 0.22, 0.22);
      axes.add(sprite);
    }
    scene.add(axes);
    let frame = 0,
      disposed = false;
    const render = () => {
      if (disposed || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!disposed) {
          renderer.render(scene, camera);
          container.dataset.camera = JSON.stringify({
            position: camera.position.toArray(),
            target: controls.target.toArray(),
            quaternion: camera.quaternion.toArray(),
            zoom: camera.zoom,
          });
        }
      });
    };
    controls.addEventListener("change", render);
    const resize = () => {
      const width = Math.max(container.clientWidth, 200),
        height = Math.max(container.clientHeight, 280);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const lose = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    renderer.domElement.addEventListener("webglcontextlost", lose);
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
        camera.position.set(3.6, -4.8, 3);
        controls.target.set(0, 0, 0);
      } else if (["+", "=", "-"].includes(event.key)) {
        const next =
          camera.position.length() * (event.key === "-" ? 1.12 : 1 / 1.12);
        camera.position.setLength(Math.min(13, Math.max(2.4, next)));
      } else {
        const vector = camera.position.clone();
        if (event.key === "ArrowLeft" || event.key === "ArrowRight")
          vector.applyAxisAngle(
            new THREE.Vector3(0, 0, 1),
            event.key === "ArrowLeft" ? 0.14 : -0.14,
          );
        else {
          const side = new THREE.Vector3()
            .crossVectors(vector, camera.up)
            .normalize();
          vector.applyAxisAngle(side, event.key === "ArrowUp" ? 0.12 : -0.12);
        }
        camera.position.copy(vector);
      }
      controls.update();
      render();
    };
    container.addEventListener("keydown", keys);
    engine.current = {
      scene,
      camera,
      renderer,
      controls,
      object: null,
      render,
    };
    container.dataset.ready = "true";
    resize();
    controls.update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("keydown", keys);
      renderer.domElement.removeEventListener("webglcontextlost", lose);
      controls.removeEventListener("change", render);
      controls.dispose();
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      engine.current = null;
    };
  }, [onUnavailable]);
  useEffect(() => {
    const state = engine.current;
    if (!state) return;
    if (state.object) {
      state.scene.remove(state.object);
      disposeObject(state.object);
    }
    const palette = orbitalPalette(host.current!);
    const positive = new THREE.Color(palette.positive),
      negative = new THREE.Color(palette.negative);
    const geometry = new THREE.BufferGeometry();
    if (atom === "H") {
      const points = sampleHydrogen(hydrogen),
        positions: number[] = [],
        colors: number[] = [];
      const scale = hydrogen === "1s" ? 2.5 : 9;
      for (const p of points) {
        positions.push(p.x / scale, p.y / scale, p.z / scale);
        const color = p.phase > 0 ? positive : negative;
        colors.push(color.r, color.g, color.b);
      }
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      );
      state.object = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          size: 0.031,
          vertexColors: true,
          transparent: true,
          opacity: 0.62,
          depthWrite: false,
        }),
      );
    } else {
      const surface = ironAngularSurface(iron),
        colors: number[] = [];
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(surface.positions, 3),
      );
      geometry.setIndex(surface.indices);
      for (const phase of surface.phases) {
        const color = phase > 0 ? positive : negative;
        colors.push(color.r, color.g, color.b);
      }
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      );
      geometry.computeVertexNormals();
      state.object = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({
          vertexColors: true,
          side: THREE.DoubleSide,
          shininess: 35,
        }),
      );
    }
    state.scene.add(state.object);
    state.render();
  }, [atom, hydrogen, iron]);
  useEffect(() => {
    const state = engine.current;
    if (state) {
      state.camera.position.set(3.6, -4.8, 3);
      state.controls.target.set(0, 0, 0);
      state.controls.update();
      state.render();
    }
  }, [resetToken]);
  return (
    <div
      ref={host}
      className="orbital-scene"
      tabIndex={0}
      role="img"
      aria-label={t(
        "三维轨道；拖动旋转、滚轮缩放，或聚焦后用方向键旋转、加减键缩放、R复位",
        "3D orbital: drag to rotate and scroll to zoom; when focused, use arrow keys to rotate, plus/minus to zoom and R to reset",
      )}
    />
  );
}

export function OrbitalExplorer() {
  const { t } = useLanguage();
  const id = useId();
  const [atom, setAtom] = useState<Atom>("H");
  const [level, setLevel] = useState<Level>("shells");
  const [shell, setShell] = useState<number | null>(null);
  const [hydrogen, setHydrogen] = useState<HydrogenOrbital>("1s");
  const [iron, setIron] = useState<IronOrbital>("dz2");
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [unavailable, setUnavailable] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const fail = useCallback(() => {
    setUnavailable(true);
    setView("2d");
  }, []);
  const chooseAtom = (value: Atom) => {
    setAtom(value);
    setShell(null);
  };
  const levels: { value: Level; zh: string; en: string }[] = [
    { value: "shells", zh: "电子层", en: "Shells" },
    { value: "subshells", zh: "亚层与占据", en: "Subshells & filling" },
    { value: "shape", zh: "轨道形状", en: "Orbital shapes" },
  ];
  return (
    <section
      className="orbital-explorer"
      data-orbital-atom={atom}
      data-orbital-level={level}
      data-orbital-view={view}
      aria-labelledby={`${id}-heading`}
    >
      <div className="orbital-heading">
        <div>
          <p className="orbital-kicker">
            {t("逐层探索", "EXPLORE LAYER BY LAYER")}
          </p>
          <h3 id={`${id}-heading`}>
            {t("从电子层走进轨道", "From shells to orbitals")}
          </h3>
        </div>
        <div
          className="orbital-atom-switch"
          role="group"
          aria-label={t("选择原子", "Choose an atom")}
        >
          <button
            type="button"
            aria-pressed={atom === "H"}
            onClick={() => chooseAtom("H")}
          >
            <b>H</b> {t("氢原子", "Hydrogen")}
          </button>
          <button
            type="button"
            aria-pressed={atom === "Fe"}
            onClick={() => chooseAtom("Fe")}
          >
            <b>Fe</b> {t("铁原子", "Iron")}
          </button>
        </div>
      </div>
      <div
        className="orbital-stage-tabs"
        role="group"
        aria-label={t("探索层级", "Exploration level")}
      >
        {levels.map((item, index) => (
          <button
            type="button"
            key={item.value}
            aria-pressed={level === item.value}
            onClick={() => {
              setLevel(item.value);
              setShell(null);
            }}
          >
            <span>{index + 1}</span>
            {t(item.zh, item.en)}
          </button>
        ))}
      </div>
      <div className="orbital-context">
        <MathMarkdown>
          {atom === "H"
            ? t(
                "**自由氢原子**：基态组态 $1s^1$，共有 1 个电子。",
                "**An isolated hydrogen atom**: ground-state configuration $1s^1$, with one electron.",
              )
            : t(
                "**自由中性 Fe 原子**：基态组态 $[\\mathrm{Ar}]3d^64s^2$，共有 26 个电子。这里的分类与占据不等同于金属 Fe 的能带。",
                "**An isolated neutral Fe atom**: ground-state configuration $[\\mathrm{Ar}]3d^64s^2$, with 26 electrons. These populations do not describe the bands of metallic Fe.",
              )}
        </MathMarkdown>
      </div>
      {level === "shells" && (
        <div className="orbital-shells-panel">
          <p>
            {t(
              "按主量子数 n 分类，点击一层查看它包含的亚层。",
              "Group electrons by principal quantum number n. Select a shell to inspect its subshells.",
            )}
          </p>
          <div className="orbital-shells">
            {shellPopulation(atom).map((electrons, i) => (
              <button
                className="orbital-shell"
                type="button"
                key={i}
                onClick={() => {
                  setShell(i + 1);
                  setLevel("subshells");
                }}
                aria-label={t(
                  `第 ${i + 1} 电子层，${electrons} 个电子，查看亚层`,
                  `Shell ${i + 1}, ${electrons} electrons; inspect subshells`,
                )}
              >
                <span className="orbital-shell-label">n = {i + 1}</span>
                <strong>
                  {electrons}
                  <small> e⁻</small>
                </strong>
                <span className="orbital-electron-dots" aria-hidden="true">
                  {Array.from({ length: electrons }, (_, n) => (
                    <i key={n} />
                  ))}
                </span>
              </button>
            ))}
          </div>
          <p className="orbital-note">
            {t(
              "圆点只表示电子数目；它们不是电子的位置、轨迹，也不表示各层的真实间距。",
              "Dots count electrons. They do not show positions, trajectories, or the physical spacing between shells.",
            )}
          </p>
          <button
            className="orbital-next"
            type="button"
            onClick={() => setLevel("subshells")}
          >
            {t("下一层：亚层与占据 →", "Next: subshells and filling →")}
          </button>
        </div>
      )}
      {level === "subshells" && (
        <div className="orbital-subshells-panel">
          <div className="orbital-subheading">
            <p>
              {t(
                "每一格是一个空间轨道，每个箭头是一个电子的自旋标记。",
                "Each box represents one spatial orbital; each arrow labels an electron's spin.",
              )}
            </p>
            {shell !== null && (
              <button type="button" onClick={() => setShell(null)}>
                {t("查看全部亚层", "Show all subshells")}
              </button>
            )}
          </div>
          <div className="orbital-subshells">
            {GROUND_SUBSHELLS[atom]
              .filter((s) => shell === null || s.n === shell)
              .map((s) => (
                <div className="orbital-subshell" key={s.label}>
                  <span className="orbital-subshell-name">
                    <MathMarkdown
                      inlineMath
                    >{`${s.label}^{${s.electrons}}`}</MathMarkdown>
                  </span>
                  <div
                    className="orbital-boxes"
                    role="img"
                    aria-label={t(
                      `${s.label}：${s.electrons} 个电子，${2 * s.l + 1} 个空间轨道，${Math.min(s.electrons, 2 * s.l + 1)} 个向上自旋、${Math.max(0, s.electrons - (2 * s.l + 1))} 个向下自旋`,
                      `${s.label}: ${s.electrons} electrons in ${2 * s.l + 1} spatial orbitals; ${Math.min(s.electrons, 2 * s.l + 1)} spin-up and ${Math.max(0, s.electrons - (2 * s.l + 1))} spin-down`,
                    )}
                  >
                    {hundOccupancy(s.l, s.electrons).map((filling, index) => (
                      <span
                        className="orbital-box"
                        key={index}
                        aria-hidden="true"
                      >
                        {filling}
                      </span>
                    ))}
                  </div>
                  <span className="orbital-subshell-count">
                    {2 * s.l + 1} {t("个轨道", "orbitals")}
                  </span>
                </div>
              ))}
          </div>
          <MathMarkdown className="orbital-note">
            {atom === "Fe"
              ? t(
                  "$3d^6$ 的五个轨道先各有一个同向自旋，再配对一个电子。这里将配对画在第一格只是简并轨道基底的示意选择；表格按电子层分类，**不是固定的能级排序**。",
                  "For $3d^6$, five parallel spins occupy separate orbitals before one electron pairs. Pairing in the first box is a schematic choice within a degenerate basis. Rows are grouped by shell, **not a fixed energy ranking**.",
                )
              : t(
                  "氢基态只占据 $1s$。下一层也可选择 $2s$、$2p_z$ 激发本征态；这不意味着基态中已有电子占据它们。",
                  "Ground-state hydrogen occupies only $1s$. The next view also offers excited $2s$ and $2p_z$ eigenstates; they are not occupied in the ground state.",
                )}
          </MathMarkdown>
          <button
            className="orbital-next"
            type="button"
            onClick={() => setLevel("shape")}
          >
            {t("下一层：查看轨道形状 →", "Next: explore orbital shapes →")}
          </button>
        </div>
      )}
      {level === "shape" && (
        <div className="orbital-shapes-panel">
          <div className="orbital-shape-controls">
            <label htmlFor={`${id}-orbital`}>
              {t("选择轨道", "Select an orbital")}
            </label>
            {atom === "H" ? (
              <select
                id={`${id}-orbital`}
                value={hydrogen}
                onChange={(e) => setHydrogen(e.target.value as HydrogenOrbital)}
              >
                {HYDROGEN_ORBITALS.map((o) => (
                  <option key={o} value={o}>
                    {o === "2pz" ? "2p_z" : o}
                    {o === "1s"
                      ? t(" · 基态", " · ground state")
                      : t(" · 激发态", " · excited state")}
                  </option>
                ))}
              </select>
            ) : (
              <select
                id={`${id}-orbital`}
                value={iron}
                onChange={(e) => setIron(e.target.value as IronOrbital)}
              >
                {IRON_ORBITALS.map((o) => (
                  <option key={o} value={o}>
                    {o === "dz2"
                      ? "3d_z²"
                      : o === "dx2-y2"
                        ? "3d_x²−y²"
                        : `3${o.replace("d", "d_")}`}
                  </option>
                ))}
              </select>
            )}
            <div
              className="orbital-view-switch"
              role="group"
              aria-label={t("图示维度", "View dimension")}
            >
              <button
                type="button"
                aria-pressed={view === "2d"}
                onClick={() => setView("2d")}
              >
                2D
              </button>
              <button
                type="button"
                aria-pressed={view === "3d"}
                disabled={unavailable}
                onClick={() => setView("3d")}
              >
                3D
              </button>
            </div>
            {view === "3d" && (
              <button
                type="button"
                className="orbital-reset"
                onClick={() => setResetToken((n) => n + 1)}
              >
                {t("复位视角", "Reset view")}
              </button>
            )}
          </div>
          <div
            className={`orbital-visual-grid${atom === "Fe" ? " orbital-visual-single" : ""}`}
          >
            <figure className="orbital-figure">
              <div className="orbital-current">
                <MathMarkdown inlineMath>
                  {ORBITAL_LATEX[atom === "H" ? hydrogen : iron]}
                </MathMarkdown>
                <span>
                  {atom === "H"
                    ? view === "3d"
                      ? t("概率点云", "Probability cloud")
                      : t("空间密度截面", "Spatial-density section")
                    : t("角向振幅", "Angular amplitude")}
                </span>
              </div>
              <div className="orbital-viewport">
                {view === "2d" ? (
                  <OrbitalSlice atom={atom} hydrogen={hydrogen} iron={iron} />
                ) : (
                  <OrbitalScene
                    atom={atom}
                    hydrogen={hydrogen}
                    iron={iron}
                    resetToken={resetToken}
                    onUnavailable={fail}
                  />
                )}
              </div>
              <div className="orbital-legend">
                <span>
                  <i className="orbital-phase-positive" />
                  {t("正相位", "Positive phase")}
                </span>
                <span>
                  <i className="orbital-phase-negative" />
                  {t("负相位", "Negative phase")}
                </span>
                <span>
                  {t("颜色不是电荷正负", "Colors are not electrical charge")}
                </span>
              </div>
              <figcaption>
                <MathMarkdown>
                  {atom === "H"
                    ? view === "2d"
                      ? t(
                          "截面取 $y=0$；色相区分相位，深浅采用相对概率密度的对数色阶以显示较弱的尾部。",
                          "Section at $y=0$. Hue distinguishes phase; a logarithmic relative-density scale reveals weak tails.",
                        )
                      : t(
                          `散点按 $|\\psi|^2$ 抽样，仅显示 $r\\leq${HYDROGEN_EXTENT[hydrogen]}a_0$（包含超过 99.99% 的概率）。各轨道分别缩放以便观察，物理长度见径向图。点不是同时存在的电子，也不是运动轨迹。`,
                          `Points sample $|\\psi|^2$, shown for $r\\leq${HYDROGEN_EXTENT[hydrogen]}a_0$ (over 99.99% of probability). Each orbital is scaled for viewing; use the radial plot for physical distances. Points are not simultaneous electrons or trajectories.`,
                        )
                    : t(
                        "表面半径正比于 $|Y_{2m}|$，只展示角向振幅；它不是 Fe 的定量电子密度等值面，也不包含真实径向尺度。",
                        "Surface radius is proportional to $|Y_{2m}|$: angular amplitude only. This is not a quantitative Fe density isosurface and has no physical radial scale.",
                      )}
                </MathMarkdown>
              </figcaption>
              {view === "3d" && (
                <p className="orbital-help">
                  {t(
                    "拖动旋转 · 滚轮缩放。键盘聚焦图形后，方向键旋转，+/− 缩放，R 复位。",
                    "Drag to rotate · scroll to zoom. With the figure focused: arrows rotate, +/− zoom, R resets.",
                  )}
                </p>
              )}
            </figure>
            {atom === "H" && <RadialPlot orbital={hydrogen} />}
          </div>
          {unavailable && (
            <p className="orbital-note" role="status">
              {t(
                "当前设备的 3D 显示不可用，可继续探索 2D 截面。",
                "3D is unavailable on this device; the 2D sections remain available.",
              )}
            </p>
          )}
          {atom === "Fe" && (
            <MathMarkdown className="orbital-note">
              {iron === "dz2"
                ? t(
                    "$d_{z^2}$ 的三维形状含轴向双叶和赤道环，角节点为两个锥面。金属 Fe 的 $3d/4s$ 态会形成杂化能带，不能直接套用这张自由原子图。",
                    "$d_{z^2}$ has two axial lobes and an equatorial ring; its angular nodes are two cones. Metallic Fe has hybridized $3d/4s$ bands, so the isolated-atom picture cannot be copied directly.",
                  )
                : t(
                    "这里选用实 $d$ 轨道基底；相位整体反转不改变概率密度。多电子屏蔽、关联和晶体环境会改变真实 Fe 的径向分布与能级。",
                    "These are real $d$ basis functions. Reversing the overall phase leaves density unchanged. Screening, correlation and crystal surroundings change real Fe radial distributions and energies.",
                  )}
            </MathMarkdown>
          )}
        </div>
      )}
    </section>
  );
}
