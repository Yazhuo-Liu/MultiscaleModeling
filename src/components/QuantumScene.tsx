import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useLanguage } from "../i18n";
import type { SimulationFrame } from "../types";

export interface QuantumSceneProps {
  methodId: "dft" | "hf";
  frame: SimulationFrame;
  params: Record<string, number>;
  active: boolean;
  resetToken: number;
}

/** Fixed independent standard-normal samples. Scaling by 1/(2 sqrt(alpha))
 * samples n(r)=(2 alpha/pi)^(3/2) exp(-2 alpha r²) in all three dimensions.
 * Reusing the samples makes width comparisons legible without implying tracks. */
function gaussianSamples(count: number) {
  let seed = 29071;
  const uniform = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) + 0.5) / 4294967296;
  };
  const samples = new Float32Array(count * 3);
  for (let i = 0; i < samples.length; i += 2) {
    const radius = Math.sqrt(-2 * Math.log(uniform()));
    const angle = 2 * Math.PI * uniform();
    samples[i] = radius * Math.cos(angle);
    if (i + 1 < samples.length) samples[i + 1] = radius * Math.sin(angle);
  }
  return samples;
}

interface CloudScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  cloud: THREE.Points;
  reference: THREE.LineSegments;
  render: () => void;
}

function GaussianCloud({
  alpha,
  initialAlpha,
  showReference,
  active,
  resetToken,
  onUnavailable,
}: {
  alpha: number;
  initialAlpha: number;
  showReference: boolean;
  active: boolean;
  resetToken: number;
  onUnavailable: () => void;
}) {
  const { t } = useLanguage();
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<CloudScene | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const current = useRef({ alpha, initialAlpha, showReference });
  current.current = { alpha, initialAlpha, showReference };
  const samples = useMemo(() => gaussianSamples(3200), []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      onUnavailable();
      return;
    }
    const css = getComputedStyle(element);
    const color = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;
    renderer.setClearColor(color("--quantum-bg", "#f4f7fa"));
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(7, 4, 8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.minDistance = 4;
    controls.maxDistance = 20;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xabb6c7, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(3, 4, 6);
    scene.add(key);
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 24, 16),
      new THREE.MeshStandardMaterial({
        color: color("--quantum-nucleus", "#bc884a"),
        metalness: 0.25,
        roughness: 0.2,
        depthTest: false,
      }),
    );
    nucleus.renderOrder = 3;
    scene.add(nucleus);
    const dot = document.createElement("canvas");
    dot.width = dot.height = 48;
    const context = dot.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(24, 24, 1, 24, 24, 23);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.35, "rgba(255,255,255,.75)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 48, 48);
    }
    const texture = new THREE.CanvasTexture(dot);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(samples.slice(), 3),
    );
    const cloud = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: color("--quantum-cloud", "#7d69b5"),
        size: 0.085,
        map: texture,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    // A unit sphere means root-mean-square radius, not a hard cloud boundary.
    const wireGeometry = new THREE.SphereGeometry(1, 28, 14);
    const reference = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireGeometry),
      new THREE.LineBasicMaterial({
        color: color("--quantum-reference", "#99afb7"),
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    );
    wireGeometry.dispose();
    scene.add(cloud, reference);
    const axes = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-3.7, 0, 0),
        new THREE.Vector3(3.7, 0, 0),
        new THREE.Vector3(0, -3.7, 0),
        new THREE.Vector3(0, 3.7, 0),
        new THREE.Vector3(0, 0, -3.7),
        new THREE.Vector3(0, 0, 3.7),
      ]),
      new THREE.LineBasicMaterial({
        color: color("--quantum-reference", "#99afb7"),
        transparent: true,
        opacity: 0.18,
      }),
    );
    scene.add(axes);
    let pending = 0;
    let disposed = false;
    let renderCount = 0;
    const render = () => {
      if (disposed || pending || !activeRef.current || document.hidden) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        if (disposed || !activeRef.current || document.hidden) return;
        renderer.render(scene, camera);
        element.dataset.ready = "true";
        element.dataset.renderCount = String(++renderCount);
        element.dataset.camera = JSON.stringify(camera.position.toArray());
      });
    };
    const update = () => {
      cloud.scale.setScalar(1 / (2 * Math.sqrt(current.current.alpha)));
      reference.scale.setScalar(
        Math.sqrt(3 / (4 * current.current.initialAlpha)),
      );
      reference.visible = current.current.showReference;
      render();
    };
    state.current = {
      renderer,
      scene,
      camera,
      controls,
      cloud,
      reference,
      render,
    };
    controls.addEventListener("change", render);
    const resize = () => {
      renderer.setSize(
        Math.max(element.clientWidth, 220),
        Math.max(element.clientHeight, 280),
      );
      camera.aspect =
        Math.max(element.clientWidth, 220) /
        Math.max(element.clientHeight, 280);
      camera.updateProjectionMatrix();
      update();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const lost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    const keydown = (event: KeyboardEvent) => {
      const angle = new THREE.Spherical().setFromVector3(camera.position);
      if (event.key === "ArrowLeft") angle.theta -= 0.13;
      else if (event.key === "ArrowRight") angle.theta += 0.13;
      else if (event.key === "ArrowUp")
        angle.phi = Math.max(0.15, angle.phi - 0.13);
      else if (event.key === "ArrowDown")
        angle.phi = Math.min(Math.PI - 0.15, angle.phi + 0.13);
      else if (event.key === "+" || event.key === "=")
        angle.radius = Math.max(4, angle.radius * 0.9);
      else if (event.key === "-")
        angle.radius = Math.min(20, angle.radius * 1.1);
      else if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        camera.position.set(7, 4, 8);
        controls.target.set(0, 0, 0);
        controls.update();
        render();
        return;
      } else return;
      event.preventDefault();
      camera.position.setFromSpherical(angle);
      controls.update();
      render();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    element.addEventListener("keydown", keydown);
    document.addEventListener("visibilitychange", render);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(pending);
      observer.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      element.removeEventListener("keydown", keydown);
      document.removeEventListener("visibilitychange", render);
      texture.dispose();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          const values = Array.isArray(object.material)
            ? object.material
            : [object.material];
          values.forEach((material) => materials.add(material));
        }
      });
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      state.current = null;
    };
  }, [samples, onUnavailable]);

  useEffect(() => {
    const scene = state.current;
    if (!scene) return;
    scene.cloud.scale.setScalar(1 / (2 * Math.sqrt(alpha)));
    scene.reference.scale.setScalar(Math.sqrt(3 / (4 * initialAlpha)));
    scene.reference.visible = showReference;
    scene.render();
  }, [alpha, initialAlpha, showReference, active]);
  useEffect(() => {
    const scene = state.current;
    if (!scene) return;
    scene.camera.position.set(7, 4, 8);
    scene.controls.target.set(0, 0, 0);
    scene.controls.update();
    scene.render();
  }, [resetToken]);
  return (
    <div
      className="quantum-cloud-scene"
      ref={host}
      tabIndex={0}
      role="img"
      aria-label={t(
        "三维试探电子云；拖动或方向键旋转，正负号缩放",
        "Three-dimensional trial electron cloud; drag or use arrow keys to rotate, plus and minus to zoom",
      )}
      data-testid="quantum-cloud"
      data-alpha={alpha}
      data-sigma={1 / (2 * Math.sqrt(alpha))}
      data-point-count={3200}
      data-spatial-dimensions="3"
    />
  );
}

function DensitySection({
  alpha,
  initialAlpha,
  showReference,
}: {
  alpha: number;
  initialAlpha: number;
  showReference: boolean;
}) {
  const { t } = useLanguage();
  const id = `density-section-${useId().replaceAll(":", "")}`;
  const extent = 4;
  const radius = 142;
  return (
    <svg
      className="quantum-density-section"
      viewBox="0 0 560 360"
      role="img"
      aria-label={t(
        "穿过原子核的电子密度截面",
        "Electron density section through the nucleus",
      )}
      data-testid="quantum-density-section"
      data-alpha={alpha}
    >
      <defs>
        <radialGradient id={id} className="quantum-density-gradient">
          {Array.from({ length: 41 }, (_, i) => (
            <stop
              key={i}
              offset={i / 40}
              stopColor="currentColor"
              stopOpacity={Math.exp(-2 * alpha * ((extent * i) / 40) ** 2)}
            />
          ))}
        </radialGradient>
      </defs>
      <path d="M105 180 H455 M280 20 V340" className="quantum-section-axis" />
      <circle cx="280" cy="180" r={radius} fill={`url(#${id})`} />
      {showReference && (
        <circle
          cx="280"
          cy="180"
          r={(radius / extent) * Math.sqrt(3 / (4 * initialAlpha))}
          className="quantum-section-reference"
        />
      )}
      <circle cx="280" cy="180" r="6" className="quantum-nucleus" />
      <text x="280" y="347" textAnchor="middle">
        {t("深色：相对密度较高", "Darker: higher relative density")}
      </text>
      <text x="280" y="32" textAnchor="middle">
        {t("同一三维电子云的中心截面", "Central section of the same 3D cloud")}
      </text>
    </svg>
  );
}

function DensityScene({
  frame,
  params,
  active,
  resetToken,
}: Omit<QuantumSceneProps, "methodId">) {
  const { t } = useLanguage();
  const [view, setView] = useState<"3d" | "section">("3d");
  const [showReference, setShowReference] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const alpha = Math.max(
    0.001,
    frame.metrics[1]?.value ?? params.exponent ?? 0.3,
  );
  const initialAlpha = Math.max(0.1, params.exponent ?? 0.3);
  const initialEnergy =
    1.5 * initialAlpha -
    2 * (params.charge ?? 1) * Math.sqrt((2 * initialAlpha) / Math.PI);
  const energy = frame.metrics[0]?.value ?? initialEnergy;
  const radius = Math.sqrt(3 / (4 * alpha));
  const ratio = Math.sqrt(initialAlpha / alpha);
  const fail = useMemo(
    () => () => {
      setUnavailable(true);
      setView("section");
    },
    [],
  );
  return (
    <section
      className="phenomenon-scene quantum-scene quantum-density"
      data-method="dft"
      data-testid="phenomenon-dft"
      data-alpha={alpha}
      data-energy={energy}
      data-radius={radius}
      data-frame-time={frame.time}
    >
      <div className="quantum-toolbar">
        <span>
          {t("一个原子核，一团电子云", "One nucleus, one electron cloud")}
        </span>
        <div role="group" aria-label={t("电子云视图", "Electron-cloud view")}>
          <button
            data-testid="quantum-view-3d"
            aria-pressed={view === "3d"}
            disabled={unavailable}
            onClick={() => setView("3d")}
          >
            {t("3D 概率云", "3D cloud")}
          </button>
          <button
            data-testid="quantum-view-section"
            aria-pressed={view === "section"}
            onClick={() => setView("section")}
          >
            {t("中心截面", "Central section")}
          </button>
        </div>
      </div>
      <div className="quantum-cloud-wrap">
        {!unavailable && (
          <div hidden={view !== "3d"}>
            <GaussianCloud
              alpha={alpha}
              initialAlpha={initialAlpha}
              showReference={showReference}
              active={active && view === "3d"}
              resetToken={resetToken + cameraReset}
              onUnavailable={fail}
            />
          </div>
        )}
        {view === "section" && (
          <DensitySection
            alpha={alpha}
            initialAlpha={initialAlpha}
            showReference={showReference}
          />
        )}
        <div className="quantum-cloud-label">
          <i />
          {t("原子核", "Nucleus")}
        </div>
      </div>
      <div className="quantum-view-options">
        <label>
          <input
            type="checkbox"
            data-testid="quantum-initial-reference"
            checked={showReference}
            onChange={(event) => setShowReference(event.target.checked)}
          />
          {t("对照初始云团尺度", "Compare with initial cloud size")}
        </label>
        {view === "3d" && (
          <button
            data-testid="quantum-reset-view"
            onClick={() => setCameraReset((value) => value + 1)}
          >
            {t("复位视角", "Reset view")}
          </button>
        )}
      </div>
      <div className="quantum-summary" aria-live="off">
        <div>
          <span>
            {t("云团大小 · 相对起点", "Cloud size · relative to start")}
          </span>
          <strong>
            {(ratio * 100).toFixed(0)}
            <small>%</small>
          </strong>
        </div>
        <div>
          <span>{t("能量变化", "Energy change")}</span>
          <strong>
            {(energy - initialEnergy).toFixed(3)}
            <small>Ha</small>
          </strong>
        </div>
        <p>
          {frame.time === 0
            ? t(
                "运行后看云团如何调整，寻找能量更低的宽度。",
                "Run to see the cloud adjust toward a lower-energy width.",
              )
            : ratio < 0.995
              ? t(
                  "云团比起点更集中；同时观察能量的变化。",
                  "The cloud is more concentrated than at the start; compare the energy change too.",
                )
              : ratio > 1.005
                ? t(
                    "云团比起点更舒展；同时观察能量的变化。",
                    "The cloud is more spread out than at the start; compare the energy change too.",
                  )
                : t(
                    "云团的宽度已经接近起点，能量是否还在变化？",
                    "Its width is close to the starting value. Is the energy still changing?",
                  )}
        </p>
      </div>
      <p className="quantum-note">
        {t(
          "点表示一个电子可能出现的位置，不是许多电子或运动轨迹；浅色参考球表示初始均方根半径，不是云团边界。",
          "Points represent possible positions of one electron, not many electrons or trajectories. The pale reference sphere marks the initial root-mean-square radius, not a cloud boundary.",
        )}
      </p>
      <p className="quantum-note">
        {unavailable
          ? t(
              "3D 显示不可用，已显示同一分布的中心截面。",
              "3D is unavailable; showing a central section of the same distribution.",
            )
          : view === "3d"
            ? t("拖动旋转 · 滚轮缩放。", "Drag to rotate · scroll to zoom.")
            : ""}{" "}
        {t(
          "这是单电子变分示例；优化迭代不是物理时间，也不是完整 DFT 求解。",
          "This is a one-electron variational example; optimization steps are not physical time or a full DFT calculation.",
        )}
      </p>
    </section>
  );
}

function MeanFieldScene({
  frame,
  params,
  resetToken,
}: Omit<QuantumSceneProps, "methodId">) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<0 | 1>(0);
  const id = `mean-field-${useId().replaceAll(":", "")}`;
  const occupation = [
    frame.metrics[0]?.value ?? 1,
    frame.metrics[1]?.value ?? 1,
  ];
  const interaction = params.interaction ?? 2;
  const bias = params.bias ?? 1;
  const bare = [-bias / 2, bias / 2];
  const repulsion = occupation.map((value) => (interaction * value) / 2);
  const effective = bare.map((value, i) => value + repulsion[i]);
  const residual = frame.metrics[3]?.value ?? 0;
  const balanced = Math.abs(occupation[0] - occupation[1]) < 0.01;
  useEffect(() => setSelected(0), [resetToken]);
  return (
    <section
      className="phenomenon-scene quantum-scene quantum-mean-field"
      data-method="hf"
      data-testid="phenomenon-hf"
      data-occupation-a={occupation[0]}
      data-occupation-b={occupation[1]}
      data-energy-a={effective[0]}
      data-energy-b={effective[1]}
      data-selected-site={selected === 0 ? "A" : "B"}
      data-frame-time={frame.time}
    >
      <div className="quantum-toolbar">
        <span>
          {t(
            "选择一个位置，看看它为何吸引电子",
            "Choose a site to inspect what attracts electrons",
          )}
        </span>
        <div role="group" aria-label={t("检查位置", "Inspect a site")}>
          {([0, 1] as const).map((site) => (
            <button
              key={site}
              data-testid={`hf-site-${site === 0 ? "a" : "b"}`}
              aria-pressed={selected === site}
              onClick={() => setSelected(site)}
            >
              {t("位置", "Site")} {site === 0 ? "A" : "B"}
            </button>
          ))}
        </div>
      </div>
      <svg
        className="quantum-hf-diagram"
        viewBox="0 0 720 350"
        role="img"
        aria-label={t(
          "两位置平均场：圆面积表示电子数，能级横线表示各位置的局部有效能量",
          "Two-site mean field: circle area represents electron occupation; levels mark each site's local effective energy",
        )}
      >
        <defs>
          {["a", "b"].map((site) => (
            <radialGradient
              id={`${id}-${site}`}
              key={site}
              className={`quantum-site-${site}`}
            >
              <stop offset="0" stopColor="currentColor" stopOpacity=".75" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".3" />
            </radialGradient>
          ))}
        </defs>
        <path d="M263 134 H457" className="quantum-site-link" />
        <path
          d="M340 127 l12 7 -12 7 M380 127 l-12 7 12 7"
          className="quantum-coupling"
        />
        {([0, 1] as const).map((site) => {
          const x = site === 0 ? 205 : 515;
          const energyY = 282 - effective[site] * 8;
          return (
            <g
              key={site}
              className={`quantum-site-graphic quantum-site-${site === 0 ? "a" : "b"} ${selected === site ? "is-selected" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={t(
                `检查位置 ${site === 0 ? "A" : "B"}，平均 ${occupation[site].toFixed(2)} 个电子`,
                `Inspect site ${site === 0 ? "A" : "B"}, average occupation ${occupation[site].toFixed(2)}`,
              )}
              onClick={() => setSelected(site)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelected(site);
                }
              }}
            >
              <circle cx={x} cy="134" r="86" className="quantum-site-halo" />
              <circle
                cx={x}
                cy="134"
                r="56"
                className="quantum-one-electron-reference"
              />
              <circle
                cx={x}
                cy="134"
                r={56 * Math.sqrt(Math.max(0, occupation[site]))}
                fill={`url(#${id}-${site === 0 ? "a" : "b"})`}
                className="quantum-occupation-disc"
              />
              <circle cx={x} cy="134" r="7" className="quantum-site-center" />
              <text
                x={x}
                y="47"
                textAnchor="middle"
                className="quantum-site-title"
              >
                {t("位置", "Site")} {site === 0 ? "A" : "B"}
              </text>
              <text
                x={x}
                y="234"
                textAnchor="middle"
                className="quantum-occupation-label"
              >
                {occupation[site].toFixed(2)} {t("个电子", "electrons")}
              </text>
              <path
                d={`M${x - 72} 282 H${x + 72}`}
                className="quantum-zero-level"
              />
              <path
                d={`M${x - 65} ${energyY} H${x + 65}`}
                className="quantum-energy-level"
              />
              <text x={x} y="330" textAnchor="middle">
                {t("局部能量", "Local energy")} {effective[site].toFixed(2)}
              </text>
            </g>
          );
        })}
        <text
          x="360"
          y="95"
          textAnchor="middle"
          className="quantum-coupling-label"
        >
          {t("彼此影响", "Coupled sites")}
        </text>
      </svg>
      <div
        className="quantum-occupation-total"
        aria-label={t(
          "两个电子在两位置的分配",
          "Distribution of two electrons over two sites",
        )}
      >
        <svg
          viewBox="0 0 600 18"
          role="img"
          aria-label={t(
            `位置 A 占 ${Math.round((occupation[0] / 2) * 100)}%，位置 B 占 ${Math.round((occupation[1] / 2) * 100)}%`,
            `Site A holds ${Math.round((occupation[0] / 2) * 100)} percent, site B ${Math.round((occupation[1] / 2) * 100)} percent`,
          )}
        >
          <rect
            width={300 * occupation[0]}
            height="18"
            rx="5"
            className="quantum-share-a"
          />
          <rect
            x={300 * occupation[0]}
            width={300 * occupation[1]}
            height="18"
            rx="5"
            className="quantum-share-b"
          />
        </svg>
        <span>{t("电子总数始终为 2", "The total stays at 2 electrons")}</span>
      </div>
      <div className="quantum-inspection" data-testid="hf-site-inspection">
        <h4>
          {t("正在检查位置", "Inspecting site")} {selected === 0 ? "A" : "B"}
        </h4>
        <div>
          <span>{t("原有位置能量", "Bare site energy")}</span>
          <strong>{bare[selected].toFixed(2)}</strong>
        </div>
        <div>
          <span>{t("平均排斥带来的抬升", "Raise from mean repulsion")}</span>
          <strong>+{repulsion[selected].toFixed(2)}</strong>
        </div>
        <div>
          <span>{t("合起来的局部能量", "Combined local energy")}</span>
          <strong>{effective[selected].toFixed(2)}</strong>
        </div>
        <p>
          {t(
            "能量单位取跳跃耦合；这些是模型里的局部能量，不是孤立原子的轨道能级。",
            "Energies use the hopping coupling as the unit. These local model energies are not isolated-atom orbital levels.",
          )}
        </p>
      </div>
      <ol className="quantum-scf-loop">
        <li>{t("分配电子", "Distribute electrons")}</li>
        <li>{t("更新平均影响", "Update the mean field")}</li>
        <li>{t("重新分配并比较", "Redistribute and compare")}</li>
      </ol>
      <p className="quantum-state">
        <strong>
          {residual < 0.002
            ? t("前后分配已接近一致", "Successive distributions nearly agree")
            : t("分布尚未稳定", "The distribution has not settled yet")}
        </strong>
        {" · "}
        {balanced
          ? t("目前两边接近均衡", "Both sides are nearly balanced")
          : occupation[0] > occupation[1]
            ? t("目前更偏向 A", "Currently favoring A")
            : t("目前更偏向 B", "Currently favoring B")}
      </p>
      <p className="quantum-note">
        {t(
          "圆的面积表示平均电子数，不是轨道形状或电子运动。先选场景，再运行自洽迭代；这里是两位置 Hubbard 平均场示例。",
          "Circle area represents average occupation, not orbital shape or electron motion. Choose a scene, then run the self-consistent iteration. This is a two-site Hubbard mean-field example.",
        )}
      </p>
    </section>
  );
}

export default function QuantumScene(props: QuantumSceneProps) {
  return props.methodId === "dft" ? (
    <DensityScene {...props} />
  ) : (
    <MeanFieldScene {...props} />
  );
}
