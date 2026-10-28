import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLanguage } from "../i18n";
import type { SimulationFrame } from "../types";

type SceneMethod = "dd" | "kmc" | "crystal-plasticity";
interface Props {
  methodId: SceneMethod;
  frame: SimulationFrame;
  params: Record<string, number>;
  active: boolean;
  resetToken: number;
}
type XY = [number, number];
const number = (value: number, digits = 3) =>
  value !== 0 && Math.abs(value) < 0.001
    ? value.toExponential(2)
    : value.toFixed(digits).replace(/\.?0+$/, "") || "0";
const duration = (seconds: number) => {
  const [scale, unit] =
    seconds === 0
      ? [1, "s"]
      : seconds < 1e-9
        ? [1e12, "ps"]
        : seconds < 1e-6
          ? [1e9, "ns"]
          : seconds < 1e-3
            ? [1e6, "μs"]
            : seconds < 1
              ? [1e3, "ms"]
              : [1, "s"];
  return `${number(seconds * Number(scale), 2)} ${unit}`;
};
const polyline = (points: XY[]) =>
  points
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

function DislocationScene({ frame, params, resetToken }: Props) {
  const { t } = useLanguage();
  const uid = useId().replaceAll(":", "");
  const [forceVisible, setForceVisible] = useState(true);
  const [areaVisible, setAreaVisible] = useState(true);
  const [selected, setSelected] = useState(32);
  useEffect(() => setSelected(32), [resetToken]);
  const points = frame.points ?? [];
  const selectedIndex = Math.min(selected, Math.max(0, points.length - 1));
  const observed = points[selectedIndex];
  const x = (v: number) => 80 + (v + 0.5) * 440;
  const y = (v: number) => 312 - v * 350;
  const line = polyline(points.map((point) => [x(point.x), y(point.y)]));
  const sweep = points
    .slice(1)
    .reduce(
      (sum, point, i) =>
        sum + ((point.x - points[i].x) * (point.y + points[i].y)) / 2,
      0,
    );
  const bow = frame.metrics[0]?.value ?? 0;
  const stress = params.stress ?? 0.6;
  return (
    <section
      className="phenomenon-scene meso-scene"
      data-method="dd"
      data-testid="phenomenon-dd"
      data-frame-time={frame.time}
      data-max-bow={bow}
      data-swept-area={sweep}
    >
      <div className="meso-scene-heading">
        <span>{t("看一条位错怎样弯曲", "WATCH A DISLOCATION BOW")}</span>
        <h3>{t("两端钉住，中间仍能移动", "Pinned ends, a moving middle")}</h3>
        <p>
          {t(
            "外力推动位错，线张力抵抗弯曲。青色区域记录这条线已经扫过的面积。",
            "Stress pushes the dislocation while line tension resists bending. The teal region marks the area swept by the line.",
          )}
        </p>
      </div>
      <div className="meso-layout">
        <div className="meso-drawing">
          <svg
            viewBox="0 0 600 420"
            role="img"
            aria-label={t(
              "滑移面内两端固定的位错弓出",
              "A dislocation bowing between two pins in its slip plane",
            )}
          >
            <defs>
              <pattern
                id={`${uid}-plane`}
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path d="M28 0 H0 V28" className="meso-plane-grid" />
              </pattern>
              <pattern
                id={`${uid}-obstacle`}
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(35)"
              >
                <path d="M0 0 V7" className="meso-obstacle-hatch" />
              </pattern>
              <marker
                id={`${uid}-arrow`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 Z" className="meso-force-fill" />
              </marker>
            </defs>
            <rect
              x="34"
              y="36"
              width="532"
              height="320"
              rx="18"
              className="meso-slip-plane"
            />
            <rect
              x="34"
              y="36"
              width="532"
              height="320"
              rx="18"
              fill={`url(#${uid}-plane)`}
            />
            <text x="53" y="65" className="meso-svg-note">
              {t("滑移面 · 俯视", "Slip plane · top view")}
            </text>
            {areaVisible && points.length > 0 && (
              <path
                data-testid="dd-swept"
                d={`${line} L520,312 L80,312 Z`}
                className="meso-swept"
              />
            )}
            <path d="M80 312 H520" className="meso-reference-line" />
            {forceVisible &&
              stress > 0 &&
              [10, 21, 32, 43, 54].map((index) => {
                const point = points[index];
                if (!point) return null;
                return (
                  <path
                    key={index}
                    d={`M${x(point.x)} ${y(point.y) - 14} v${-(24 + stress * 30)}`}
                    className="meso-force-arrow"
                    markerEnd={`url(#${uid}-arrow)`}
                  />
                );
              })}
            <path
              data-testid="dd-line"
              d={line}
              className="meso-dislocation-line"
            />
            {[80, 520].map((cx, i) => (
              <g key={cx}>
                <circle cx={cx} cy="312" r="19" className="meso-obstacle" />
                <circle
                  cx={cx}
                  cy="312"
                  r="19"
                  fill={`url(#${uid}-obstacle)`}
                />
                <circle cx={cx} cy="312" r="5" className="meso-pinned-node" />
                <text
                  x={cx}
                  y="385"
                  textAnchor="middle"
                  className="meso-svg-label"
                >
                  {i ? t("固定端 B", "Pin B") : t("固定端 A", "Pin A")}
                </text>
              </g>
            ))}
            {observed && (
              <g>
                <path
                  d={`M${x(observed.x)} 312 V${y(observed.y)}`}
                  className="meso-measure-line"
                />
                <circle
                  cx={x(observed.x)}
                  cy={y(observed.y)}
                  r="7"
                  className="meso-selected-point"
                />
              </g>
            )}
            <text x="300" y="385" textAnchor="middle" className="meso-svg-note">
              {t("虚线：起始位置", "Dashed line: initial position")}
            </text>
          </svg>
        </div>
        <aside className="meso-inspector">
          <span className="meso-inspector-kicker">
            {t("沿着线看一看", "INSPECT THE LINE")}
          </span>
          <h4>
            {selectedIndex === 0 || selectedIndex === points.length - 1
              ? t("障碍处保持固定", "A pin holds the endpoint")
              : t("这里移动了多少？", "How far has this point moved?")}
          </h4>
          <label className="meso-range-label">
            <span>{t("选择线上的位置", "Choose a position on the line")}</span>
            <input
              data-testid="dd-inspect-position"
              type="range"
              min="0"
              max={Math.max(1, points.length - 1)}
              step="1"
              value={selectedIndex}
              onChange={(event) => setSelected(Number(event.target.value))}
            />
          </label>
          <dl className="meso-readouts">
            <div>
              <dt>{t("所选位置的位移", "Displacement here")}</dt>
              <dd>
                {number(observed?.y ?? 0, 4)} <small>L</small>
              </dd>
            </div>
            <div>
              <dt>{t("最大弓出", "Largest bow")}</dt>
              <dd>
                {number(bow, 4)} <small>L</small>
              </dd>
            </div>
          </dl>
          <p>
            {t(
              "把选择点拖到两端：无论中间怎样弯曲，障碍处的位移始终为零。",
              "Move the selector to either end. However much the middle bends, the pinned endpoints stay still.",
            )}
          </p>
        </aside>
      </div>
      <div className="meso-local-controls">
        <label>
          <input
            data-testid="dd-show-force"
            type="checkbox"
            checked={forceVisible}
            onChange={(event) => setForceVisible(event.target.checked)}
          />
          {t("显示推动方向", "Show the driving direction")}
        </label>
        <label>
          <input
            data-testid="dd-show-swept"
            type="checkbox"
            checked={areaVisible}
            onChange={(event) => setAreaVisible(event.target.checked)}
          />
          {t("显示扫过区域", "Show the swept region")}
        </label>
      </div>
      <p className="meso-model-note">
        {t(
          "这是平面内的线张力教学模型，长度以两端间距 L 为单位；只显示弓出，不模拟位错环发射或断裂。",
          "A planar line-tension teaching model, with length measured in pin spacing L. It shows bowing, without dislocation-loop emission or fracture.",
        )}
      </p>
    </section>
  );
}

type VacancyVisit = { x: number; y: number; hops: number };
function KineticScene({ frame, resetToken }: Props) {
  const { t } = useLanguage();
  const uid = useId().replaceAll(":", "");
  const [showPath, setShowPath] = useState(true);
  const [showCandidates, setShowCandidates] = useState(true);
  const vacancy = frame.points?.find((point) => point.value === 1) ?? {
    x: 0,
    y: 0,
  };
  const hops = frame.metrics[2]?.value ?? 0;
  const [history, setHistory] = useState<VacancyVisit[]>([]);
  const [interval, setInterval] = useState({ time: 0, hops: 0 });
  const previous = useRef({ time: frame.time, hops, reset: resetToken });
  useEffect(() => {
    const old = previous.current;
    const visit = { x: vacancy.x, y: vacancy.y, hops };
    if (
      old.reset !== resetToken ||
      hops === 0 ||
      hops < old.hops ||
      frame.time < old.time
    ) {
      setHistory([visit]);
      setInterval({ time: 0, hops: 0 });
    } else if (hops > old.hops) {
      setHistory((value) => [...value, visit].slice(-100));
      setInterval({ time: frame.time - old.time, hops: hops - old.hops });
    }
    previous.current = { time: frame.time, hops, reset: resetToken };
  }, [frame.time, hops, resetToken, vacancy.x, vacancy.y]);
  const x = (value: number) => 260 + value * 112;
  const y = (value: number) => 244 - value * 112;
  const wrap = (value: number) =>
    (((((value / 0.25 + 7) % 15) + 15) % 15) - 7) * 0.25;
  const candidates = [
    [0.25, 0],
    [-0.25, 0],
    [0, 0.25],
    [0, -0.25],
  ].map(([dx, dy]) => ({
    x: wrap(vacancy.x + dx),
    y: wrap(vacancy.y + dy),
  }));
  const last = history.at(-2);
  const lastSegment =
    last &&
    hops - last.hops === 1 &&
    Math.abs(vacancy.x - last.x) + Math.abs(vacancy.y - last.y) < 0.251;
  const rate = frame.metrics[1]?.value ?? 0;
  const meanWait = rate > 0 ? 1 / (4 * rate) : 0;
  return (
    <section
      className="phenomenon-scene meso-scene"
      data-method="kmc"
      data-testid="phenomenon-kmc"
      data-frame-time={frame.time}
      data-vacancy={`${vacancy.x},${vacancy.y}`}
      data-hops={hops}
      data-waiting-time={interval.time}
    >
      <div className="meso-scene-heading">
        <span>{t("一次跳跃，推进一次时钟", "ONE HOP, ONE CLOCK ADVANCE")}</span>
        <h3>
          {t(
            "空位往哪里走，要等多久？",
            "Where will the vacancy hop, and how long is the wait?",
          )}
        </h3>
        <p>
          {t(
            "橙色圆环是空着的位置。邻居填进来，空位便移到邻居原来的位置；每次事件还带来一段等待时间。",
            "The orange ring marks an empty site. A neighbour fills it, moving the vacancy to that neighbour's old site. Each event also advances a waiting-time clock.",
          )}
        </p>
      </div>
      <div className="meso-layout">
        <div className="meso-drawing">
          <svg
            viewBox="0 0 520 488"
            role="img"
            aria-label={t(
              "二维周期晶格中的空位、邻居与跳跃路径",
              "Vacancy, neighbours and hop path in a two-dimensional periodic lattice",
            )}
          >
            <defs>
              <radialGradient id={`${uid}-atom`} cx="33%" cy="27%" r="70%">
                <stop offset="0" className="meso-atom-highlight" />
                <stop offset="0.5" className="meso-atom-mid" />
                <stop offset="1" className="meso-atom-dark" />
              </radialGradient>
              <pattern
                id={`${uid}-grid`}
                width="28"
                height="28"
                x="64"
                y="48"
                patternUnits="userSpaceOnUse"
              >
                <path d="M28 0 H0 V28" className="meso-crystal-grid" />
              </pattern>
            </defs>
            <rect
              x="42"
              y="26"
              width="436"
              height="436"
              rx="18"
              className="meso-slip-plane"
            />
            <rect
              x="64"
              y="48"
              width="392"
              height="392"
              fill={`url(#${uid}-grid)`}
            />
            <path
              d="M50 34 H470 V454 H50 Z"
              className="meso-periodic-boundary"
            />
            {showPath &&
              history.slice(1).map((visit, i) => {
                const from = history[i];
                if (
                  visit.hops - from.hops !== 1 ||
                  Math.abs(visit.x - from.x) + Math.abs(visit.y - from.y) >
                    0.251
                )
                  return null;
                return (
                  <path
                    key={visit.hops}
                    d={`M${x(from.x)} ${y(from.y)} L${x(visit.x)} ${y(visit.y)}`}
                    className="meso-vacancy-trail"
                    opacity={0.18 + (0.65 * (i + 1)) / history.length}
                  />
                );
              })}
            {frame.points
              ?.filter((point) => point.value !== 1)
              .map((point, i) => (
                <circle
                  key={i}
                  cx={x(point.x)}
                  cy={y(point.y)}
                  r="6.2"
                  fill={`url(#${uid}-atom)`}
                  className="meso-lattice-atom"
                />
              ))}
            {showCandidates &&
              candidates.map((point, i) => (
                <circle
                  key={i}
                  cx={x(point.x)}
                  cy={y(point.y)}
                  r="10.2"
                  className="meso-candidate-site"
                />
              ))}
            {showPath && lastSegment && (
              <path
                d={`M${x(last.x)} ${y(last.y)} L${x(vacancy.x)} ${y(vacancy.y)}`}
                className="meso-latest-hop"
              />
            )}
            <g
              data-testid="kmc-vacancy"
              transform={`translate(${x(vacancy.x)} ${y(vacancy.y)})`}
            >
              <circle r="16" className="meso-vacancy-halo" />
              <circle r="10" className="meso-vacancy-ring" />
              <path d="M-4 0 H4 M0 -4 V4" className="meso-vacancy-cross" />
            </g>
            <text x="260" y="478" textAnchor="middle" className="meso-svg-note">
              {t(
                "相对边界相连 · 原子间距 0.25 nm",
                "Opposite edges join · spacing 0.25 nm",
              )}
            </text>
          </svg>
        </div>
        <aside className="meso-inspector">
          <span className="meso-inspector-kicker">
            {t("观察空位的时钟", "THE VACANCY CLOCK")}
          </span>
          <h4>{t("一次跳跃，等待时间不同", "Each hop has its own wait")}</h4>
          <dl className="meso-readouts">
            <div>
              <dt>{t("已经发生的跳跃", "Hops completed")}</dt>
              <dd>{hops}</dd>
            </div>
            <div>
              <dt>{t("累计经过时间", "Elapsed time")}</dt>
              <dd data-testid="kmc-clock">{duration(frame.time)}</dd>
            </div>
            <div>
              <dt>
                {interval.hops > 1
                  ? t(
                      `最近 ${interval.hops} 次跳跃耗时`,
                      `Time for the last ${interval.hops} hops`,
                    )
                  : t("上次跳跃的等待时间", "Wait before the last hop")}
              </dt>
              <dd>{duration(interval.time)}</dd>
            </div>
          </dl>
          <div className="meso-event-card">
            <strong>
              {t("四个邻居，机会相同", "Four equally likely neighbours")}
            </strong>
            <p>
              {t(
                "这个例子中四个方向的速率相同，各有 25% 的选择概率。温度改变等待时间，不改变这四个概率。",
                "All four directions have the same rate in this example, each with a 25% selection probability. Temperature changes waiting times, not these four probabilities.",
              )}
            </p>
            <small>
              {t("当前平均等待", "Current mean wait")} · {duration(meanWait)}
            </small>
          </div>
        </aside>
      </div>
      <div className="meso-local-controls">
        <label>
          <input
            data-testid="kmc-show-path"
            type="checkbox"
            checked={showPath}
            onChange={(event) => setShowPath(event.target.checked)}
          />
          {t("显示空位路径", "Show the vacancy path")}
        </label>
        <label>
          <input
            data-testid="kmc-show-candidates"
            type="checkbox"
            checked={showCandidates}
            onChange={(event) => setShowCandidates(event.target.checked)}
          />
          {t("标出四个候选邻居", "Mark the four possible neighbours")}
        </label>
      </div>
      <p className="meso-model-note">
        {t(
          "这是二维格点上的热激活事件模型。播放速度只是观察节奏；跨周期边界或一次显示多个事件时，路径会断开，避免画出不存在的长距离跳跃。",
          "A thermally activated event model on a 2D lattice. Playback speed is only a viewing pace. Paths break at periodic boundaries or skipped display events, avoiding fictitious long hops.",
        )}
      </p>
    </section>
  );
}

/** A fixed schematic tessellation. Every cell keeps the solver's grain index. */
function grainCells() {
  const side = 6;
  const seeds: XY[] = Array.from({ length: side * side }, (_, i) => {
    const column = i % side,
      row = Math.floor(i / side);
    return [
      60 + (column + 0.5 + 0.19 * Math.sin(i * 2.41)) * 80,
      40 + (row + 0.5 + 0.19 * Math.cos(i * 3.17)) * 60,
    ];
  });
  return seeds.map((seed, i) => {
    let polygon: XY[] = [
      [60, 40],
      [540, 40],
      [540, 400],
      [60, 400],
    ];
    seeds.forEach((other, j) => {
      if (j === i || !polygon.length) return;
      const nx = other[0] - seed[0],
        ny = other[1] - seed[1];
      const limit =
        (other[0] ** 2 + other[1] ** 2 - seed[0] ** 2 - seed[1] ** 2) / 2;
      const clipped: XY[] = [];
      polygon.forEach((a, k) => {
        const b = polygon[(k + 1) % polygon.length];
        const da = a[0] * nx + a[1] * ny - limit,
          db = b[0] * nx + b[1] * ny - limit;
        if (da <= 1e-8) clipped.push(a);
        if (da <= 0 !== db <= 0) {
          const fraction = da / (da - db);
          clipped.push([
            a[0] + fraction * (b[0] - a[0]),
            a[1] + fraction * (b[1] - a[1]),
          ]);
        }
      });
      polygon = clipped;
    });
    return { seed, polygon };
  });
}

function CrystalScene({ frame, params, resetToken }: Props) {
  const { t } = useLanguage();
  const uid = useId().replaceAll(":", "");
  const cells = useMemo(grainCells, []);
  const [selected, setSelected] = useState(10);
  const [showOrientation, setShowOrientation] = useState(true);
  useEffect(() => setSelected(10), [resetToken]);
  const applied = frame.metrics[0]?.value ?? 0;
  const threshold = params.strength ?? 40;
  const grain = (i: number) => {
    const theta = ((((i * 17) % 36) + 0.5) * Math.PI) / 72;
    const factor = Math.abs(Math.cos(theta) * Math.sin(theta));
    return {
      theta,
      factor,
      resolved: applied * factor,
      active: applied * factor >= threshold,
    };
  };
  const selectedGrain = grain(selected);
  const activeCount = frame.metrics[1]?.value ?? 0;
  return (
    <section
      className="phenomenon-scene meso-scene"
      data-method="crystal-plasticity"
      data-testid="phenomenon-crystal-plasticity"
      data-frame-time={frame.time}
      data-active-grains={activeCount}
      data-selected-grain={selected}
      data-selected-resolved={selectedGrain.resolved}
    >
      <div className="meso-scene-heading">
        <span>
          {t(
            "同样受力，不同晶粒反应不同",
            "ONE LOAD, DIFFERENT GRAIN RESPONSES",
          )}
        </span>
        <h3>
          {t(
            "为什么有些晶粒先开始滑移？",
            "Why do some grains reach slip first?",
          )}
        </h3>
        <p>
          {t(
            "每块区域是一个取向不同的晶粒。加载后，暖色晶粒达到滑移阈值；点选一块，看看取向如何改变受力。",
            "Each region is a differently oriented grain. Warm-colored grains reach the slip threshold as the load rises. Select a grain to see how its orientation changes the resolved force.",
          )}
        </p>
      </div>
      <div className="meso-layout">
        <div className="meso-drawing">
          <svg
            viewBox="0 0 600 460"
            role="group"
            aria-label={t(
              "可选择的三十六个晶粒与滑移方向",
              "Thirty-six selectable grains and their slip directions",
            )}
          >
            <defs>
              {cells.map((cell, i) => (
                <clipPath id={`${uid}-grain-${i}`} key={i}>
                  <polygon
                    points={cell.polygon.map((p) => p.join(",")).join(" ")}
                  />
                </clipPath>
              ))}
            </defs>
            <rect
              x="50"
              y="30"
              width="500"
              height="380"
              rx="14"
              className="meso-grain-surround"
            />
            <path
              d="M40 220 H8 M8 220 l12 -9 M8 220 l12 9 M560 220 H592 M592 220 l-12 -9 M592 220 l-12 9"
              className="meso-load-arrow"
            />
            {cells.map((cell, i) => {
              const info = grain(i);
              const path = cell.polygon.map((p) => p.join(",")).join(" ");
              const dx = Math.cos(info.theta) * 90,
                dy = -Math.sin(info.theta) * 90;
              const px = Math.sin(info.theta),
                py = Math.cos(info.theta);
              return (
                <g
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected === i}
                  data-testid={`grain-${i}`}
                  aria-label={t(
                    `晶粒 ${i + 1}，${info.active ? "已达到滑移阈值" : "未达到滑移阈值"}`,
                    `Grain ${i + 1}, ${info.active ? "at the slip threshold" : "below the slip threshold"}`,
                  )}
                  onClick={() => setSelected(i)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(i);
                    }
                  }}
                  className={`meso-grain ${info.active ? "is-active" : ""} ${selected === i ? "is-selected" : ""}`}
                >
                  <polygon points={path} className="meso-grain-fill" />
                  <g clipPath={`url(#${uid}-grain-${i})`}>
                    {showOrientation &&
                      [-25, -12.5, 0, 12.5, 25].map((offset) => (
                        <path
                          key={offset}
                          d={`M${cell.seed[0] - dx + offset * px} ${cell.seed[1] - dy + offset * py} L${cell.seed[0] + dx + offset * px} ${cell.seed[1] + dy + offset * py}`}
                          className="meso-orientation-line"
                        />
                      ))}
                    {info.active &&
                      [-4, 4].map((offset) => (
                        <path
                          key={offset}
                          d={`M${cell.seed[0] - dx + offset * px} ${cell.seed[1] - dy + offset * py} L${cell.seed[0] + dx + offset * px} ${cell.seed[1] + dy + offset * py}`}
                          className="meso-slip-band"
                        />
                      ))}
                  </g>
                  {selected === i && (
                    <polygon points={path} className="meso-grain-selection" />
                  )}
                  {selected === i && (
                    <g className="meso-grain-number">
                      <circle cx={cell.seed[0]} cy={cell.seed[1]} r="15" />
                      <text
                        x={cell.seed[0]}
                        y={cell.seed[1]}
                        dominantBaseline="middle"
                        textAnchor="middle"
                      >
                        {i + 1}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            <text x="300" y="443" textAnchor="middle" className="meso-svg-note">
              {t(
                "水平方向拉伸 · 点选任意晶粒",
                "Horizontal tension · select any grain",
              )}
            </text>
          </svg>
        </div>
        <aside className="meso-inspector">
          <span className="meso-inspector-kicker">
            {t("观察一块晶粒", "INSPECT ONE GRAIN")}
          </span>
          <label className="meso-grain-picker">
            <span>{t("选择晶粒", "Select a grain")}</span>
            <select
              data-testid="cp-grain-select"
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
            >
              {cells.map((_, i) => (
                <option value={i} key={i}>
                  {t(`晶粒 ${i + 1}`, `Grain ${i + 1}`)}
                </option>
              ))}
            </select>
          </label>
          <div
            className={`meso-grain-status ${selectedGrain.active ? "is-active" : ""}`}
          >
            {selectedGrain.active
              ? t("已达到滑移阈值", "Slip threshold reached")
              : t("还没有达到滑移阈值", "Below the slip threshold")}
          </div>
          <dl className="meso-readouts">
            <div>
              <dt>{t("取向角", "Orientation angle")}</dt>
              <dd>{number((selectedGrain.theta * 180) / Math.PI, 1)}°</dd>
            </div>
            <div>
              <dt>{t("沿滑移方向的剪应力", "Resolved shear stress")}</dt>
              <dd>
                {number(selectedGrain.resolved, 1)} <small>MPa</small>
              </dd>
            </div>
            <div>
              <dt>{t("开始滑移所需的剪应力", "Threshold shear stress")}</dt>
              <dd>
                {number(threshold, 1)} <small>MPa</small>
              </dd>
            </div>
          </dl>
          <div
            className="meso-grain-meter"
            role="meter"
            aria-label={t("达到阈值的晶粒数量", "Grains at the threshold")}
            aria-valuemin={0}
            aria-valuemax={36}
            aria-valuenow={activeCount}
          >
            <div style={{ width: `${(activeCount / 36) * 100}%` }} />
          </div>
          <p>
            {activeCount} / 36{" "}
            {t("个晶粒达到阈值", "grains reach the threshold")}
          </p>
        </aside>
      </div>
      <div className="meso-local-controls">
        <label>
          <input
            data-testid="cp-show-orientation"
            type="checkbox"
            checked={showOrientation}
            onChange={(event) => setShowOrientation(event.target.checked)}
          />
          {t("显示晶粒取向纹理", "Show orientation lines")}
        </label>
        <span className="meso-grain-legend">
          <i />
          {t("暖色：达到滑移阈值", "Warm color: slip threshold reached")}
        </span>
      </div>
      <p className="meso-model-note">
        {t(
          "晶粒形状是示意，方向与应力来自同一个单滑移 Schmid 模型。线条标出滑移方向，不是已计算的变形量；这里未求解晶粒间协调、硬化或完整多晶塑性。",
          "Grain shapes are schematic; orientations and stresses use the same single-slip Schmid model. Lines indicate slip directions, not computed strain. Grain compatibility, hardening and full polycrystal plasticity are not solved here.",
        )}
      </p>
    </section>
  );
}

export default function MesoscopicScene(props: Props) {
  if (props.methodId === "dd") return <DislocationScene {...props} />;
  if (props.methodId === "kmc") return <KineticScene {...props} />;
  return <CrystalScene {...props} />;
}
