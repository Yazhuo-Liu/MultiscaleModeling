import { Link } from "react-router-dom";
import { listModules } from "@/core/registry";
import { SCALE_LABELS, SCALE_ORDER, type ScaleBand } from "@/core/types";
import { HeroOrbital } from "@/components/HeroOrbital";

const BANDS = SCALE_ORDER.filter((s) => s !== "cross-scale") as ScaleBand[];

export function HomePage() {
  const modules = listModules();
  const cross = modules.filter((m) => m.scale === "cross-scale");

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-brand">Multiscale Modeling</p>
          <h1>From electrons to continuum mechanics</h1>
          <p className="hero-lead">
            A modular field guide: clear introductions, physically shaped WebGL
            visuals, and lightweight browser demos you can extend one topic at a
            time.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#scale-map">
              Explore the scale map
            </a>
            <Link className="btn ghost" to="/m/dft">
              Start with DFT
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orbital">
            <HeroOrbital />
          </div>
        </div>
      </section>

      <section id="scale-map" className="scale-map">
        <header className="section-head">
          <h2>Scale map</h2>
          <p>
            Each module implements the same intro / render / compute contract.
            Add or rewrite one without touching the others.
          </p>
        </header>

        <div className="scale-rail">
          {BANDS.map((scale) => {
            const mods = modules.filter((m) => m.scale === scale);
            return (
              <div key={scale} className="scale-band">
                <h3>{SCALE_LABELS[scale]}</h3>
                {mods.length === 0 ? (
                  <p className="muted">Coming soon</p>
                ) : (
                  <ul>
                    {mods.map((m) => (
                      <li key={m.id}>
                        <Link to={`/m/${m.id}`}>
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

          {cross.length > 0 ? (
            <div className="scale-band">
              <h3>{SCALE_LABELS["cross-scale"]}</h3>
              <ul>
                {cross.map((m) => (
                  <li key={m.id}>
                    <Link to={`/m/${m.id}`}>
                      <strong>{m.title}</strong>
                      <span>{m.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
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
