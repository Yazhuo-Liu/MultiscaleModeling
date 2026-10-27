import MathMarkdown from "./MathMarkdown";
import { useId, type ReactNode } from "react";
import type { MethodId } from "../types";
import type { Locale } from "../i18n";

interface Props {
  id: MethodId;
  locale: Locale;
  title: string;
  caption: string;
}
const ink = "var(--ink, #25332e)";
const green = "var(--accent, #577c75)";
const soft = "#eaf2ee";
const blue = "#5d80a8";
const purple = "#9679ba";
const amber = "#bb8842";
const muted = "#708079";

export default function TheoryFigure({ id, locale, title, caption }: Props) {
  const uid = `theory-${useId().replace(/:/g, "")}`;
  const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const arrow = `url(#${uid}-arrow)`;
  const label = (
    x: number,
    y: number,
    text: string,
    anchor: "start" | "middle" | "end" = "middle",
    color = ink,
    size = 14,
  ) => (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size}>
      {text}
    </text>
  );
  const line = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    head = false,
    color = green,
  ) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={2}
      markerEnd={head ? arrow : undefined}
    />
  );
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    name: string,
    symbol: string,
  ) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={soft}
        stroke="#c9dbd1"
      />
      {label(x + w / 2, y + 25, name)}
      {label(x + w / 2, y + 49, symbol, "middle", green, 16)}
    </g>
  );
  const path = (points: [number, number][]) =>
    points
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
  let graphic: ReactNode;

  switch (id) {
    case "dft":
      graphic = (
        <>
          {box(25, 42, 165, 70, t("试探密度", "Trial density"), "nᵏ(r)")}
          {box(
            238,
            42,
            165,
            70,
            t("有效势", "Effective potential"),
            "vₑff[nᵏ]",
          )}
          {box(451, 42, 165, 70, t("求解轨道", "Solve orbitals"), "{φᵢ, εᵢ}")}
          {line(195, 77, 230, 77, true)}
          {line(408, 77, 443, 77, true)}
          <path
            d="M533 119 V183 H410"
            fill="none"
            stroke={green}
            strokeWidth={2}
            markerEnd={arrow}
          />
          {box(
            230,
            150,
            176,
            70,
            t("重建电子密度", "Rebuild density"),
            "nₒᵤₜ = Σᵢ fᵢ|φᵢ|²",
          )}
          <path
            d="M225 185 H107 V121"
            fill="none"
            stroke={green}
            strokeWidth={2}
            markerEnd={arrow}
          />
          {label(
            112,
            219,
            t("混合并再次迭代", "Mix and iterate"),
            "middle",
            muted,
            13,
          )}
          {label(
            320,
            264,
            t(
              "直到输入与输出密度足够一致：自洽",
              "Self-consistency: input and output densities agree",
            ),
            "middle",
            green,
            15,
          )}
        </>
      );
      break;
    case "hf":
      graphic = (
        <>
          <rect x={22} y={24} width={284} height={215} rx={14} fill="#f2f7f4" />
          <rect
            x={334}
            y={24}
            width={284}
            height={215}
            rx={14}
            fill="#f5f1f8"
          />
          {label(
            164,
            53,
            t("直接项 Jᵢⱼ", "Direct term Jᵢⱼ"),
            "middle",
            green,
            17,
          )}
          {label(
            476,
            53,
            t("交换项 Kᵢⱼ", "Exchange term Kᵢⱼ"),
            "middle",
            purple,
            17,
          )}
          <ellipse
            cx={119}
            cy={117}
            rx={55}
            ry={39}
            fill={green}
            opacity={0.18}
          />
          <ellipse
            cx={208}
            cy={117}
            rx={55}
            ry={39}
            fill={blue}
            opacity={0.18}
          />
          {label(119, 122, "|φᵢ|²")}
          {label(208, 122, "|φⱼ|²")}
          <path
            d="M145 107 Q164 76 184 107 M145 133 Q164 158 184 133"
            fill="none"
            stroke={green}
            strokeWidth={2}
          />
          {label(
            164,
            183,
            t("两团电荷密度的库仑作用", "Coulomb energy of two densities"),
            "middle",
            muted,
            13,
          )}
          {label(
            164,
            215,
            t(
              "同自旋与异自旋均有直接项",
              "Direct term for either spin pairing",
            ),
            "middle",
            muted,
            13,
          )}
          <ellipse
            cx={455}
            cy={116}
            rx={56}
            ry={38}
            fill={purple}
            opacity={0.2}
          />
          <ellipse
            cx={493}
            cy={116}
            rx={56}
            ry={38}
            fill={blue}
            opacity={0.2}
          />
          {label(476, 121, "φᵢ*φⱼ")}
          {label(
            476,
            183,
            t("波函数反对称性带来的积分", "Integral from antisymmetry"),
            "middle",
            muted,
            13,
          )}
          {label(
            476,
            215,
            t("相同自旋才有交换贡献", "Exchange between like spins"),
            "middle",
            muted,
            13,
          )}
          {label(
            320,
            276,
            t(
              "Fock 相互作用包含 J − K；交换不是电子在空间换位",
              "The Fock interaction contains J − K; exchange is not a trajectory",
            ),
            "middle",
            green,
            14,
          )}
        </>
      );
      break;
    case "md": {
      const toX = (r: number) => 66 + ((r - 0.9) / 1.9) * 515;
      const toY = (u: number) => 37 + ((2.3 - u) / 3.6) * 192;
      const points: [number, number][] = [];
      for (let i = 0; i <= 240; i++) {
        const r = 0.9 + (1.9 * i) / 240;
        const u = 4 * (r ** -12 - r ** -6);
        if (u <= 2.3) points.push([toX(r), toY(u)]);
      }
      const minimum = 2 ** (1 / 6);
      graphic = (
        <>
          {line(66, 239, 593, 239, true, muted)}
          {line(66, 239, 66, 28, true, muted)}
          <line
            x1={66}
            y1={toY(0)}
            x2={588}
            y2={toY(0)}
            stroke="#a7bcb1"
            strokeDasharray="5 5"
          />
          <path d={path(points)} fill="none" stroke={green} strokeWidth={3} />
          <circle cx={toX(minimum)} cy={toY(-1)} r={5} fill={amber} />
          <line
            x1={toX(minimum)}
            y1={toY(-1)}
            x2={toX(minimum)}
            y2={239}
            stroke={amber}
            strokeDasharray="4 4"
          />
          {label(25, 35, "U / ε", "start", muted, 13)}
          {label(598, 261, "r / σ", "end", muted, 13)}
          {label(54, toY(0) + 5, "0", "end", muted, 12)}
          {label(54, toY(-1) + 5, "−1", "end", muted, 12)}
          {label(
            174,
            88,
            t("r < rₘᵢₙ：排斥", "r < rₘᵢₙ: repulsion"),
            "start",
            purple,
            14,
          )}
          <path
            d={`M165 83 H115 L${toX(0.97)} ${toY(4 * (0.97 ** -12 - 0.97 ** -6))}`}
            fill="none"
            stroke={purple}
            strokeWidth={1.5}
            markerEnd={arrow}
          />
          {label(
            390,
            122,
            t("r > rₘᵢₙ：吸引", "r > rₘᵢₙ: attraction"),
            "middle",
            blue,
            15,
          )}
          {label(357, 51, "U(r) = 4ε [(σ/r)¹² − (σ/r)⁶]", "middle", green, 16)}
          {label(toX(minimum) + 20, 262, "rₘᵢₙ = 2¹ᐟ⁶ σ", "middle", amber, 13)}
          {label(
            320,
            289,
            t(
              "F = −dU/dr：势能的斜率决定力的方向",
              "F = −dU/dr: the slope sets the direction of force",
            ),
            "middle",
            muted,
            13,
          )}
        </>
      );
      break;
    }
    case "mc": {
      const lattice = (start: number, flipped: boolean) => (
        <g>
          {[0, 1, 2].flatMap((y) =>
            [0, 1, 2].map((x) => {
              const cx = start + x * 55,
                cy = 75 + y * 48;
              const middle = x === 1 && y === 1;
              const down = middle && !flipped;
              return (
                <g key={`${x}-${y}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={19}
                    fill={middle ? "#e8dfef" : soft}
                    stroke={middle ? purple : "#d4e1d9"}
                  />
                  <path
                    d={
                      down
                        ? `M${cx} ${cy - 10}V${cy + 10}m-5 -5 5 5 5-5`
                        : `M${cx} ${cy + 10}V${cy - 10}m-5 5 5-5 5 5`
                    }
                    fill="none"
                    stroke={middle ? purple : green}
                    strokeWidth={2.2}
                  />
                </g>
              );
            }),
          )}
        </g>
      );
      graphic = (
        <>
          {lattice(95, false)}
          {lattice(428, true)}
          {label(
            150,
            33,
            t("尝试翻转中心自旋", "Propose a spin flip"),
            "middle",
            green,
            16,
          )}
          {label(
            483,
            33,
            t("翻转后的局部状态", "After the local flip"),
            "middle",
            green,
            16,
          )}
          {line(258, 122, 367, 122, true)}
          {label(313, 102, "sᵢ → −sᵢ", "middle", purple, 14)}
          {label(
            320,
            223,
            "ΔE = 2J sᵢ Σⱼ sⱼ = −8J  (h = 0)",
            "middle",
            ink,
            16,
          )}
          {label(
            320,
            257,
            "Paccept = min[1, exp(−ΔE / kBT)]",
            "middle",
            green,
            16,
          )}
          {label(
            320,
            285,
            t(
              "本例能量下降，因此接受概率为 1",
              "Here the energy decreases, so the flip is always accepted",
            ),
            "middle",
            muted,
            13,
          )}
        </>
      );
      break;
    }
    case "dd":
      graphic = (
        <>
          <line
            x1={100}
            y1={200}
            x2={540}
            y2={200}
            stroke="#c2cec7"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <path
            d="M100 200 Q320 -18 540 200"
            fill="none"
            stroke={purple}
            strokeWidth={4}
          />
          {[150, 235, 320, 405, 490].map((x, i) => (
            <g key={x}>
              {line(
                x,
                138 - Math.sin((i * Math.PI) / 4) * 40,
                x,
                95 - Math.sin((i * Math.PI) / 4) * 40,
                true,
              )}
            </g>
          ))}
          <circle cx={100} cy={200} r={9} fill={ink} />
          <circle cx={540} cy={200} r={9} fill={ink} />
          {label(100, 232, t("钉扎点", "Pinned end"), "middle", ink, 14)}
          {label(540, 232, t("钉扎点", "Pinned end"), "middle", ink, 14)}
          {label(
            320,
            31,
            t(
              "剪应力驱动力：每单位线长 f = τb",
              "Stress driving force per length: f = τb",
            ),
            "middle",
            green,
            16,
          )}
          {label(
            320,
            173,
            t("线张力抵抗弯曲", "Line tension opposes bowing"),
            "middle",
            purple,
            14,
          )}
          {label(
            320,
            267,
            t(
              "简单平衡：τb = Γ/R；端点固定，位错线弓出",
              "Simple balance: τb = Γ/R; the pinned line bows out",
            ),
            "middle",
            muted,
            14,
          )}
        </>
      );
      break;
    case "kmc":
      graphic = (
        <>
          {label(168, 34, t("事件速率", "Event rates"), "middle", green, 16)}
          {[1, 2, 3].map((rate, i) => (
            <g key={rate}>
              <rect
                x={87}
                y={61 + i * 48}
                width={rate * 52}
                height={25}
                rx={5}
                fill={i === 1 ? "#e6d6b9" : soft}
                stroke={i === 1 ? amber : "#ceddd3"}
              />
              {label(69, 79 + i * 48, `k${rate}`, "end", muted, 14)}
              {label(
                96 + rate * 52,
                79 + i * 48,
                `${rate} s⁻¹`,
                "start",
                ink,
                13,
              )}
            </g>
          ))}
          {label(166, 237, "R = k₁ + k₂ + k₃ = 6 s⁻¹", "middle", green, 15)}
          {label(
            463,
            34,
            t("随机选择与等待", "Selection and waiting"),
            "middle",
            green,
            16,
          )}
          {label(463, 80, "P(event i) = kᵢ / R", "middle", ink, 16)}
          {line(347, 161, 594, 161, true, muted)}
          <circle cx={369} cy={161} r={5} fill={green} />
          <circle cx={548} cy={161} r={6} fill={amber} />
          {label(369, 190, "t", "middle", muted, 14)}
          {label(548, 190, "t + Δt", "middle", muted, 14)}
          {label(460, 142, "Δt = −ln(u) / R", "middle", green, 16)}
          {label(463, 237, "u ∈ (0, 1)", "middle", muted, 15)}
          {label(
            320,
            281,
            t(
              "速率之和决定时间尺度；相对速率决定事件概率",
              "Total rate sets the clock; relative rates set event probabilities",
            ),
            "middle",
            muted,
            13,
          )}
        </>
      );
      break;
    case "phase-field": {
      const points: [number, number][] = [];
      for (let i = 0; i <= 120; i++) {
        const p = -1.4 + (2.8 * i) / 120;
        points.push([
          47 + ((p + 1.4) / 2.8) * 235,
          196 - ((p * p - 1) ** 2 / 4) * 145,
        ]);
      }
      const profile: [number, number][] = [];
      for (let i = 0; i <= 120; i++) {
        const x = -3 + (6 * i) / 120;
        profile.push([359 + (i / 120) * 235, 139 - Math.tanh(x) * 66]);
      }
      graphic = (
        <>
          {label(
            164,
            32,
            t("局部自由能：双势阱", "Local free energy: double well"),
            "middle",
            green,
            15,
          )}
          {line(42, 205, 294, 205, true, muted)}
          {line(47, 207, 47, 49, true, muted)}
          <path d={path(points)} fill="none" stroke={purple} strokeWidth={3} />
          {label(81, 225, "−1", "middle", muted, 13)}
          {label(165, 225, "0", "middle", muted, 13)}
          {label(249, 225, "+1", "middle", muted, 13)}
          {label(289, 225, "φ", "end", muted, 14)}
          {label(165, 258, "f(φ) = (φ² − 1)² / 4", "middle", purple, 15)}
          {label(
            476,
            32,
            t("界面：连续过渡", "Interface: a smooth transition"),
            "middle",
            green,
            15,
          )}
          <rect x={430} y={58} width={91} height={157} fill={soft} />
          {line(351, 215, 606, 215, true, muted)}
          {line(359, 216, 359, 50, true, muted)}
          <path d={path(profile)} fill="none" stroke={green} strokeWidth={3} />
          {label(349, 79, "+1", "end", muted, 12)}
          {label(349, 206, "−1", "end", muted, 12)}
          {label(602, 235, "x", "middle", muted, 14)}
          {label(
            476,
            258,
            t(
              "梯度能惩罚过陡的界面",
              "Gradient energy penalizes sharp changes",
            ),
            "middle",
            green,
            13,
          )}
          {label(
            320,
            289,
            t(
              "体自由能偏好两相；梯度能使界面具有有限厚度",
              "Bulk energy favors the phases; gradient energy gives a finite interface width",
            ),
            "middle",
            muted,
            12,
          )}
        </>
      );
      break;
    }
    case "crystal-plasticity":
      graphic = (
        <>
          <circle cx={190} cy={150} r={92} fill="#f2f6f3" stroke="#d3dfd7" />
          <line
            x1={100}
            y1={195}
            x2={280}
            y2={105}
            stroke={purple}
            strokeWidth={6}
            opacity={0.35}
          />
          {line(190, 150, 152, 74, true, purple)}
          {label(143, 67, "n", "middle", purple, 16)}
          {line(190, 150, 266, 112, true, green)}
          {label(281, 105, "s", "middle", green, 16)}
          {line(190, 150, 190, 28, true, ink)}
          {label(190, 19, "σ", "middle", ink, 17)}
          <path
            d="M190 102 A48 48 0 0 0 168.534 107.067"
            fill="none"
            stroke={purple}
            strokeWidth={1.5}
          />
          {label(176, 94, "φ", "middle", purple, 14)}
          <path
            d="M190 85 A65 65 0 0 1 248.138 120.931"
            fill="none"
            stroke={green}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          {label(229, 86, "λ", "middle", green, 14)}
          {label(187, 212, "n ⟂ s", "middle", muted, 14)}
          {label(
            190,
            252,
            t("滑移面的截面示意", "Section through a slip plane"),
            "middle",
            muted,
            12,
          )}
          {label(453, 69, t("施密德定律", "Schmid’s law"), "middle", green, 18)}
          {label(453, 113, "τ = σ cosφ cosλ", "middle", ink, 20)}
          {label(
            453,
            154,
            t("φ：载荷与滑移面法向的夹角", "φ: load vs. plane normal n"),
            "middle",
            muted,
            13,
          )}
          {label(
            453,
            181,
            t("λ：载荷与滑移方向的夹角", "λ: load vs. slip direction s"),
            "middle",
            muted,
            13,
          )}
          {label(453, 220, "|τ| ≥ τc", "middle", purple, 18)}
          {label(
            320,
            285,
            t(
              "晶粒取向改变分解剪应力；应力相同，不一定同时滑移",
              "Grain orientation changes resolved shear stress and the onset of slip",
            ),
            "middle",
            muted,
            13,
          )}
        </>
      );
      break;
    case "constitutive": {
      const decay: [number, number][] = [];
      for (let i = 0; i <= 120; i++) {
        const time = (i / 120) * 4;
        decay.push([376 + (i / 120) * 216, 208 - Math.exp(-time) * 133]);
      }
      graphic = (
        <>
          {label(
            165,
            36,
            t(
              "Maxwell：弹簧与阻尼器串联",
              "Maxwell: spring + dashpot in series",
            ),
            "middle",
            green,
            14,
          )}
          <line
            x1={36}
            y1={104}
            x2={36}
            y2={166}
            stroke={ink}
            strokeWidth={4}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={23}
              y1={110 + i * 12}
              x2={35}
              y2={103 + i * 12}
              stroke={muted}
            />
          ))}
          <path
            d="M36 136H57l8 -15 13 30 13-30 13 30 13-30 13 30 8-15H165"
            fill="none"
            stroke={green}
            strokeWidth={2.5}
          />
          <path
            d="M165 136H186M235 118H186V154H235M207 120V152M207 136H268"
            fill="none"
            stroke={purple}
            strokeWidth={2.5}
          />
          {line(268, 136, 299, 136, true, ink)}
          {label(306, 118, "ε₀", "middle", ink, 16)}
          {label(103, 182, "E", "middle", green, 17)}
          {label(213, 182, "η", "middle", purple, 17)}
          {label(165, 235, "ε = εspring + εdashpot", "middle", muted, 15)}
          {label(
            479,
            36,
            t("保持总应变后的应力松弛", "Stress relaxation at fixed strain"),
            "middle",
            green,
            14,
          )}
          {line(368, 214, 607, 214, true, muted)}
          {line(376, 216, 376, 57, true, muted)}
          <path d={path(decay)} fill="none" stroke={green} strokeWidth={3} />
          <line
            x1={430}
            y1={208 - 133 / Math.E}
            x2={430}
            y2={214}
            stroke={amber}
            strokeDasharray="4 4"
          />
          <line
            x1={376}
            y1={208 - 133 / Math.E}
            x2={430}
            y2={208 - 133 / Math.E}
            stroke={amber}
            strokeDasharray="4 4"
          />
          <circle cx={430} cy={208 - 133 / Math.E} r={4} fill={amber} />
          {label(366, 79, "1", "end", muted, 12)}
          {label(366, 164, "1/e", "end", amber, 12)}
          {label(430, 235, "τ", "middle", amber, 14)}
          {label(598, 235, "t", "middle", muted, 14)}
          {label(471, 62, "σ/σ₀", "middle", muted, 13)}
          {label(
            320,
            281,
            "σ(t) = Eε₀ exp(−t/τ)       τ = η/E",
            "middle",
            green,
            16,
          )}
        </>
      );
      break;
    }
    case "fem":
      graphic = (
        <>
          {label(
            320,
            33,
            t(
              "连续杆 → 单元 → 组装方程",
              "Continuous bar → elements → assembled equations",
            ),
            "middle",
            green,
            17,
          )}
          <rect
            x={75}
            y={77}
            width={460}
            height={46}
            fill={soft}
            stroke={green}
            strokeWidth={2}
          />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line
                x1={75 + i * 230}
                y1={77}
                x2={75 + i * 230}
                y2={123}
                stroke={green}
                strokeWidth={2}
              />
              <circle cx={75 + i * 230} cy={100} r={5} fill={green} />
              {label(75 + i * 230, 147, `u${i}`, "middle", muted, 14)}
            </g>
          ))}
          <line x1={70} y1={62} x2={70} y2={137} stroke={ink} strokeWidth={4} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={55}
              y1={70 + i * 12}
              x2={69}
              y2={62 + i * 12}
              stroke={muted}
            />
          ))}
          {line(540, 100, 604, 100, true)}
          {label(579, 81, "F", "middle", green, 17)}
          {label(75, 174, "u₀ = 0", "middle", muted, 14)}
          <rect x={71} y={198} width={234} height={63} rx={10} fill="#f0edf6" />
          <rect x={370} y={198} width={203} height={63} rx={10} fill={soft} />
          {label(
            188,
            221,
            t("杆单元刚度", "Bar element stiffness"),
            "middle",
            purple,
            14,
          )}
          {label(188, 247, "kᵉ = (EA/ℓ) [1 −1; −1 1]", "middle", ink, 15)}
          {line(313, 231, 359, 231, true)}
          {label(
            471,
            224,
            t("连接共享节点后", "Assemble shared nodes"),
            "middle",
            green,
            14,
          )}
          {label(471, 249, "K u = f", "middle", ink, 18)}
        </>
      );
      break;
    case "fdm":
      graphic = (
        <>
          {label(
            175,
            31,
            t("二维五点差分模板", "2D five-point stencil"),
            "middle",
            green,
            17,
          )}
          {[80, 175, 270].map((x) => (
            <line
              key={`x${x}`}
              x1={x}
              y1={55}
              x2={x}
              y2={246}
              stroke="#d6e1da"
            />
          ))}
          {[55, 150, 245].map((y) => (
            <line
              key={`y${y}`}
              x1={80}
              y1={y}
              x2={270}
              y2={y}
              stroke="#d6e1da"
            />
          ))}
          {[
            [175, 55],
            [80, 150],
            [270, 150],
            [175, 245],
          ].map(([x, y]) => (
            <g key={`${x}${y}`}>
              <line
                x1={175}
                y1={150}
                x2={x}
                y2={y}
                stroke={green}
                strokeWidth={2}
              />
              <circle cx={x} cy={y} r={18} fill={soft} stroke={green} />
              {label(x, y + 5, "+1", "middle", green, 14)}
            </g>
          ))}
          <circle
            cx={175}
            cy={150}
            r={24}
            fill="#ede6f3"
            stroke={purple}
            strokeWidth={2}
          />
          {label(175, 155, "−4", "middle", purple, 17)}
          {label(222, 131, "Δx", "middle", muted, 13)}
          {label(466, 76, "∂T/∂t = α ∇²T", "middle", green, 20)}
          {label(
            466,
            121,
            t("等距网格中的拉普拉斯算子", "Laplacian on an equal-spacing grid"),
            "middle",
            muted,
            13,
          )}
          {label(
            466,
            153,
            "∇²T ≈ (Tᴱ + Tᵂ + Tᴺ + Tˢ − 4T) / Δx²",
            "middle",
            ink,
            13,
          )}
          {label(
            466,
            207,
            t("显式更新的稳定条件", "Stability of an explicit update"),
            "middle",
            muted,
            14,
          )}
          {label(466, 240, "α Δt / Δx² ≤ 1/4", "middle", purple, 19)}
          {label(
            320,
            286,
            t(
              "四个邻居传播热量；边界温度需单独指定",
              "Four neighbors carry heat; boundary temperatures must also be specified",
            ),
            "middle",
            muted,
            13,
          )}
        </>
      );
      break;
  }
  return (
    <figure className="theory-figure">
      <div className="theory-figure-title">{title}</div>
      <div className="theory-figure-viewport">
        <svg
          className="theory-figure-svg"
          viewBox="0 0 640 310"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-caption`}
          fontFamily="var(--font, system-ui, sans-serif)"
        >
          <title id={`${uid}-title`}>{title}</title>

          <defs>
            <marker
              id={`${uid}-arrow`}
              viewBox="0 0 10 10"
              refX={8}
              refY={5}
              markerWidth={6}
              markerHeight={6}
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill={green} />
            </marker>
          </defs>
          {graphic}
        </svg>
      </div>
      <figcaption id={`${uid}-caption`} className="theory-figure-caption">
        <MathMarkdown>{caption}</MathMarkdown>
      </figcaption>
    </figure>
  );
}
