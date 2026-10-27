import { useLanguage } from "../i18n";
import type { FoundationId } from "../content/foundations-types";
import MathMarkdown from "./MathMarkdown";

export default function FoundationFigure({ id }: { id: FoundationId }) {
  const { t } = useLanguage();
  let title: string;
  let caption: string;
  let drawing;
  if (id === "why-multiscale") {
    title = t(
      "同一块材料，不同层次的问题",
      "One material, different levels of questions",
    );
    caption = t(
      "箭头传递的是势能、迁移势垒或本构参数等信息。应从需要预测的量倒推所需尺度，**不必每次都把所有尺度算一遍**。",
      "Arrows pass information such as potential energies, migration barriers or constitutive parameters. Work backward from the quantity you need to predict: **a problem need not use every scale**.",
    );
    const labels = [
      [t("电子", "Electrons"), t("成键与能量", "Bonding, energy"), "DFT / HF"],
      [t("原子", "Atoms"), t("力与热涨落", "Forces, fluctuations"), "MD / MC"],
      [
        t("缺陷与事件", "Defects & events"),
        t("滑移与扩散", "Slip, diffusion"),
        "DD / KMC",
      ],
      [
        t("微结构", "Microstructure"),
        t("晶粒与相界", "Grains, interfaces"),
        t("相场 / 晶体塑性", "PF / CP"),
      ],
      [
        t("连续体", "Continuum"),
        t("载荷与变形", "Loads, deformation"),
        "FEM / FDM",
      ],
    ];
    drawing = (
      <svg viewBox="0 0 760 210" role="img" aria-label={title}>
        {labels.map((row, i) => (
          <g key={i} transform={`translate(${14 + i * 150},24)`}>
            <rect
              width="132"
              height="130"
              rx="12"
              className={`foundation-node node-${i}`}
            />
            <text x="66" y="31" textAnchor="middle" className="figure-title">
              {row[0]}
            </text>
            <text x="66" y="66" textAnchor="middle">
              {row[1]}
            </text>
            <text x="66" y="103" textAnchor="middle" className="figure-small">
              {row[2]}
            </text>
            {i < 4 && (
              <path d="M135 65h12m-5-5 5 5-5 5" className="figure-axis" />
            )}
          </g>
        ))}
        <path
          d="M690 177H70m7-5-7 5 7 5"
          className="figure-axis figure-dashed"
        />
        <text x="380" y="201" textAnchor="middle">
          {t(
            "先提出问题，再选择需要保留的细节",
            "Start with a question; choose which details to retain",
          )}
        </text>
      </svg>
    );
  } else if (id === "scales-and-limits") {
    title = t(
      "算得更精细，为什么仍可能算错？",
      "Why can a finer calculation still be wrong?",
    );
    caption = t(
      "示意图：网格或时间步细化后，数值解逼近所选模型的极限。但遗漏的物理或错误参数会使这个极限偏离独立证据。**数值验证**检查方程有没有解对，**物理确认**检查模型能否回答实际问题。",
      "Schematic: refining a mesh or time step moves the numerical solution toward the chosen model's limit. Missing physics or incorrect parameters can keep that limit away from independent evidence. **Verification** checks the solution of the equations; **validation** tests the model against the intended physical problem.",
    );
    drawing = (
      <svg viewBox="0 0 760 255" role="img" aria-label={title}>
        <path d="M75 25v178h615m-6-5 6 5-6 5" className="figure-axis" />
        <text x="22" y="120" transform="rotate(-90 22 120)" textAnchor="middle">
          {t("预测量（示意）", "Predicted quantity (schematic)")}
        </text>
        <text x="390" y="240" textAnchor="middle">
          {t("更细的网格 / 更小的时间步 →", "Finer mesh / smaller time step →")}
        </text>
        <path
          d="M90 45C160 48 155 90 240 107S400 116 690 116"
          className="figure-curve"
        />
        <path d="M90 116H690" className="figure-axis figure-dashed" />
        <path d="M90 166H690" className="figure-reference figure-dashed" />
        <text x="440" y="103">
          {t("模型的收敛极限", "Converged model prediction")}
        </text>
        <text x="440" y="190">
          {t("独立证据 / 目标物理", "Independent evidence / target physics")}
        </text>
        <path
          d="M340 121v40m-4-4 4 4 4-4m-8-32 4-4 4 4"
          className="figure-reference"
        />
        <text x="354" y="146" className="figure-small">
          {t("模型或参数偏差", "Model or parameter bias")}
        </text>
      </svg>
    );
  } else if (id === "electronic-structure") {
    title = t(
      "电子结构怎样变成原子间的力？",
      "How does electronic structure produce forces?",
    );
    caption = t(
      String.raw`在 Born–Oppenheimer 近似下，先固定原子核位置求电子态，再得到含核间排斥的总能量 $E(\mathbf R)$。能量对核位置的负梯度给出力 $\mathbf F_I=-\nabla_I E$。`,
      String.raw`In the Born–Oppenheimer approximation, solve the electronic problem for fixed nuclei, then obtain the total energy $E(\mathbf R)$ including nuclear repulsion. Its negative gradient gives the force $\mathbf F_I=-\nabla_I E$.`,
    );
    const labels = [
      [
        t("原子核位置", "Nuclear positions"),
        t("组成与几何", "Composition, geometry"),
      ],
      [
        t("电子的量子问题", "Electronic problem"),
        t("动能与相互作用", "Kinetic + interaction energy"),
      ],
      [
        t("波函数 / 密度", "Wavefunction / density"),
        t("占据与电子分布", "Occupation, electron density"),
      ],
      [
        t("总能量与力", "Total energy & forces"),
        t("稳定结构与运动", "Structures, motion"),
      ],
    ];
    drawing = (
      <svg viewBox="0 0 760 220" role="img" aria-label={title}>
        {labels.map((row, i) => (
          <g key={i} transform={`translate(${15 + i * 190},28)`}>
            <rect
              width="165"
              height="112"
              rx="12"
              className={`foundation-node node-${i}`}
            />
            <text x="82" y="39" textAnchor="middle" className="figure-title">
              {row[0]}
            </text>
            <text x="82" y="77" textAnchor="middle" className="figure-small">
              {row[1]}
            </text>
            {i < 3 && (
              <path d="M169 55h15m-5-5 5 5-5 5" className="figure-axis" />
            )}
          </g>
        ))}
        <path
          d="M665 148v27H97v-27m-4 5 4-5 4 5"
          className="figure-axis figure-dashed"
        />
        <text x="380" y="205" textAnchor="middle">
          {t(
            "移动原子核，再求新的电子态",
            "Move the nuclei, then solve the new electronic state",
          )}
        </text>
      </svg>
    );
  } else if (id === "bonding") {
    title = t(
      "波函数相加与相减：成键态和反键态",
      "Adding and subtracting wavefunctions: bonding and antibonding",
    );
    caption = t(
      String.raw`这里用两个 1s 形状的函数作核间轴上的定性示意。相加增强核间振幅；相减在中间产生节点。纵轴表示波函数振幅，**不是电子轨迹或电荷符号**；概率密度要取 $|\psi|^2$，总能量还要考虑核间与电子间相互作用。`,
      String.raw`This qualitative section along the internuclear axis combines two 1s-shaped functions. Addition enhances amplitude between nuclei; subtraction creates a node. The vertical axis is wavefunction amplitude, **not an electron trajectory or charge sign**. Probability density is $|\psi|^2$; total energy also involves nuclear and electronic interactions.`,
    );
    drawing = (
      <svg viewBox="0 0 760 270" role="img" aria-label={title}>
        {[1, -1].map((sign, i) => {
          const points = Array.from({ length: 181 }, (_, n) => {
            const x = (n / 180) * 6 - 3;
            const y =
              Math.exp(-Math.abs(x + 1)) + sign * Math.exp(-Math.abs(x - 1));
            return `${28 + n * 1.72},${145 - y * 63}`;
          }).join(" ");
          return (
            <g key={sign} transform={`translate(${i * 380},0)`}>
              <text x="185" y="30" textAnchor="middle" className="figure-title">
                {i === 0
                  ? t("成键组合：同相叠加", "Bonding: in-phase addition")
                  : t("反键组合：反相叠加", "Antibonding: opposite phases")}
              </text>
              <path
                d="M28 145H345m-5-4 5 4-5 4"
                className="figure-axis figure-dashed"
              />
              <polyline points={points} className="figure-curve" />
              {[131, 235].map((x, j) => (
                <g key={x}>
                  <circle cx={x} cy="145" r="4" className="figure-nucleus" />
                  <text x={x} y="220" textAnchor="middle">
                    {j === 0 ? "A" : "B"}
                  </text>
                </g>
              ))}
              {i === 1 && (
                <>
                  <path
                    d="M183 57v140"
                    className="figure-reference figure-dashed"
                  />
                  <text x="198" y="65" className="figure-small">
                    {t("节点", "Node")}
                  </text>
                </>
              )}
              <text
                x="185"
                y="251"
                textAnchor="middle"
                className="figure-small"
              >
                {t(
                  "沿原子核连线的位置（示意）",
                  "Position along the nuclear axis (schematic)",
                )}
              </text>
            </g>
          );
        })}
      </svg>
    );
  } else return null;
  return (
    <figure className="foundation-figure">
      <h3>{title}</h3>
      <div
        className="foundation-figure-viewport"
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        {drawing}
      </div>
      <figcaption>
        <MathMarkdown>{caption}</MathMarkdown>
      </figcaption>
    </figure>
  );
}
