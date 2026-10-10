import { Link, NavLink } from "react-router-dom";
import { listModules } from "@/core/registry";

export function SiteHeader() {
  const mods = listModules();

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        Multiscale<span>Modeling</span>
      </Link>
      <nav className="site-nav" aria-label="Modules">
        <NavLink to="/" end>
          总览
        </NavLink>
        {mods.map((m) => (
          <NavLink key={m.id} to={`/m/${m.id}`}>
            {m.title}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
