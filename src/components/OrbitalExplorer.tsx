import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useLanguage } from "../i18n";
import MathMarkdown from "./MathMarkdown";
import OrbitalVolumeView from "./OrbitalVolumeView";
import {
  OrbitalDensitySlice,
  OrbitalRadialPlot,
  type SliceAxis,
} from "./OrbitalDensitySlice";
import {
  GROUND_SUBSHELLS,
  hundOccupancy,
  shellPopulation,
  type Atom,
} from "../foundations/orbitals";
import {
  getOrbitalModel,
  VOLUME_HYDROGEN_ORBITALS as HYDROGEN_ORBITALS,
  VOLUME_IRON_ORBITALS as IRON_ORBITALS,
  type VolumeHydrogenOrbital as HydrogenOrbital,
  type VolumeIronOrbital as IronOrbital,
} from "../foundations/orbital-volume";
const orbitalLatex = (orbital: HydrogenOrbital | IronOrbital) =>
  orbital.startsWith("2p")
    ? `2p_${orbital.at(-1)}`
    : orbital === "dz2"
      ? "3d_{z^2}"
      : orbital === "dx2-y2"
        ? "3d_{x^2-y^2}"
        : orbital.startsWith("d")
          ? `3d_{${orbital.slice(1)}}`
          : orbital;

export function OrbitalExplorer() {
  const { t } = useLanguage();
  const id = useId();
  const [atom, setAtom] = useState<Atom>("H");
  const [level, setLevel] = useState<"shells" | "subshells" | "shape">("shape");
  const [shell, setShell] = useState<number | null>(null);
  const [hydrogen, setHydrogen] = useState<HydrogenOrbital>("2pz");
  const [iron, setIron] = useState<IronOrbital>("dz2");
  const [view, setView] = useState<"2d" | "3d">("3d");
  const [unavailable, setUnavailable] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [representation, setRepresentation] = useState<"surface" | "cloud">(
    "surface",
  );
  const [densityFraction, setDensityFraction] = useState(0.08);
  const [renderDensity, setRenderDensity] = useState(0.08);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>("y");
  const [slicePosition, setSlicePosition] = useState(0);
  const [showSlice, setShowSlice] = useState(false);
  const [cutaway, setCutaway] = useState(false);
  const model = useMemo(
    () => getOrbitalModel(atom, atom === "H" ? hydrogen : iron),
    [atom, hydrogen, iron],
  );
  useEffect(() => {
    setDensityFraction(model.defaultDensityFraction);
    setRenderDensity(model.defaultDensityFraction);
    setSlicePosition(0);
  }, [model]);
  useEffect(() => {
    const timer = setTimeout(() => setRenderDensity(densityFraction), 160);
    return () => clearTimeout(timer);
  }, [densityFraction]);
  const fail = useCallback(() => {
    setUnavailable(true);
    setView("2d");
  }, []);
  const chooseAtom = (value: Atom) => {
    setAtom(value);
    setShell(null);
  };
  const levels: {
    value: "shells" | "subshells" | "shape";
    zh: string;
    en: string;
  }[] = [
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
            <select
              id={`${id}-orbital`}
              data-testid="orbital-select"
              value={atom === "H" ? hydrogen : iron}
              onChange={(e) =>
                atom === "H"
                  ? setHydrogen(e.target.value as HydrogenOrbital)
                  : setIron(e.target.value as IronOrbital)
              }
            >
              {(atom === "H" ? HYDROGEN_ORBITALS : IRON_ORBITALS).map((o) => (
                <option key={o} value={o}>
                  {o.startsWith("2p")
                    ? `2p_${o.at(-1)}`
                    : o === "dz2"
                      ? "3d_z²"
                      : o === "dx2-y2"
                        ? "3d_x²−y²"
                        : o.startsWith("d")
                          ? `3d_${o.slice(1)}`
                          : o}
                  {atom === "H"
                    ? o === "1s"
                      ? t(" · 基态", " · ground state")
                      : t(" · 激发态", " · excited state")
                    : ""}
                </option>
              ))}
            </select>
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
          <div className="orbital-volume-controls">
            {view === "3d" && (
              <>
                <div
                  className="orbital-representation"
                  role="group"
                  aria-label={t(
                    "三维呈现方式",
                    "Three-dimensional representation",
                  )}
                >
                  <button
                    type="button"
                    data-testid="orbital-representation-surface"
                    aria-pressed={representation === "surface"}
                    onClick={() => setRepresentation("surface")}
                  >
                    {t("密度等值面", "Density isosurfaces")}
                  </button>
                  <button
                    type="button"
                    data-testid="orbital-representation-cloud"
                    aria-pressed={representation === "cloud"}
                    onClick={() => setRepresentation("cloud")}
                  >
                    {t("概率云", "Probability cloud")}
                  </button>
                </div>
                {representation === "surface" && (
                  <label className="orbital-density-control">
                    <span>
                      {t("等值面密度阈值", "Isosurface density threshold")}
                    </span>
                    <input
                      data-testid="orbital-density"
                      type="range"
                      min="-5"
                      max="-0.3"
                      step="0.1"
                      value={Math.log10(densityFraction)}
                      onChange={(e) =>
                        setDensityFraction(10 ** Number(e.currentTarget.value))
                      }
                      aria-label={t(
                        "等值面密度阈值，对数刻度",
                        "Isosurface density threshold, logarithmic scale",
                      )}
                      aria-valuetext={`${Number((100 * densityFraction).toPrecision(3))}%`}
                    />
                    <output>
                      {Number((100 * densityFraction).toPrecision(3))}% ρₘₐₓ
                    </output>
                  </label>
                )}
              </>
            )}
            <div className="orbital-section-controls">
              {view === "3d" && (
                <label className="orbital-check">
                  <input
                    data-testid="orbital-slice-enabled"
                    type="checkbox"
                    checked={showSlice}
                    onChange={(e) => setShowSlice(e.target.checked)}
                  />
                  {t("显示密度剖面", "Show density slice")}
                </label>
              )}
              <label className="orbital-plane-control">
                <span>{t("截面方向", "Slice orientation")}</span>
                <select
                  data-testid="orbital-slice-axis"
                  value={sliceAxis}
                  onChange={(e) => setSliceAxis(e.target.value as SliceAxis)}
                >
                  <option value="x">yz</option>
                  <option value="y">xz</option>
                  <option value="z">xy</option>
                </select>
              </label>
              <label className="orbital-slice-position-control">
                <span>{t("剖面位置", "Slice position")}</span>
                <input
                  data-testid="orbital-slice-position"
                  type="range"
                  min="-1"
                  max="1"
                  step="0.02"
                  value={slicePosition}
                  disabled={view === "3d" && !showSlice && !cutaway}
                  onChange={(e) =>
                    setSlicePosition(Number(e.currentTarget.value))
                  }
                  aria-label={t("移动剖面位置", "Move the slice")}
                  aria-valuetext={`${sliceAxis} = ${Number((slicePosition * model.extent).toFixed(2))} a₀`}
                />
                <output>
                  {sliceAxis} ={" "}
                  {Number((slicePosition * model.extent).toFixed(2))} a₀
                </output>
              </label>
              {view === "3d" && (
                <label className="orbital-check">
                  <input
                    data-testid="orbital-cutaway"
                    type="checkbox"
                    checked={cutaway}
                    onChange={(e) => setCutaway(e.target.checked)}
                  />
                  {t("剖开观察内部", "Cut away to see inside")}
                </label>
              )}
            </div>
          </div>
          <div className="orbital-visual-grid">
            <figure className="orbital-figure">
              <div className="orbital-current">
                <MathMarkdown inlineMath>
                  {orbitalLatex(atom === "H" ? hydrogen : iron)}
                </MathMarkdown>
                <span>
                  {view === "2d"
                    ? t("空间密度截面", "Spatial-density section")
                    : representation === "surface"
                      ? t("三维密度等值面", "3D density isosurfaces")
                      : t("三维概率云", "3D probability cloud")}
                </span>
              </div>
              <div className="orbital-viewport">
                {view === "2d" ? (
                  <OrbitalDensitySlice
                    model={model}
                    axis={sliceAxis}
                    position={slicePosition}
                  />
                ) : (
                  <OrbitalVolumeView
                    model={model}
                    representation={representation}
                    densityFraction={renderDensity}
                    sliceAxis={sliceAxis}
                    slicePosition={slicePosition}
                    showSlice={showSlice}
                    cutaway={cutaway}
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
                  {view === "2d"
                    ? t(
                        "截面来自同一三维波函数；深浅采用相对密度的对数色阶，以便观察较弱的尾部。改变截面方向和位置，可以找到节点。",
                        "The section comes from the same three-dimensional wavefunction. A logarithmic relative-density scale reveals weak tails. Change its orientation and position to find nodes.",
                      )
                    : representation === "surface"
                      ? t(
                          "表面满足 $|\\psi(x,y,z)|^2=\\rho_{\\mathrm{iso}}$，两种颜色区分波函数正负。降低阈值会显出更远的区域；百分比是相对于最大密度，**不是表面内包含的概率**。",
                          "Surfaces satisfy $|\\psi(x,y,z)|^2=\\rho_{\\mathrm{iso}}$; the two colors distinguish wavefunction signs. Lower thresholds reveal more distant regions. The percentage is relative to maximum density, **not enclosed probability**.",
                        )
                      : t(
                          `点按 $|\\psi(x,y,z)|^2$ 在三维空间采样，截断半径为 $${model.extent}a_0$。点代表可能的测量位置，不是同时存在的许多电子，也不是运动轨迹。`,
                          `Points sample $|\\psi(x,y,z)|^2$ in three-dimensional space, with a cutoff radius of $${model.extent}a_0$. They represent possible measurement positions, not many simultaneous electrons or trajectories.`,
                        )}
                </MathMarkdown>
              </figcaption>
              {view === "3d" && (
                <p className="orbital-help">
                  {t(
                    "拖动旋转 · 滚轮缩放 · 剖开可查看内部节点。聚焦图形后，方向键旋转，+/− 缩放，R 复位。",
                    "Drag to rotate · scroll to zoom · cut away to inspect internal nodes. When focused: arrows rotate, +/− zoom, R resets.",
                  )}
                </p>
              )}
            </figure>
            <OrbitalRadialPlot model={model} />
          </div>
          {unavailable && (
            <p className="orbital-note" role="status">
              {t(
                "当前设备的 3D 显示不可用，可继续探索同一波函数的 2D 截面。",
                "3D is unavailable on this device; explore 2D sections of the same wavefunction instead.",
              )}
            </p>
          )}
          <MathMarkdown className="orbital-model-note">
            {atom === "H"
              ? t(
                  "**模型：孤立氢原子的解析波函数。** $1s$ 是基态；选择 $2s$ 或 $2p$ 查看激发态，不表示基态电子同时占据这些轨道。所有图形都来自 $\\psi=R_{nl}(r)Y_{lm}(\\theta,\\phi)$，坐标单位为玻尔半径 $a_0$。",
                  "**Model: analytic wavefunctions of isolated hydrogen.** $1s$ is the ground state; $2s$ and $2p$ are excited states, not additional ground-state occupancies. Every view comes from $\\psi=R_{nl}(r)Y_{lm}(\\theta,\\phi)$, with coordinates in Bohr radii $a_0$.",
                )
              : t(
                  `**模型：自由中性 Fe 的 Slater 屏蔽类氢近似。** $3d$ 取 $Z_{\\mathrm{eff}}=6.25$，$4s$ 取 $3.75$，径向函数与球谐函数共同构成三维分布。当前轨道有 ${model.radialNodes.length} 个径向节点、${model.l} 个角节点。这是单个轨道的教学近似，不是自洽 HF/DFT、Fe 原子总电子密度或金属能带。`,
                  `**Model: Slater-screened hydrogenic approximation for isolated neutral Fe.** $Z_{\\mathrm{eff}}=6.25$ for $3d$ and $3.75$ for $4s$; a radial function and spherical harmonic form the full spatial distribution. This orbital has ${model.radialNodes.length} radial and ${model.l} angular nodes. It is a single-orbital teaching approximation, not self-consistent HF/DFT, total Fe electron density, or metallic bands.`,
                )}
          </MathMarkdown>
        </div>
      )}
    </section>
  );
}
