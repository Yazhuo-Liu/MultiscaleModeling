import { useId, useMemo, useState } from "react";
import { useLanguage } from "../i18n";
import {
  assessCandidate,
  boundedModuli,
  linearizedRodUncertainty,
  REFERENCE_PHASES,
  rodResponse,
  sshBands,
  sshGap,
} from "../foundations/models";
import MathMarkdown from "./MathMarkdown";

const ink = "var(--figure-ink)";
const grid = "var(--figure-grid)";
const teal = "var(--figure-teal)";
const orange = "var(--figure-orange)";
const pale = "var(--figure-pale)";
const ticks = [0, 0.25, 0.5, 0.75, 1];

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  valueText,
  onChange,
  testId,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueText: string;
  onChange: (value: number) => void;
  testId: string;
}) {
  const id = useId();
  return (
    <div className="foundation-lab-control">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id} className="foundation-lab-value">
          {valueText}
        </output>
      </label>
      <input
        id={id}
        data-testid={testId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  testId,
}: {
  label: string;
  value: string;
  detail?: string;
  testId?: string;
}) {
  return (
    <div className="foundation-lab-metric">
      <span>{label}</span>
      <strong data-testid={testId}>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export function UncertaintyExplorer() {
  const { t } = useLanguage();
  const [modulus, setModulus] = useState(200);
  const [cvPercent, setCvPercent] = useState(5);
  const titleId = useId();
  const descriptionId = useId();
  const cv = cvPercent / 100;
  const model = linearizedRodUncertainty(modulus, cv);
  const samples = useMemo(
    () => boundedModuli(modulus, cv).map(rodResponse),
    [modulus, cv],
  );
  const kMin = samples[0].stiffnessNPerMm;
  const kMax = samples[samples.length - 1].stiffnessNPerMm;
  const uMin = samples[samples.length - 1].displacementMm;
  const uMax = samples[0].displacementMm;
  const kPad = (kMax - kMin) * 0.08;
  const uPad = (uMax - uMin) * 0.08;
  const kLow = kMin - kPad;
  const kHigh = kMax + kPad;
  const uLow = uMin - uPad;
  const uHigh = uMax + uPad;
  const x = (k: number) => 70 + ((k - kLow) / (kHigh - kLow)) * 540;
  const y = (u: number) => 260 - ((u - uLow) / (uHigh - uLow)) * 220;
  const path = samples
    .map(
      (sample, i) =>
        `${i ? "L" : "M"}${x(sample.stiffnessNPerMm)},${y(sample.displacementMm)}`,
    )
    .join(" ");
  return (
    <section className="foundation-lab" data-testid="uncertainty-explorer">
      <header className="foundation-lab-header">
        <span className="foundation-lab-tag">{t("动手探索", "Explore")}</span>
        <h3>
          {t("一个输入，两个相关的输出", "One input, two correlated outputs")}
        </h3>
        <MathMarkdown>
          {t(
            String.raw`只让弹性模量 $E$ 不确定。固定 $F=1000\,\mathrm{N}$、$A=10\,\mathrm{mm}^2$、$L=100\,\mathrm{mm}$，每个可能的 $E$ 同时产生一对刚度 $k$ 和位移 $u$。`,
            String.raw`Only Young's modulus $E$ is uncertain. With $F=1000\,\mathrm{N}$, $A=10\,\mathrm{mm}^2$ and $L=100\,\mathrm{mm}$ fixed, each possible $E$ produces a paired stiffness $k$ and displacement $u$.`,
          )}
        </MathMarkdown>
      </header>
      <div className="foundation-lab-controls">
        <RangeControl
          label={t("弹性模量的中心值", "Central Young's modulus")}
          value={modulus}
          min={80}
          max={300}
          step={5}
          valueText={`${modulus} GPa`}
          onChange={setModulus}
          testId="uncertainty-modulus"
        />
        <RangeControl
          label={t(
            "模量的相对标准差",
            "Relative standard deviation of modulus",
          )}
          value={cvPercent}
          min={1}
          max={20}
          step={1}
          valueText={`${cvPercent}%`}
          onChange={setCvPercent}
          testId="uncertainty-cv"
        />
      </div>
      <div
        className="foundation-lab-chart"
        tabIndex={0}
        role="region"
        aria-label={t(
          "刚度与位移联合图",
          "Joint stiffness and displacement plot",
        )}
      >
        <svg
          viewBox="0 0 680 320"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>
            {t(
              "刚度越大，同一力下位移越小",
              "Greater stiffness gives less displacement at the same force",
            )}
          </title>
          <desc id={descriptionId}>
            {t(
              "每个点来自同一个弹性模量样本。刚度和位移沿双曲线变化，乘积始终为1000牛顿。",
              "Each point comes from one modulus sample. Stiffness and displacement follow a hyperbola; their product is always 1000 newtons.",
            )}
          </desc>
          {ticks.map((fraction) => {
            const tx = 70 + fraction * 540;
            const ty = 260 - fraction * 220;
            return (
              <g key={fraction}>
                <line x1={tx} x2={tx} y1={40} y2={260} stroke={grid} />
                <line x1={70} x2={610} y1={ty} y2={ty} stroke={grid} />
                <text
                  x={tx}
                  y={283}
                  fill={ink}
                  fontSize={13}
                  textAnchor="middle"
                >
                  {Math.round(kLow + fraction * (kHigh - kLow))}
                </text>
                <text
                  x={61}
                  y={ty + 5}
                  fill={ink}
                  fontSize={13}
                  textAnchor="end"
                >
                  {(uLow + fraction * (uHigh - uLow)).toFixed(4)}
                </text>
              </g>
            );
          })}
          <line x1={70} y1={260} x2={610} y2={260} stroke={ink} />
          <line x1={70} y1={260} x2={70} y2={40} stroke={ink} />
          <text x={340} y={311} fill={ink} fontSize={15} textAnchor="middle">
            k (N/mm)
          </text>
          <text x={70} y={22} fill={ink} fontSize={15}>
            u (mm)
          </text>
          <path d={path} fill="none" stroke={teal} strokeWidth={2} />
          {samples.map((sample, i) => (
            <circle
              key={i}
              cx={x(sample.stiffnessNPerMm)}
              cy={y(sample.displacementMm)}
              r={3}
              fill={teal}
            />
          ))}
          <circle
            cx={x(model.stiffnessNPerMm)}
            cy={y(model.displacementMm)}
            r={6}
            fill={orange}
            stroke="var(--surface)"
            strokeWidth={2}
          />
          <text x={455} y={55} fill={teal} fontSize={15}>
            ku = 1000 N
          </text>
        </svg>
      </div>
      <p className="foundation-lab-legend">
        {t(
          "青色：41个有界等权示意样本；橙色：中心输入的响应。图轴随输入范围调整。",
          "Teal: 41 bounded, equally weighted illustrative samples. Orange: response at the central input. Axes follow the input range.",
        )}
      </p>
      <div className="foundation-lab-metrics" aria-live="polite">
        <Metric
          label={t("刚度及其标准差", "Stiffness and standard deviation")}
          value={`${Math.round(model.stiffnessNPerMm)} ± ${Math.round(model.stiffnessStdNPerMm)} N/mm`}
          detail={t("局部线性传播", "Local linear propagation")}
        />
        <Metric
          label={t("位移及其标准差", "Displacement and standard deviation")}
          value={`${model.displacementMm.toFixed(4)} ± ${model.displacementStdMm.toFixed(4)} mm`}
          detail={t("局部线性传播", "Local linear propagation")}
        />
        <Metric
          label={t(
            "保留相关性：ku 的标准差",
            "With correlation: standard deviation of ku",
          )}
          value="0 N"
          detail={t(
            "给定外力下的精确恒等式",
            "Exact identity at the prescribed force",
          )}
          testId="uncertainty-product-correct"
        />
        <Metric
          label={t(
            "误当独立：ku 的标准差",
            "Assuming independence incorrectly: SD of ku",
          )}
          value={`${model.independentProductStdN.toFixed(2)} N`}
          detail={t(
            "这是假设错误带来的虚假不确定度",
            "Spurious uncertainty from the wrong assumption",
          )}
          testId="uncertainty-product-independent"
        />
      </div>
      <MathMarkdown
        display
      >{String.raw`k=\frac{EA}{L},\qquad u=\frac{FL}{EA},\qquad ku=F`}</MathMarkdown>
      <div className="foundation-lab-note">
        <MathMarkdown>
          {t(
            String.raw`局部协方差为 $\operatorname{Cov}(k,u)\approx-F(\sigma_E/E)^2$，它抵消乘积传播中的两个方差项。有限幅度的非线性样本相关系数一般不精确等于 $-1$。上面的“±”表示一倍标准差，不是最小/最大值或保证区间。`,
            String.raw`The local covariance $\operatorname{Cov}(k,u)\approx-F(\sigma_E/E)^2$ cancels the two variance terms in the product. Finite-amplitude nonlinear samples do not generally have a Pearson correlation of exactly $-1$. Here “±” denotes one standard deviation, not extrema or a guaranteed interval.`,
          )}
        </MathMarkdown>
        <p>
          {t(
            "增大散布后，一阶近似会逐渐偏离非线性响应。材料不服从线弹性等模型偏差需要另外验证，增加样本数量无法消除它。",
            "As the spread grows, a first-order approximation departs from the nonlinear response. Model bias, such as departure from linear elasticity, requires separate validation and is not removed by taking more samples.",
          )}
        </p>
      </div>
    </section>
  );
}

export function BandExplorer() {
  const { t } = useLanguage();
  const [t2, setT2] = useState(0.6);
  const titleId = useId();
  const descriptionId = useId();
  const gap = sshGap(1, t2);
  const samples = useMemo(
    () =>
      Array.from({ length: 201 }, (_, i) => {
        const ka = -Math.PI + (i / 200) * 2 * Math.PI;
        return { ka, ...sshBands(ka, 1, t2) };
      }),
    [t2],
  );
  const x = (ka: number) => 70 + ((ka + Math.PI) / (2 * Math.PI)) * 540;
  const y = (energy: number) => 150 - (energy / 2.9) * 113;
  const curve = (band: "lower" | "upper") =>
    samples
      .map((point, i) => `${i ? "L" : "M"}${x(point.ka)},${y(point[band])}`)
      .join(" ");
  return (
    <section className="foundation-lab" data-testid="band-explorer">
      <header className="foundation-lab-header">
        <span className="foundation-lab-tag">{t("动手探索", "Explore")}</span>
        <h3>
          {t(
            "两种耦合，怎样打开带隙？",
            "How do alternating couplings open a gap?",
          )}
        </h3>
        <MathMarkdown>
          {t(
            String.raw`每个原胞有两个位点。固定胞内跃迁 $t_1=1\,\mathrm{eV}$，改变胞间跃迁 $t_2$。含自旋时，每个原胞有两个电子：下带填满，上带空着。`,
            String.raw`Each unit cell has two sites. Keep the intracell hopping $t_1=1\,\mathrm{eV}$ fixed and vary the intercell hopping $t_2$. With two electrons per cell including spin, the lower band is full and the upper band is empty.`,
          )}
        </MathMarkdown>
      </header>
      <div className="foundation-lab-controls">
        <RangeControl
          label={t("胞间跃迁能量 t₂", "Intercell hopping energy t₂")}
          value={t2}
          min={0.2}
          max={1.8}
          step={0.05}
          valueText={`${t2.toFixed(2)} eV`}
          onChange={setT2}
          testId="band-hopping"
        />
      </div>
      <div className="foundation-lab-presets">
        <button
          type="button"
          onClick={() => setT2(1)}
          aria-pressed={Math.abs(t2 - 1) < 1e-9}
        >
          {t("均匀链：t₂ = t₁", "Uniform chain: t₂ = t₁")}
        </button>
        <button
          type="button"
          onClick={() => setT2(0.6)}
          aria-pressed={Math.abs(t2 - 0.6) < 1e-9}
        >
          {t("二聚化：t₂ = 0.6 eV", "Dimerized: t₂ = 0.6 eV")}
        </button>
      </div>
      <div
        className="foundation-lab-chart"
        tabIndex={0}
        role="region"
        aria-label={t("二聚化链示意", "Dimerized chain diagram")}
      >
        <svg
          className="foundation-lab-chain"
          viewBox="0 0 680 105"
          role="img"
          aria-label={t(
            "相邻位点间的跃迁交替为t₁和t₂，每两个位点构成一个原胞。",
            "Hopping alternates between t₁ and t₂; every pair of sites forms a unit cell.",
          )}
        >
          {[0, 1, 2, 3].map((cell) => (
            <rect
              key={cell}
              x={48 + 150 * cell}
              y={30}
              width={120}
              height={47}
              rx={12}
              fill="var(--bg)"
            />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line
              key={i}
              x1={70 + i * 75}
              x2={145 + i * 75}
              y1={54}
              y2={54}
              stroke={i % 2 === 0 ? teal : orange}
              strokeWidth={2 + (i % 2 === 0 ? 1 : t2) * 3}
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx={70 + i * 75}
              cy={54}
              r={9}
              fill={i % 2 === 0 ? teal : "var(--surface)"}
              stroke={teal}
              strokeWidth={3}
            />
          ))}
          <text x={108} y={23} fill={teal} textAnchor="middle" fontSize={15}>
            t₁ = 1 eV
          </text>
          <text x={183} y={92} fill={orange} textAnchor="middle" fontSize={15}>
            t₂ = {t2.toFixed(2)} eV
          </text>
          <text x={405} y={92} fill={ink} textAnchor="middle" fontSize={14}>
            {t("浅色框：一个原胞", "Pale box: one unit cell")}
          </text>
        </svg>
      </div>
      <div
        className="foundation-lab-chart"
        tabIndex={0}
        role="region"
        aria-label={t(
          "二聚化链的两条能带",
          "Two energy bands of the dimerized chain",
        )}
      >
        <svg
          viewBox="0 0 680 320"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>
            {t(
              "二聚化链的能量与波矢",
              "Energy versus wave vector in a dimerized chain",
            )}
          </title>
          <desc id={descriptionId}>
            {t(
              `下带占满、上带为空，当前带隙为${gap.toFixed(2)}电子伏特。均匀链时，两带在布里渊区边界接触。`,
              `The lower band is occupied and the upper band is empty. The gap is ${gap.toFixed(2)} electronvolts. In the uniform chain the bands touch at the Brillouin-zone boundary.`,
            )}
          </desc>
          {[-2, -1, 0, 1, 2].map((energy) => (
            <g key={energy}>
              <line
                x1={70}
                x2={610}
                y1={y(energy)}
                y2={y(energy)}
                stroke={grid}
              />
              <text
                x={57}
                y={y(energy) + 5}
                textAnchor="end"
                fill={ink}
                fontSize={14}
              >
                {energy}
              </text>
            </g>
          ))}
          {[-Math.PI, 0, Math.PI].map((ka) => (
            <g key={ka}>
              <line x1={x(ka)} x2={x(ka)} y1={37} y2={263} stroke={grid} />
              <text
                x={x(ka)}
                y={286}
                textAnchor="middle"
                fill={ink}
                fontSize={14}
              >
                {ka === 0 ? "0" : ka < 0 ? "−π" : "π"}
              </text>
            </g>
          ))}
          <line x1={70} x2={610} y1={263} y2={263} stroke={ink} />
          <line x1={70} x2={70} y1={37} y2={263} stroke={ink} />
          <line
            x1={70}
            x2={610}
            y1={150}
            y2={150}
            stroke={pale}
            strokeDasharray="6 4"
          />
          <text x={77} y={144} fill={ink} fontSize={13}>
            E
            <tspan baselineShift="sub" fontSize={10}>
              F
            </tspan>{" "}
            = 0
          </text>
          <path
            d={curve("lower")}
            fill="none"
            stroke={teal}
            strokeWidth={3.5}
          />
          <path
            d={curve("upper")}
            fill="none"
            stroke={orange}
            strokeWidth={3.5}
          />
          <line
            x1={633}
            x2={633}
            y1={y(gap / 2)}
            y2={y(-gap / 2)}
            stroke={ink}
            strokeWidth={2}
          />
          <line
            x1={627}
            x2={639}
            y1={y(gap / 2)}
            y2={y(gap / 2)}
            stroke={ink}
            strokeWidth={2}
          />
          <line
            x1={627}
            x2={639}
            y1={y(-gap / 2)}
            y2={y(-gap / 2)}
            stroke={ink}
            strokeWidth={2}
          />
          <text x={645} y={155} fill={ink} fontSize={14}>
            E
            <tspan baselineShift="sub" fontSize={10}>
              g
            </tspan>
          </text>
          <text x={70} y={22} fill={ink} fontSize={15}>
            E (eV)
          </text>
          <text x={340} y={311} fill={ink} fontSize={15} textAnchor="middle">
            ka
          </text>
        </svg>
      </div>
      <MathMarkdown className="foundation-lab-legend">
        {t(
          "青色下带：占满；橙色上带：空带。虚线取中隙能量 $E_F = 0$，表示此半填充对称模型的能量基准。",
          "Teal lower band: occupied. Orange upper band: empty. The dashed midgap level $E_F = 0$ is the convention for this symmetric, half-filled model.",
        )}
      </MathMarkdown>
      <div className="foundation-lab-metrics" aria-live="polite">
        <Metric
          label={t("带隙", "Band gap")}
          value={`${gap.toFixed(2)} eV`}
          detail={
            gap < 1e-9
              ? t(
                  "带隙闭合，两带在边界接触",
                  "Gap closed; the bands touch at the boundary",
                )
              : t("带隙打开", "Gap open")
          }
          testId="band-gap"
        />
        <Metric
          label={t("每原胞电子数", "Electrons per unit cell")}
          value="2"
          detail={t(
            "包含两种自旋；零温半填充",
            "Both spins; half filling at zero temperature",
          )}
        />
      </div>
      <MathMarkdown
        display
      >{String.raw`E_\pm(k)=\pm\sqrt{t_1^2+t_2^2+2t_1t_2\cos(ka)},\qquad E_g=2|t_1-t_2|`}</MathMarkdown>
      <p className="foundation-lab-note">
        {t(
          "这是一维、无电子相互作用的教学模型。带隙闭合不等同于对真实材料电导率的预测；真实材料还需要考虑占据、维度、散射与电子关联。晶格示意中的连线表示跃迁耦合，不表示电子运动轨迹。",
          "This is a one-dimensional, noninteracting teaching model. Closing the gap alone does not predict a real material's conductivity; occupation, dimensionality, scattering and electron correlations also matter. Links in the chain represent hopping couplings, not electron trajectories.",
        )}
      </p>
    </section>
  );
}

export function FormationEnergyExplorer() {
  const { t } = useLanguage();
  const [energy, setEnergy] = useState(-0.1);
  const titleId = useId();
  const descriptionId = useId();
  const result = assessCandidate(energy);
  const x = (composition: number) => 80 + composition * 520;
  const y = (value: number) => 35 + ((0.15 - value) / 0.53) * 225;
  const hullPath = (points: typeof result.hull) =>
    points
      .map(
        (point, i) =>
          `${i ? "L" : "M"}${x(point.composition)},${y(point.energy)}`,
      )
      .join(" ");
  return (
    <section className="foundation-lab" data-testid="formation-energy-explorer">
      <header className="foundation-lab-header">
        <span className="foundation-lab-tag">{t("动手探索", "Explore")}</span>
        <h3>
          {t(
            "形成能为负，就一定稳定吗？",
            "Does a negative formation energy guarantee stability?",
          )}
        </h3>
        <MathMarkdown>
          {t(
            String.raw`假想体系中，元素 A、B 的形成能为零，AB 为 $-0.30\,\mathrm{eV/atom}$。改变候选 A₃B 的形成能，比较它与相同总体成分的 A + AB 混合物。`,
            String.raw`In this hypothetical system, elemental A and B have zero formation energy, and AB has $-0.30\,\mathrm{eV/atom}$. Vary the energy of a candidate A₃B phase and compare it with an A + AB mixture of the same overall composition.`,
          )}
        </MathMarkdown>
      </header>
      <div className="foundation-lab-controls">
        <RangeControl
          label={t("候选 A₃B 的形成能", "Formation energy of candidate A₃B")}
          value={energy}
          min={-0.3}
          max={0.1}
          step={0.005}
          valueText={`${energy.toFixed(3)} eV/atom`}
          onChange={setEnergy}
          testId="formation-energy"
        />
      </div>
      <div className="foundation-lab-presets">
        <button
          type="button"
          onClick={() => setEnergy(-0.1)}
          aria-pressed={Math.abs(energy + 0.1) < 1e-9}
        >
          {t("负形成能，但高于凸包", "Negative, but above the hull")}
        </button>
        <button
          type="button"
          onClick={() => setEnergy(-0.2)}
          aria-pressed={Math.abs(energy + 0.2) < 1e-9}
        >
          {t("进入凸包", "Enter the hull")}
        </button>
      </div>
      <div
        className="foundation-lab-chart"
        tabIndex={0}
        role="region"
        aria-label={t(
          "二元体系形成能凸包",
          "Binary formation-energy convex hull",
        )}
      >
        <svg
          viewBox="0 0 680 320"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>
            {t(
              "假想 A–B 体系的形成能与成分",
              "Formation energy versus composition in a hypothetical A–B system",
            )}
          </title>
          <desc id={descriptionId}>
            {t(
              `A₃B的B原子分数为0.25，竞争混合物能量为每原子负0.15电子伏特。当前候选高于加入它后凸包的能量为每原子${result.energyAboveHull.toFixed(3)}电子伏特。`,
              `A₃B has B atom fraction 0.25. Its competing mixture has energy minus 0.15 electronvolts per atom. The candidate is ${result.energyAboveHull.toFixed(3)} electronvolts per atom above the hull that includes it.`,
            )}
          </desc>
          {[0.1, 0, -0.1, -0.2, -0.3].map((tick) => (
            <g key={tick}>
              <line x1={80} x2={600} y1={y(tick)} y2={y(tick)} stroke={grid} />
              <text
                x={68}
                y={y(tick) + 5}
                textAnchor="end"
                fill={ink}
                fontSize={14}
              >
                {tick.toFixed(1)}
              </text>
            </g>
          ))}
          {ticks.map((fraction) => (
            <g key={fraction}>
              <line
                x1={x(fraction)}
                x2={x(fraction)}
                y1={35}
                y2={260}
                stroke={grid}
              />
              <text
                x={x(fraction)}
                y={284}
                textAnchor="middle"
                fill={ink}
                fontSize={14}
              >
                {fraction.toFixed(2)}
              </text>
            </g>
          ))}
          <line x1={80} x2={600} y1={260} y2={260} stroke={ink} />
          <line x1={80} x2={80} y1={35} y2={260} stroke={ink} />
          <line
            x1={80}
            x2={600}
            y1={y(0)}
            y2={y(0)}
            stroke={pale}
            strokeDasharray="3 4"
          />
          <path
            d={hullPath(result.referenceHull)}
            fill="none"
            stroke={pale}
            strokeWidth={6}
            strokeDasharray="7 5"
          />
          <path
            d={hullPath(result.hull)}
            fill="none"
            stroke={teal}
            strokeWidth={2.5}
          />
          <line
            x1={x(0.25)}
            x2={x(0.25)}
            y1={y(energy)}
            y2={y(result.competingEnergy)}
            stroke={orange}
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          {REFERENCE_PHASES.map((phase) => (
            <g key={phase.label}>
              <circle
                cx={x(phase.composition)}
                cy={y(phase.energy)}
                r={6}
                fill="var(--surface)"
                stroke={teal}
                strokeWidth={2.5}
              />
              <text
                x={x(phase.composition)}
                y={y(phase.energy) + (phase.label === "AB" ? 23 : -12)}
                textAnchor="middle"
                fill={ink}
                fontSize={15}
              >
                {phase.label}
              </text>
            </g>
          ))}
          <circle
            cx={x(0.25)}
            cy={y(result.competingEnergy)}
            r={4}
            fill="var(--surface)"
            stroke={pale}
            strokeWidth={2}
          />
          <circle
            cx={x(0.25)}
            cy={y(energy)}
            r={8}
            fill={orange}
            stroke="var(--surface)"
            strokeWidth={2}
          />
          <text x={x(0.25) + 13} y={y(energy) - 11} fill={orange} fontSize={15}>
            A₃B
          </text>
          <text x={80} y={20} fill={ink} fontSize={15}>
            ΔE
            <tspan baselineShift="sub" fontSize={10}>
              f
            </tspan>{" "}
            (eV/atom)
          </text>
          <text x={340} y={311} textAnchor="middle" fill={ink} fontSize={15}>
            {t("B 的原子分数 ", "B atom fraction ")}x
            <tspan baselineShift="sub" fontSize={10}>
              B
            </tspan>
          </text>
        </svg>
      </div>
      <p className="foundation-lab-legend">
        {t(
          "灰色虚线：仅竞争相 A、AB、B 的凸包；青色实线：加入候选后的凸包；橙色点：候选 A₃B。两条凸包可能重合。",
          "Gray dashed line: hull of competing A, AB and B phases only. Teal solid line: hull including the candidate. Orange point: candidate A₃B. The two hulls may coincide.",
        )}
      </p>
      <div className="foundation-lab-metrics" aria-live="polite">
        <Metric
          label={t("竞争混合物的能量", "Energy of the competing mixture")}
          value="−0.150 eV/atom"
          detail={t("按原子数计：½ A + ½ AB", "By atom fraction: ½ A + ½ AB")}
        />
        <Metric
          label={t(
            "相对竞争混合物的能差",
            "Energy relative to the competing mixture",
          )}
          value={`${result.excessOverCompetitors >= 0 ? "+" : ""}${result.excessOverCompetitors.toFixed(3)} eV/atom`}
          detail={t(
            "负值表示比已有竞争相更低",
            "Negative means below the existing competitors",
          )}
        />
        <Metric
          label={t(
            "加入候选后的凸包距离",
            "Energy above the hull including the candidate",
          )}
          value={`${result.energyAboveHull.toFixed(3)} eV/atom`}
          detail={
            result.onHull
              ? t("位于所选相的凸包上", "On the hull of the selected phases")
              : t(
                  "存在能量更低的竞争混合物",
                  "A competing mixture has lower energy",
                )
          }
          testId="formation-above-hull"
        />
      </div>
      <MathMarkdown
        display
      >{String.raw`E_{\mathrm{mix}}=\tfrac12 E_f(\mathrm A)+\tfrac12 E_f(\mathrm{AB})=-0.15\;\mathrm{eV/atom}`}</MathMarkdown>
      <p className="foundation-lab-note">
        {t(
          "形成能的零点是选定的元素参考态，所有能量均按每原子计。这里仅比较给定相的零温能量，不含温度、熵、其他未知相或相变速率；在这个凸包上不等于已证明真实材料在所有条件下稳定。",
          "The zero of formation energy is set by the chosen elemental reference states; all energies are per atom. This comparison uses zero-temperature energies of the listed phases only. It excludes temperature, entropy, unlisted phases and transformation rates, so being on this hull is not proof of real-material stability under all conditions.",
        )}
      </p>
    </section>
  );
}
