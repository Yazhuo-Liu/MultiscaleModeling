import { Link } from "react-router-dom";
import { listModules } from "@/core/registry";
import { SCALE_LABELS, SCALE_ORDER } from "@/core/types";

export function HomePage() {
  const modules = listModules();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-brand">Multiscale Modeling</p>
          <h1>从电子到连续介质的材料建模入门</h1>
          <p className="hero-lead">
            介绍、WebGL 可视化与浏览器端轻量计算，按尺度组织，模块彼此独立，便于后续扩展。
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#scale-map">
              浏览尺度图谱
            </a>
            <Link className="btn ghost" to={`/m/${modules[0]?.id ?? "dft"}`}>
              从 DFT 开始
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <ScaleOrbit />
        </div>
      </section>

      <section id="scale-map" className="scale-map">
        <header className="section-head">
          <h2>尺度图谱</h2>
          <p>每个模块实现同一套介绍 / 渲染 / 计算接口，可单独增删而不牵动其它模块。</p>
        </header>

        <div className="scale-columns">
          {SCALE_ORDER.filter((s) => s !== "cross-scale").map((scale) => {
            const mods = modules.filter((m) => m.scale === scale);
            return (
              <div key={scale} className="scale-col">
                <h3>{SCALE_LABELS[scale]}</h3>
                {mods.length === 0 ? (
                  <p className="muted">待扩展</p>
                ) : (
                  <ul>
                    {mods.map((m) => (
                      <li key={m.id}>
                        <Link to={`/m/${m.id}`} style={{ ["--accent" as string]: m.accent }}>
                          <strong>{m.title}</strong>
                          <span>{m.summary}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {modules.some((m) => m.scale === "cross-scale") ? (
          <div className="cross-scale">
            <h3>{SCALE_LABELS["cross-scale"]}</h3>
            <ul className="module-row">
              {modules
                .filter((m) => m.scale === "cross-scale")
                .map((m) => (
                  <li key={m.id}>
                    <Link to={`/m/${m.id}`} style={{ ["--accent" as string]: m.accent }}>
                      <strong>{m.title}</strong>
                      <span>{m.summary}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="framework-note">
        <header className="section-head">
          <h2>扩展方式</h2>
          <p>
            在 <code>src/modules/&lt;id&gt;/</code> 新建目录，导出符合{" "}
            <code>ModelingModule</code> 的对象并在 <code>src/modules/index.ts</code>{" "}
            注册即可。
          </p>
        </header>
      </section>
    </div>
  );
}

function ScaleOrbit() {
  return (
    <svg className="scale-orbit" viewBox="0 0 480 480" fill="none">
      <defs>
        <radialGradient id="orbGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#7eb8c9" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#d9ebe8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#eef3f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="240" cy="240" r="200" fill="url(#orbGlow)" />
      {[70, 120, 170, 215].map((r, i) => (
        <circle
          key={r}
          cx="240"
          cy="240"
          r={r}
          stroke="#1a3a42"
          strokeOpacity={0.12 + i * 0.04}
          strokeDasharray={i % 2 === 0 ? "4 8" : "2 6"}
        />
      ))}
      <circle cx="240" cy="240" r="18" fill="#1f6f78" />
      <circle cx="310" cy="180" r="10" fill="#c45c26" />
      <circle cx="160" cy="280" r="8" fill="#2a6f4e" />
      <circle cx="300" cy="320" r="12" fill="#3d5a80" />
      <text x="240" y="248" textAnchor="middle" className="orbit-label">
        e⁻
      </text>
    </svg>
  );
}
