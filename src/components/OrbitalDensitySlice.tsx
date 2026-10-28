import { useEffect, useRef } from "react";
import { Color, SRGBColorSpace } from "three";
import { useLanguage } from "../i18n";
import type { OrbitalModel } from "../foundations/orbital-volume";
import MathMarkdown from "./MathMarkdown";

export type SliceAxis = "x" | "y" | "z";

export function OrbitalDensitySlice({
  model,
  axis,
  position,
}: {
  model: OrbitalModel;
  axis: SliceAxis;
  position: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { t, locale } = useLanguage();
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;
    const draw = () => {
      const css = getComputedStyle(element);
      const rgb = (variable: string, fallback: string) => {
        const c = new Color(css.getPropertyValue(variable).trim() || fallback);
        const bytes = c.getRGB(new Color(), SRGBColorSpace);
        return [bytes.r * 255, bytes.g * 255, bytes.b * 255];
      };
      const positive = rgb("--orbital-positive", "#397fa4");
      const negative = rgb("--orbital-negative", "#ce8657");
      const background = rgb("--orbital-bg", "#f6f8fa");
      const ink = css.getPropertyValue("--figure-ink").trim() || "#5e6875";
      const w = 600,
        h = 440,
        size = 352,
        left = 124,
        top = 26;
      ctx.fillStyle = `rgb(${background.join(",")})`;
      ctx.fillRect(0, 0, w, h);
      const pixels = ctx.createImageData(size, size);
      const fixed = position * model.extent;
      for (let j = 0; j < size; j++)
        for (let i = 0; i < size; i++) {
          const u = ((2 * (i + 0.5)) / size - 1) * model.extent;
          const v = (1 - (2 * (j + 0.5)) / size) * model.extent;
          const psi =
            axis === "x"
              ? model.wavefunction(fixed, u, v)
              : axis === "y"
                ? model.wavefunction(u, fixed, v)
                : model.wavefunction(u, v, fixed);
          const alpha = Math.min(
            1,
            Math.log1p((1000 * psi * psi) / model.maxDensity) / Math.log(1001),
          );
          const color = psi >= 0 ? positive : negative;
          const k = (j * size + i) * 4;
          for (let c = 0; c < 3; c++)
            pixels.data[k + c] = background[c] * (1 - alpha) + color[c] * alpha;
          pixels.data[k + 3] = 255;
        }
      ctx.putImageData(pixels, left, top);
      const fontSize = Math.min(
        26,
        Math.max(15, 9000 / Math.max(element.clientWidth, 280)),
      );
      ctx.font = `${fontSize}px system-ui`;
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.35;
      ctx.strokeRect(left, top, size, size);
      ctx.beginPath();
      ctx.moveTo(left, top + size / 2);
      ctx.lineTo(left + size, top + size / 2);
      ctx.moveTo(left + size / 2, top);
      ctx.lineTo(left + size / 2, top + size);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      const axes = axis === "x" ? "yz" : axis === "y" ? "xz" : "xy";
      ctx.fillText(axes[0], left + size + 12, top + size / 2 + 5);
      ctx.fillText(axes[1], left + size / 2 + 10, top + 18);
      ctx.textAlign = "center";
      ctx.fillText(`${axis} = ${Number(fixed.toFixed(2))} a₀`, w / 2, h - 17);
      ctx.fillText(`−${model.extent}`, left, top + size + fontSize + 4);
      ctx.fillText(
        `${model.extent} a₀`,
        left + size,
        top + size + fontSize + 4,
      );
      ctx.textAlign = "left";
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [model, axis, position, locale]);
  return (
    <canvas
      ref={canvas}
      className="orbital-slice"
      width={600}
      height={440}
      role="img"
      aria-label={t(
        "三维波函数的空间密度截面；颜色表示相位，深浅表示对数概率密度",
        "A section through the three-dimensional wavefunction: color shows phase and intensity shows logarithmic probability density",
      )}
    />
  );
}

export function OrbitalRadialPlot({ model }: { model: OrbitalModel }) {
  const { t } = useLanguage();
  const values = Array.from({ length: 501 }, (_, i) => {
    const r = (i * model.extent) / 500;
    return [r, model.radialProbability(r)];
  });
  const maximum = Math.max(...values.map((p) => p[1])) * 1.1;
  const x = (r: number) => 48 + (r / model.extent) * 292;
  const y = (p: number) => 192 - (p / maximum) * 140;
  const path = values
    .map(([r, p], i) => `${i ? "L" : "M"}${x(r).toFixed(2)},${y(p).toFixed(2)}`)
    .join(" ");
  return (
    <div className="orbital-radial">
      <h4>{t("径向概率与节点", "Radial probability & nodes")}</h4>
      <MathMarkdown
        display
      >{String.raw`P(r)=r^2\int|\psi|^2\,d\Omega`}</MathMarkdown>
      <svg
        viewBox="0 0 370 245"
        role="img"
        aria-label={t(
          "径向概率曲线与径向节点，距离单位为玻尔半径",
          "Radial probability and radial nodes, with radius in Bohr radii",
        )}
      >
        <path d="M48 42V192H345" fill="none" stroke="var(--figure-grid)" />
        <path
          d={`${path}L340 192H48Z`}
          fill="var(--orbital-positive)"
          fillOpacity=".09"
        />
        <path
          d={path}
          fill="none"
          stroke="var(--orbital-positive)"
          strokeWidth="2.5"
        />
        {[0, 0.5, 1].map((f) => (
          <g key={f} fill="var(--figure-ink)" fontSize="12">
            <text x="41" y={y(f * maximum) + 4} textAnchor="end">
              {(f * maximum).toFixed(2)}
            </text>
            <text x={x(f * model.extent)} y="214" textAnchor="middle">
              {Number((f * model.extent).toFixed(1))}
            </text>
          </g>
        ))}
        {model.radialNodes.map((r) => (
          <g key={r}>
            <path
              d={`M${x(r)} 60V192`}
              stroke="var(--orbital-negative)"
              strokeDasharray="3 4"
            />
            <circle cx={x(r)} cy="192" r="3" fill="var(--orbital-negative)" />
          </g>
        ))}
        <text x="48" y="25" fontSize="12" fill="var(--figure-ink)">
          P(r) / a₀⁻¹
        </text>
        <text
          x="340"
          y="236"
          textAnchor="end"
          fontSize="12"
          fill="var(--figure-ink)"
        >
          r / a₀
        </text>
      </svg>
      <p className="orbital-node-count">
        {t("径向节点", "Radial nodes")}: {model.radialNodes.length} ·{" "}
        {t("角节点", "Angular nodes")}: {model.l}
      </p>
      <MathMarkdown>
        {model.radialNodes.length
          ? t(
              `虚线标出径向节点：$r/a_0=${model.radialNodes.map((r) => r.toFixed(3)).join(",\\,")}$。跨过节点时波函数变号，概率密度为零。`,
              `Dashed lines mark radial nodes: $r/a_0=${model.radialNodes.map((r) => r.toFixed(3)).join(",\\,")}$. The wavefunction changes sign across a node, where density vanishes.`,
            )
          : t(
              "本轨道没有径向节点。球壳的概率同时取决于局部密度和球壳体积，不能把径向曲线直接当作空间密度。",
              "This orbital has no radial nodes. Shell probability depends on both local density and shell volume; it is different from spatial density.",
            )}
      </MathMarkdown>
    </div>
  );
}
