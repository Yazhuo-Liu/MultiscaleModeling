import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { useLanguage } from "../i18n";
import type { SimulationFrame } from "../types";

interface Props {
  methodId: "constitutive" | "fem" | "fdm";
  frame: SimulationFrame;
  params: Record<string, number>;
  active: boolean;
  resetToken: number;
}
const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));
const finite = (n: number | undefined, fallback = 0) =>
  n !== undefined && Number.isFinite(n) ? n : fallback;
const number = (value: number, places = 3) =>
  Math.abs(value) > 0 && Math.abs(value) < 0.0001
    ? value.toExponential(2)
    : Number(value.toFixed(places)).toString();
const activate = (event: KeyboardEvent<SVGGElement>, callback: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
};

function MaxwellScene({ frame, params, resetToken }: Props) {
  const { t } = useLanguage();
  const id = `maxwell-${useId().replaceAll(":", "")}`;
  const [selected, setSelected] = useState<"spring" | "dashpot">("spring");
  useEffect(() => setSelected("spring"), [resetToken]);
  const totalStrain = finite(frame.metrics[1]?.value, 0.02);
  const modulus = Math.max(1e-12, finite(params.modulus, 100));
  const stress = Math.max(0, finite(frame.metrics[0]?.value));
  const elasticStrain = clamp(stress / modulus, 0, totalStrain);
  const viscousStrain = totalStrain - elasticStrain;
  const fraction = totalStrain ? elasticStrain / totalStrain : 0;
  // Both grips remain fixed. As the spring shortens, the cylinder attached to
  // its right end moves left relative to the fixed piston, extending the dashpot.
  const junction = 310 + 80 * fraction;
  const coilStart = 118;
  const coilEnd = junction - 22;
  const coil = Array.from({ length: 13 }, (_, i) => {
    const x = coilStart + ((coilEnd - coilStart) * i) / 12;
    const y = i === 0 || i === 12 ? 155 : i % 2 ? 130 : 180;
    return `${i ? "L" : "M"}${x.toFixed(3)} ${y}`;
  }).join(" ");
  return (
    <section
      className="phenomenon-scene continuum-scene maxwell-scene"
      data-method="constitutive"
      data-testid="phenomenon-constitutive"
      data-elastic-strain={elasticStrain}
      data-viscous-strain={viscousStrain}
      data-stress={stress}
      data-selected={selected}
    >
      <div className="continuum-scene-heading">
        <h3>
          {t(
            "长度锁住了，拉力为什么还会变小？",
            "Why does the force fall when the length is fixed?",
          )}
        </h3>
        <span>{t("Maxwell 弹簧—黏性元件", "Maxwell spring and dashpot")}</span>
      </div>
      <svg
        viewBox="0 0 800 330"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        className="continuum-svg"
      >
        <title id={`${id}-title`}>
          {t("固定伸长下的应力松弛", "Stress relaxation at fixed extension")}
        </title>
        <desc id={`${id}-desc`}>
          {t(
            "两个夹具固定。弹簧的伸长逐渐减小，黏性元件的伸长逐渐增加，两者之和不变。",
            "Both grips stay fixed. Spring extension decreases while dashpot extension increases; their sum stays constant.",
          )}
        </desc>
        <defs>
          <pattern
            id={`${id}-grip`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 10L10 0" className="continuum-grip-hatch" />
          </pattern>
        </defs>
        <path
          d="M90 72H700M90 62V82M700 62V82"
          className="continuum-dimension"
        />
        <text
          x="395"
          y="53"
          textAnchor="middle"
          className="continuum-svg-label"
        >
          {t("总伸长保持不变", "Total extension held fixed")}
        </text>
        <rect
          x="67"
          y="105"
          width="23"
          height="100"
          fill={`url(#${id}-grip)`}
          className="continuum-grip"
        />
        <rect
          x="700"
          y="105"
          width="23"
          height="100"
          fill={`url(#${id}-grip)`}
          className="continuum-grip"
        />
        <path d="M90 155H118" className="continuum-connector" />
        <g
          role="button"
          tabIndex={0}
          onClick={() => setSelected("spring")}
          onKeyDown={(e) => activate(e, () => setSelected("spring"))}
          aria-label={t("查看弹簧承担的伸长", "Inspect spring extension")}
          className={`continuum-pick ${selected === "spring" ? "is-selected" : ""}`}
        >
          <rect
            x="102"
            y="112"
            width={junction - 93}
            height="88"
            rx="13"
            className="continuum-selection-surface"
          />
          <path
            d={coil}
            className="maxwell-spring"
            data-testid="maxwell-spring"
          />
          <path
            d={`M${coilEnd} 155H${junction}`}
            className="continuum-connector"
          />
        </g>
        <circle cx={junction} cy="155" r="5" className="continuum-junction" />
        <g
          role="button"
          tabIndex={0}
          onClick={() => setSelected("dashpot")}
          onKeyDown={(e) => activate(e, () => setSelected("dashpot"))}
          aria-label={t("查看黏性元件承担的伸长", "Inspect dashpot extension")}
          className={`continuum-pick ${selected === "dashpot" ? "is-selected" : ""}`}
        >
          <rect
            x={junction + 8}
            y="110"
            width={686 - junction}
            height="90"
            rx="13"
            className="continuum-selection-surface"
          />
          <path
            d={`M${junction} 155H${junction + 25}M${junction + 265} 119H${junction + 25}V191H${junction + 265}`}
            className="maxwell-cylinder"
          />
          <rect
            x={junction + 28}
            y="123"
            width={Math.max(0, 548 - (junction + 28))}
            height="64"
            className="maxwell-fluid"
          />
          <path d="M550 125V185M550 155H700" className="maxwell-piston" />
        </g>
        <text
          x="220"
          y="235"
          textAnchor="middle"
          className="continuum-svg-label"
        >
          {t("弹簧回缩", "Spring relaxes")}
        </text>
        <text
          x="555"
          y="235"
          textAnchor="middle"
          className="continuum-svg-label"
        >
          {t("黏性元件伸长", "Dashpot extends")}
        </text>
        <rect
          x="90"
          y="265"
          width="610"
          height="18"
          rx="9"
          className="maxwell-part-track"
        />
        <rect
          x="90"
          y="265"
          width={610 * fraction}
          height="18"
          rx="9"
          className="maxwell-elastic-part"
        />
        <text x="90" y="311" className="continuum-svg-caption">
          {t("弹性部分", "Elastic part")}
        </text>
        <text
          x="700"
          y="311"
          textAnchor="end"
          className="continuum-svg-caption"
        >
          {t("黏性部分", "Viscous part")}
        </text>
      </svg>
      <div
        className="continuum-choice-row"
        role="group"
        aria-label={t("查看元件", "Inspect a component")}
      >
        <button
          data-testid="maxwell-select-spring"
          aria-pressed={selected === "spring"}
          onClick={() => setSelected("spring")}
        >
          {t("弹簧", "Spring")}
        </button>
        <button
          data-testid="maxwell-select-dashpot"
          aria-pressed={selected === "dashpot"}
          onClick={() => setSelected("dashpot")}
        >
          {t("黏性元件", "Dashpot")}
        </button>
      </div>
      <div className="continuum-inspector">
        <p>
          {selected === "spring"
            ? t(
                "弹簧储存弹性能。它逐渐回缩，因此维持同样总长度所需的拉力下降。",
                "The spring stores elastic energy. As it relaxes, less force is needed to hold the same total length.",
              )
            : t(
                "黏性元件逐渐承担更多伸长，补上弹簧回缩的部分。两个夹具之间的距离始终不变。",
                "The dashpot gradually takes up more extension as the spring relaxes. The distance between the grips stays fixed.",
              )}
        </p>
        <div className="continuum-readout-row">
          <span>
            {t("弹性应变", "Elastic strain")}
            <strong>{number(100 * elasticStrain)}%</strong>
          </span>
          <span>
            {t("黏性应变", "Viscous strain")}
            <strong>{number(100 * viscousStrain)}%</strong>
          </span>
          <span>
            {t("当前应力", "Current stress")}
            <strong>{number(stress)} MPa</strong>
          </span>
        </div>
      </div>
      <p className="continuum-model-caption">
        {t(
          "夹具固定，总应变为 2%；元件伸长为放大示意。蓝绿色和金色表示两种应变分担，不是两种材料。",
          "Grips are fixed at 2% total strain; component extensions are exaggerated. Teal and gold show the two strain contributions, not two materials.",
        )}
      </p>
    </section>
  );
}

function BarScene({ frame, resetToken }: Props) {
  const { t } = useLanguage();
  const uid = `bar-${useId().replaceAll(":", "")}`;
  const [selected, setSelected] = useState(20);
  const [mesh, setMesh] = useState(true);
  const [reference, setReference] = useState(true);
  useEffect(() => {
    setSelected(20);
    setMesh(true);
    setReference(true);
  }, [resetToken]);
  const displacements =
    frame.curves?.[0]?.points.map((p) => p[1]) ?? Array(21).fill(0);
  const count = Math.max(1, displacements.length - 1);
  const node = clamp(selected, 0, count);
  const nodeX = (i: number) =>
    100 + 480 * (i / count + finite(displacements[i]) * 1e-6 * 10000);
  const endpoint = nodeX(count);
  const selectedX = nodeX(node);
  const u = finite(displacements[node]);
  const load = finite(frame.metrics[1]?.value);
  return (
    <section
      className="phenomenon-scene continuum-scene bar-scene"
      data-method="fem"
      data-testid="phenomenon-fem"
      data-selected-node={node}
      data-displacement={u}
      data-end-displacement={finite(displacements[count])}
    >
      <div className="continuum-scene-heading">
        <h3>
          {t(
            "把一根杆分成小段，看看哪里移动了",
            "Divide a bar into elements and inspect its motion",
          )}
        </h3>
        <span>{t("一维轴向拉伸", "One-dimensional axial tension")}</span>
      </div>
      <svg
        viewBox="0 0 800 330"
        role="img"
        aria-labelledby={`${uid}-title ${uid}-desc`}
        className="continuum-svg"
      >
        <title id={`${uid}-title`}>
          {t(
            "左端固定、右端受拉的有限元杆",
            "A finite-element bar fixed on the left and pulled on the right",
          )}
        </title>
        <desc id={`${uid}-desc`}>
          {t(
            "杆被分成20个单元。点击节点查看位移，虚线表示原始长度。显示位移放大一万倍。",
            "The bar has 20 elements. Select a node to inspect displacement; the dashed outline shows the original length. Displacement is magnified 10,000 times.",
          )}
        </desc>
        <defs>
          <pattern
            id={`${uid}-grip`}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 10L10 0" className="continuum-grip-hatch" />
          </pattern>
        </defs>
        <text x="100" y="48" className="continuum-svg-label">
          {t("固定端", "Fixed end")}
        </text>
        <text x="700" y="48" textAnchor="end" className="continuum-svg-label">
          {t("缓慢增加拉力", "Gradually increase the pull")}
        </text>
        <rect
          x="78"
          y="88"
          width="22"
          height="124"
          fill={`url(#${uid}-grip)`}
          className="continuum-grip"
        />
        {Array.from({ length: count }, (_, i) => (
          <rect
            key={i}
            x={nodeX(i)}
            y="120"
            width={Math.max(0, nodeX(i + 1) - nodeX(i))}
            height="60"
            className={`bar-element ${mesh ? "show-mesh" : ""}`}
          />
        ))}
        {reference && (
          <rect
            x="100"
            y="120"
            width="480"
            height="60"
            rx="3"
            className="bar-reference"
            data-testid="fem-reference"
          />
        )}
        <path
          d={`M${endpoint} 150H${endpoint + 57}m-12 -9l12 9 -12 9`}
          className="bar-load-arrow"
        />
        {load > 0 && (
          <text
            x={endpoint + 25}
            y="105"
            textAnchor="middle"
            className="continuum-svg-caption"
          >
            {number(load, 1)} N
          </text>
        )}
        {mesh &&
          Array.from({ length: count + 1 }, (_, i) => (
            <g
              key={i}
              role="button"
              tabIndex={0}
              className="bar-node-button"
              data-testid={`fem-node-${i}`}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => activate(e, () => setSelected(i))}
              aria-label={t(
                `节点 ${i}，位移 ${number(finite(displacements[i]))} 微米`,
                `Node ${i}, displacement ${number(finite(displacements[i]))} micrometres`,
              )}
            >
              <circle
                cx={nodeX(i)}
                cy="150"
                r="13"
                className="bar-node-target"
              />
              <circle
                cx={nodeX(i)}
                cy="150"
                r={i === node ? 7 : 3.5}
                className={`bar-node ${i === node ? "is-selected" : ""}`}
              />
            </g>
          ))}
        <path d={`M${selectedX} 190V225`} className="continuum-dimension" />
        <circle cx={selectedX} cy="180" r="4" className="continuum-junction" />
        <text
          x={selectedX}
          y="249"
          textAnchor="middle"
          className="continuum-svg-label"
        >
          {t(`节点 ${node}`, `Node ${node}`)}
        </text>
        <path
          d="M100 290H580M100 281V299M580 281V299"
          className="continuum-dimension"
        />
        <text
          x="340"
          y="318"
          textAnchor="middle"
          className="continuum-svg-caption"
        >
          {t("原始杆长 1 m", "Original bar length 1 m")}
        </text>
      </svg>
      <div className="continuum-display-controls">
        <label>
          <input
            type="checkbox"
            data-testid="fem-show-mesh"
            checked={mesh}
            onChange={(e) => setMesh(e.target.checked)}
          />
          {t("显示单元与节点", "Show elements and nodes")}
        </label>
        <label>
          <input
            type="checkbox"
            data-testid="fem-show-reference"
            checked={reference}
            onChange={(e) => setReference(e.target.checked)}
          />
          {t("对照未变形轮廓", "Show undeformed outline")}
        </label>
      </div>
      <div className="continuum-inspector">
        <label className="continuum-range">
          <span>
            {t("移动探针到另一个节点", "Move the probe to another node")}
            <strong>
              {node} / {count}
            </strong>
          </span>
          <input
            data-testid="fem-node-select"
            aria-label={t("选择杆节点", "Select a bar node")}
            type="range"
            min="0"
            max={count}
            step="1"
            value={node}
            onChange={(e) => setSelected(Number(e.target.value))}
          />
        </label>
        <div className="continuum-readout-row">
          <span>
            {t("原始位置", "Original position")}
            <strong>{number(node / count, 2)} m</strong>
          </span>
          <span>
            {t("节点位移", "Node displacement")}
            <strong>{number(u)} μm</strong>
          </span>
          <span>
            {t("当前拉力", "Applied force")}
            <strong>{number(load, 1)} N</strong>
          </span>
        </div>
      </div>
      <p className="continuum-model-caption">
        {t(
          "位移放大 10,000 倍以便观察；模型只求解杆的轴向运动。单元分界不是裂纹，播放表示静力加载进度。",
          "Displacement is magnified 10,000 times for visibility. The model solves only axial motion. Element boundaries are not cracks; playback shows quasistatic loading progress.",
        )}
      </p>
    </section>
  );
}

function useCompactScene() {
  const [compact, setCompact] = useState(
    () => matchMedia("(max-width: 700px)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(max-width: 700px)");
    const changed = () => setCompact(query.matches);
    query.addEventListener("change", changed);
    return () => query.removeEventListener("change", changed);
  }, []);
  return compact;
}

function HeatScene({ frame, params, resetToken }: Props) {
  const compact = useCompactScene();
  const { t } = useLanguage();
  const uid = `heat-${useId().replaceAll(":", "")}`;
  const field = frame.grid ?? {
    width: 32,
    height: 32,
    values: Array<number>(1024).fill(0),
  };
  const [probe, setProbe] = useState({ x: 16, y: 16 });
  const [grid, setGrid] = useState(false);
  useEffect(() => {
    setProbe({ x: 16, y: 16 });
    setGrid(false);
  }, [resetToken]);
  const px = clamp(probe.x, 0, field.width - 1),
    py = clamp(probe.y, 0, field.height - 1);
  const temperature = finite(field.values[py * field.width + px]);
  const peak = finite(frame.metrics[0]?.value);
  const maximum = Math.max(0.00001, finite(params.source, 1));
  const fraction = clamp(temperature / maximum, 0, 1);
  const left = 165,
    top = 65,
    side = 320;
  const cellWidth = side / field.width,
    cellHeight = side / field.height;
  const color = (value: number) => {
    const a = clamp(value / maximum, 0, 1);
    return a < 0.5
      ? `color-mix(in srgb, var(--heat-cold) ${100 - 200 * a}%, var(--heat-mid))`
      : `color-mix(in srgb, var(--heat-hot) ${200 * a - 100}%, var(--heat-mid))`;
  };
  const select = (x: number, y: number) =>
    setProbe({
      x: clamp(x, 0, field.width - 1),
      y: clamp(y, 0, field.height - 1),
    });
  return (
    <section
      className="phenomenon-scene continuum-scene heat-scene"
      data-method="fdm"
      data-testid="phenomenon-fdm"
      data-probe-x={px}
      data-probe-y={py}
      data-probe-temperature={temperature}
      data-peak={peak}
    >
      <div className="continuum-scene-heading">
        <h3>
          {t(
            "热斑会散开，也会慢慢冷下来",
            "A hot spot spreads and gradually cools",
          )}
        </h3>
        <span>
          {t("点击热板放置温度探针", "Place a temperature probe on the plate")}
        </span>
      </div>
      <svg
        viewBox={compact ? "130 0 390 420" : "0 0 800 455"}
        className="continuum-svg"
        role="img"
        aria-labelledby={`${uid}-title ${uid}-desc`}
      >
        <title id={`${uid}-title`}>
          {t(
            "带冷边界的二维热板",
            "A two-dimensional plate with cold boundaries",
          )}
        </title>
        <desc id={`${uid}-desc`}>
          {t(
            "中心热斑扩散到周围，四边维持零约化温度。点击热板或使用探针控件查看某个网格点的温度。",
            "The central hot spot spreads while all four edges remain at zero reduced temperature. Click the plate or use probe controls to read a grid point.",
          )}
        </desc>
        <defs>
          <linearGradient id={`${uid}-scale`} x1="0" x2="0" y1="1" y2="0">
            <stop offset="0" className="heat-stop-cold" />
            <stop offset=".5" className="heat-stop-mid" />
            <stop offset="1" className="heat-stop-hot" />
          </linearGradient>
        </defs>
        <rect
          x={left - 9}
          y={top - 9}
          width={side + 18}
          height={side + 18}
          rx="9"
          className="heat-cold-frame"
        />
        <g
          data-testid="heat-plate"
          role="slider"
          tabIndex={0}
          aria-label={t(
            "温度探针：方向键移动，Home 回到中心",
            "Temperature probe: arrow keys move; Home returns to the centre",
          )}
          aria-valuemin={0}
          aria-valuemax={maximum}
          aria-valuenow={temperature}
          aria-valuetext={t(
            `格点 ${px}, ${py}，温度 ${number(temperature)}，约化单位`,
            `Grid point ${px}, ${py}; temperature ${number(temperature)} in reduced units`,
          )}
          className="heat-plate-target"
          onClick={(event) => {
            const svg = event.currentTarget.ownerSVGElement;
            if (!svg) return;
            const point = svg.createSVGPoint();
            point.x = event.clientX;
            point.y = event.clientY;
            const matrix = svg.getScreenCTM();
            if (!matrix) return;
            const at = point.matrixTransform(matrix.inverse());
            select(
              Math.floor((at.x - left) / cellWidth),
              Math.floor((at.y - top) / cellHeight),
            );
          }}
          onKeyDown={(event) => {
            if (event.key === "Home") {
              event.preventDefault();
              select(Math.floor(field.width / 2), Math.floor(field.height / 2));
            } else if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                event.key,
              )
            ) {
              event.preventDefault();
              select(
                px +
                  (event.key === "ArrowRight"
                    ? 1
                    : event.key === "ArrowLeft"
                      ? -1
                      : 0),
                py +
                  (event.key === "ArrowDown"
                    ? 1
                    : event.key === "ArrowUp"
                      ? -1
                      : 0),
              );
            }
          }}
        >
          {field.values.map((value, i) => (
            <rect
              key={i}
              x={left + (i % field.width) * cellWidth}
              y={top + Math.floor(i / field.width) * cellHeight}
              width={cellWidth + 0.04}
              height={cellHeight + 0.04}
              fill={color(value)}
              className={grid ? "heat-cell show-grid" : "heat-cell"}
            />
          ))}
          <rect
            x={left}
            y={top}
            width={side}
            height={side}
            className="heat-plate-border"
          />
        </g>
        <g className="heat-probe-mark" pointerEvents="none">
          <path
            d={`M${left + (px + 0.5) * cellWidth - 14} ${top + (py + 0.5) * cellHeight}h28M${left + (px + 0.5) * cellWidth} ${top + (py + 0.5) * cellHeight - 14}v28`}
          />
          <circle
            data-testid="heat-probe"
            cx={left + (px + 0.5) * cellWidth}
            cy={top + (py + 0.5) * cellHeight}
            r="8"
          />
        </g>
        <text
          x={left + side / 2}
          y="32"
          textAnchor="middle"
          className="continuum-svg-label"
        >
          {t("四条边始终保持冷温", "All four edges stay cold")}
        </text>
        {!compact && (
          <>
            <text
              x={left + side / 2}
              y="427"
              textAnchor="middle"
              className="continuum-svg-caption"
            >
              {t(
                "颜色范围固定，冷却不会被自动缩放掩盖",
                "A fixed colour scale keeps cooling visible",
              )}
            </text>
            <rect
              x="575"
              y="89"
              width="40"
              height="258"
              rx="20"
              className="heat-thermometer-track"
            />
            <rect
              x="580"
              y={342 - 248 * fraction}
              width="30"
              height={248 * fraction}
              rx="15"
              fill={color(temperature)}
            />
            <circle
              cx="595"
              cy="353"
              r="23"
              fill={color(temperature)}
              className="heat-thermometer-bulb"
            />
            <text
              x="595"
              y="60"
              textAnchor="middle"
              className="continuum-svg-label"
            >
              {t("探针温度", "Probe")}
            </text>
            <text
              x="595"
              y="408"
              textAnchor="middle"
              className="continuum-svg-label"
            >
              {number(temperature)}
            </text>
            <rect
              x="669"
              y="89"
              width="14"
              height="258"
              rx="7"
              fill={`url(#${uid}-scale)`}
            />
            <text x="698" y="103" className="continuum-svg-caption">
              {number(maximum)}
            </text>
            <text x="698" y="350" className="continuum-svg-caption">
              0
            </text>
          </>
        )}
      </svg>
      <div className="continuum-display-controls">
        <label>
          <input
            data-testid="heat-show-grid"
            type="checkbox"
            checked={grid}
            onChange={(e) => setGrid(e.target.checked)}
          />
          {t("显示计算网格", "Show the calculation grid")}
        </label>
        <button
          className="continuum-small-button"
          onClick={() =>
            select(Math.floor(field.width / 2), Math.floor(field.height / 2))
          }
        >
          {t("探针回到中心", "Centre the probe")}
        </button>
      </div>
      <div className="continuum-inspector">
        <div className="heat-probe-controls">
          <label className="continuum-range">
            <span>
              {t("探针横向位置", "Probe column")}
              <strong>{px}</strong>
            </span>
            <input
              data-testid="heat-probe-x"
              type="range"
              min="0"
              max={field.width - 1}
              step="1"
              value={px}
              onChange={(e) => select(Number(e.target.value), py)}
            />
          </label>
          <label className="continuum-range">
            <span>
              {t("探针纵向位置", "Probe row")}
              <strong>{py}</strong>
            </span>
            <input
              data-testid="heat-probe-y"
              type="range"
              min="0"
              max={field.height - 1}
              step="1"
              value={py}
              onChange={(e) => select(px, Number(e.target.value))}
            />
          </label>
        </div>
        <div className="continuum-readout-row">
          <span>
            {t("探针温度", "Probe temperature")}
            <strong>{number(temperature, 4)}</strong>
          </span>
          <span>
            {t("当前最高温度", "Current maximum")}
            <strong>{number(peak, 4)}</strong>
          </span>
          <span>
            {t("扩散时间", "Diffusion time")}
            <strong>{number(frame.time, 4)}</strong>
          </span>
        </div>
      </div>
      <p className="continuum-model-caption">
        {t(
          "温度与时间均为约化单位。这是二维薄板模型：没有持续热源，热量可从四边流出。探针只读取已有格点，不改变温度场。",
          "Temperature and time use reduced units. This two-dimensional plate has no continuing heat source; heat can leave through its edges. The probe reads a grid point without changing the temperature field.",
        )}
      </p>
    </section>
  );
}

export default function ContinuumScene(props: Props) {
  return props.methodId === "constitutive" ? (
    <MaxwellScene {...props} />
  ) : props.methodId === "fem" ? (
    <BarScene {...props} />
  ) : (
    <HeatScene {...props} />
  );
}
