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
          <h1>From electrons to continuum mechanics</h1>
          <p className="hero-lead">
            Introductions, refined WebGL visuals, and lightweight in-browser
            demos—organized by scale, with modules you can extend independently.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#scale-map">
              Explore the scale map
            </a>
            <Link className="btn ghost" to={`/m/${modules[0]?.id ?? "dft"}`}>
              Start with DFT
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <ScaleOrbit />
        </div>
      </section>

      <section id="scale-map" className="scale-map">
        <header className="section-head">
          <h2>Scale map</h2>
          <p>
            Every module implements the same intro / render / compute contract,
            so you can add or rewrite one topic without touching the others.
          </p>
        </header>

        <div className="scale-columns">
          {SCALE_ORDER.filter((s) => s !== "cross-scale").map((scale) => {
            const mods = modules.filter((m) => m.scale === scale);
            return (
              <div key={scale} className="scale-col">
                <h3>{SCALE_LABELS[scale]}</h3>
                {mods.length === 0 ? (
                  <p className="muted">Coming soon</p>
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
          <h2>How to extend</h2>
          <p>
            Create <code>src/modules/&lt;id&gt;/</code>, export a{" "}
            <code>ModelingModule</code>, and register it in{" "}
            <code>src/modules/index.ts</code>.
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
