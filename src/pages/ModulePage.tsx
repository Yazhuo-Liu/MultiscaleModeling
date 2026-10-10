import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getModule } from "@/core/registry";
import { SCALE_LABELS } from "@/core/types";
import { IntroView } from "@/components/IntroView";
import { RenderHost } from "@/components/RenderHost";
import { ComputeHost } from "@/components/ComputeHost";

type Tab = "intro" | "render" | "compute";

export function ModulePage() {
  const { id = "" } = useParams();
  const mod = getModule(id);
  const tabs = useMemo(() => {
    if (!mod) return [] as { id: Tab; label: string }[];
    const list: { id: Tab; label: string }[] = [{ id: "intro", label: "介绍" }];
    if (mod.render || mod.RenderPanel) {
      list.push({ id: "render", label: mod.render?.label ?? "渲染" });
    }
    if (mod.compute || mod.ComputePanel) {
      list.push({ id: "compute", label: mod.compute?.label ?? "计算" });
    }
    return list;
  }, [mod]);

  const [tab, setTab] = useState<Tab>("intro");
  const active = tabs.some((t) => t.id === tab) ? tab : "intro";

  if (!mod) {
    return (
      <div className="module-missing">
        <h1>未找到模块</h1>
        <p>
          没有 id 为 <code>{id}</code> 的模块。
        </p>
        <Link to="/" className="btn primary">
          返回总览
        </Link>
      </div>
    );
  }

  const Intro = mod.IntroPanel;
  const Render = mod.RenderPanel;
  const Compute = mod.ComputePanel;

  return (
    <article className="module-page" style={{ ["--accent" as string]: mod.accent }}>
      <header className="module-hero">
        <p className="module-scale">{SCALE_LABELS[mod.scale]}</p>
        <h1>{mod.title}</h1>
        <p className="module-summary">{mod.summary}</p>
        {mod.tags && mod.tags.length > 0 ? (
          <ul className="tag-list">
            {mod.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="tab-bar" role="tablist" aria-label="Module sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={active === t.id ? "active" : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {active === "intro" ? (
          Intro ? <Intro /> : <IntroView intro={mod.intro} />
        ) : null}
        {active === "render" ? (
          Render ? <Render /> : mod.render ? <RenderHost demo={mod.render} /> : null
        ) : null}
        {active === "compute" ? (
          Compute ? (
            <Compute />
          ) : mod.compute ? (
            <ComputeHost demo={mod.compute} />
          ) : null
        ) : null}
      </div>
    </article>
  );
}
