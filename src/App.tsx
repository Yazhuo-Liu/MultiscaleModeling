import MathMarkdown from "./components/MathMarkdown";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Atom,
  BookOpen,
  Boxes,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FlaskConical,
  Github,
  GraduationCap,
  Layers3,
  Menu,
  MoveUpRight,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { methods as methodsZh } from "./content/methods";
import { methodsEn } from "./content/methods.en";
import { useLanguage, type Locale } from "./i18n";
import { uiEn } from "./content/ui-en";
const TheoryReading = lazy(() => import("./components/TheoryReading"));
const methodsFor = (locale: Locale) =>
  locale === "zh" ? methodsZh : methodsEn;
function useUI() {
  const lang = useLanguage();
  return { ...lang, ui: (text: string) => lang.t(text, uiEn[text] || text) };
}
import type { Method, ScaleId } from "./types";
const SimulationLab = lazy(() => import("./components/SimulationLab"));
const scales: {
  id: ScaleId;
  name: string;
  en: string;
  color: string;
  number: string;
  description: string;
}[] = [
  {
    id: "electronic",
    name: "电子结构",
    en: "Electronic",
    color: "#8b72cb",
    number: "01",
    description: "从电子出发，理解原子为什么结合。",
  },
  {
    id: "atomistic",
    name: "原子尺度",
    en: "Atomistic",
    color: "#4894a9",
    number: "02",
    description: "跟随原子的运动，发现温度与相变。",
  },
  {
    id: "mesoscopic",
    name: "介观尺度",
    en: "Mesoscopic",
    color: "#cc9b42",
    number: "03",
    description: "观察缺陷与稀有事件如何改变材料。",
  },
  {
    id: "microstructure",
    name: "微结构",
    en: "Microstructure",
    color: "#c97f78",
    number: "04",
    description: "让晶粒、相界面与组织演化变得可见。",
  },
  {
    id: "continuum",
    name: "连续体",
    en: "Continuum",
    color: "#668b6b",
    number: "05",
    description: "把材料看作连续介质，走向工程结构。",
  },
];
const scaleOf = (id: ScaleId) => scales.find((s) => s.id === id)!;
function useRoute() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    const on = () => {
      setRoute(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
function App() {
  const { locale, setLocale, ui } = useUI();
  const methods = methodsFor(locale);
  const route = useRoute();
  const [query, setQuery] = useState("");
  const [mobile, setMobile] = useState(false);
  const [visited, setVisited] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem("multiscale-visited") || "[]");
      return Array.isArray(v)
        ? v.filter(
            (x) => typeof x === "string" && methods.some((m) => m.id === x),
          )
        : [];
    } catch {
      return [];
    }
  });
  const current = methods.find((m) => route === `/method/${m.id}`);
  useEffect(() => {
    setMobile(false);
    if (current) {
      document.title = `${current.title} · ${ui(ui("尺度之间"))}`;
      setVisited((v) => (v.includes(current.id) ? v : [...v, current.id]));
    } else document.title = ui("尺度之间 · 多尺度建模入门");
  }, [route, current, locale]);
  useEffect(() => {
    try {
      localStorage.setItem("multiscale-visited", JSON.stringify(visited));
    } catch {}
  }, [visited]);
  const shown = methods.filter((m) => {
    const zh = methodsZh.find((item) => item.id === m.id)!;
    const en = methodsEn.find((item) => item.id === m.id)!;
    return `${zh.title} ${en.title} ${m.english} ${m.short}`
      .toLowerCase()
      .includes(query.toLowerCase());
  });
  return (
    <div className="app-shell">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        {ui("跳至内容")}
      </a>
      {mobile && (
        <button
          className="sidebar-overlay"
          aria-label={ui("关闭菜单")}
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <a className="brand" href="#/">
          <span className="brand-mark">
            <Layers3 size={23} />
          </span>
          <span>
            {ui("尺度之间")}
            <small>MULTISCALE ATLAS</small>
          </span>
        </a>
        <div className="sidebar-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui("搜索建模方法…")}
            aria-label={ui("搜索建模方法")}
          />
          {query && (
            <button aria-label={ui("清除搜索")} onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>
        <nav aria-label={ui("主导航")}>
          <a href="#/" className={`nav-main ${route === "/" ? "active" : ""}`}>
            <Compass size={18} />
            {ui("探索尺度")}
            <span className="nav-dot" />
          </a>
          <a
            href="#/path"
            className={`nav-main ${route === "/path" ? "active" : ""}`}
          >
            <GraduationCap size={18} />
            {ui("学习路线")}
          </a>
          <div className="nav-label">
            {ui("建模方法")}
            <span>11</span>
          </div>
          {scales.map((s) => (
            <div className="nav-group" key={s.id}>
              <div className="nav-group-title">
                <span className={`scale-dot ${s.id}`} />
                {ui(s.name)}
                <span>{s.number}</span>
              </div>
              {shown
                .filter((m) => m.scale === s.id)
                .map((m) => (
                  <a
                    key={m.id}
                    href={`#/method/${m.id}`}
                    className={`nav-method ${current?.id === m.id ? "active" : ""}`}
                  >
                    <span>{m.title}</span>
                    {visited.includes(m.id) ? (
                      <Check size={12} />
                    ) : (
                      <span className="method-abbr">{m.short}</span>
                    )}
                  </a>
                ))}
            </div>
          ))}
          {shown.length === 0 && (
            <p className="no-results">{ui("没有匹配的方法")}</p>
          )}
          <div className="nav-divider" />
          <a
            href="#/compare"
            className={`nav-main ${route === "/compare" ? "active" : ""}`}
          >
            <Boxes size={17} />
            {ui("方法比较")}
          </a>
          <a
            href="#/resources"
            className={`nav-main ${route === "/resources" ? "active" : ""}`}
          >
            <BookOpen size={17} />
            {ui("参考与拓展")}
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="progress-label">
            <span>{ui("探索进度")}</span>
            <b>{visited.length} / 11</b>
          </div>
          <progress value={visited.length} max={11} />
          <p>{ui("每一次探索，都连接一个尺度。")}</p>
          <a
            href="https://github.com/Yazhuo-Liu/MultiscaleModeling"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            {ui("开源学习项目")}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-toggle icon-button"
            aria-label={ui("打开菜单")}
            onClick={() => setMobile(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>{ui("多尺度建模入门")}</span>
            <ChevronRight size={13} />
            <b>
              {current?.title ||
                {
                  "/": ui("探索尺度"),
                  "/path": ui("学习路线"),
                  "/compare": ui("方法比较"),
                  "/resources": ui("参考与拓展"),
                }[route] ||
                ui("页面未找到")}
            </b>
          </div>
          <div className="topbar-right">
            <button
              className="language-toggle"
              onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
              aria-label={
                locale === "zh" ? "Switch to English" : "Switch to Chinese"
              }
            >
              <span aria-hidden="true">{ui("中 / EN")}</span>
              <span>{locale === "zh" ? "English" : "中文"}</span>
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {current ? (
            <MethodPage key={current.id} method={current} />
          ) : route === "/" ? (
            <Home />
          ) : route === "/path" ? (
            <LearningPath />
          ) : route === "/compare" ? (
            <Compare />
          ) : route === "/resources" ? (
            <Resources />
          ) : (
            <div className="page simple-page">
              <h1>{ui("这个尺度还没有被发现")}</h1>
              <a href="#/" className="button primary">
                {ui("返回尺度地图")}
              </a>
            </div>
          )}
        </main>
        <footer className="footer">
          <span>
            <Layers3 size={15} />
            {ui("尺度之间")}
            <span className="footer-separator">/</span>{" "}
            {ui("从微观机制，理解宏观世界。")}
          </span>
        </footer>
      </div>
    </div>
  );
}
function Home() {
  const { locale, setLocale, ui } = useUI();
  const methods = methodsFor(locale);
  const [filter, setFilter] = useState<ScaleId | "all">("all");
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />A SMALL START. A MULTISCALE WORLD.
          </div>
          <h1>
            {ui("从原子，")}
            <br />
            {ui("到")}
            <span>{ui("万物。")}</span>
          </h1>
          <p>
            {ui("一块金属的强度，藏在电子、原子与晶粒之间。")}
            <br className="desktop-break" />
            {ui("沿着长度与时间，探索材料背后的建模语言。")}
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#/method/dft">
              {ui("开始探索")}
              <ArrowRight size={17} />
            </a>
            <a className="button text-button" href="#/path">
              {ui("找到我的学习路线")}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <i />
              {ui("为材料 · 力学 · 机械初学者设计")}
            </span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <svg viewBox="0 0 420 300">
            <defs>
              <pattern
                id="dots"
                width="19"
                height="19"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#cbd5d9" />
              </pattern>
              <radialGradient id="sphere">
                <stop offset="0" stopColor="#fff" />
                <stop offset=".7" stopColor="#adc6c9" />
                <stop offset="1" stopColor="#6c959b" />
              </radialGradient>
              <radialGradient id="purpleSphere">
                <stop offset="0" stopColor="#f7f2ff" />
                <stop offset=".7" stopColor="#beaddc" />
                <stop offset="1" stopColor="#8a70b5" />
              </radialGradient>
            </defs>
            <rect width="420" height="300" fill="url(#dots)" />
            <path
              d="M35 237L205 277L386 186M35 237L35 88M205 277L205 127M386 186L386 37"
              fill="none"
              stroke="#d4dde0"
              strokeWidth="1"
            />
            {[0, 1, 2].flatMap((z) =>
              [0, 1, 2].flatMap((y) =>
                [0, 1, 2].map((x) => {
                  const px = 84 + x * 66 + y * 35,
                    py = 215 - x * 19 + y * 13 - z * 65;
                  return (
                    <g key={`${x}${y}${z}`}>
                      <path
                        d={`M${px} ${py}${x < 2 ? ` l66 -19 m-66 19` : ""}${y < 2 ? " l35 13 m-35 -13" : ""}${z < 2 ? " l0 -65" : ""}`}
                        stroke="#b5c9cc"
                        strokeWidth="2"
                      />
                      <circle
                        cx={px}
                        cy={py}
                        r={x === 1 && y === 1 && z === 1 ? 15 : 10}
                        fill={x === 1 ? "url(#purpleSphere)" : "url(#sphere)"}
                      />
                    </g>
                  );
                }),
              ),
            )}
            <path d="M291 68L338 43L392 43" fill="none" stroke="#8e7bb0" />
            <text
              x="338"
              y="34"
              fill="#8e7bb0"
              fontSize="10"
              fontFamily="monospace"
            >
              a world within
            </text>
            <text
              x="45"
              y="278"
              fill="#7e9298"
              fontSize="10"
              fontFamily="monospace"
            >
              10⁻¹⁰ m → 10⁰ m
            </text>
          </svg>
          <div className="art-note">
            <Atom size={14} />
            {ui("不同尺度，同一个世界")}
          </div>
        </div>
      </section>
      <div className="intro-stats">
        <div>
          <b>05</b>
          <span>{ui("空间与时间尺度")}</span>
        </div>
        <div>
          <b>11</b>
          <span>{ui("经典建模方法")}</span>
        </div>
        <div>
          <b>
            2D <small>&</small> 3D
          </b>
          <span>{ui("可交互的科学实验")}</span>
        </div>
        <div>
          <FlaskConical size={24} />
          <span>{ui("动手调参，观察规律")}</span>
        </div>
      </div>
      <section className="map-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted">THE BIG PICTURE</div>
            <h2>
              {ui("找到你要探索的尺度")}
              <span className="heading-dot">.</span>
            </h2>
            <p>{ui("从电子到连续体，每一种方法都有它擅长回答的问题。")}</p>
          </div>
          <span className="quiet-label">
            <MoveUpRight size={15} />
            {ui("点击区域，进入对应方法")}
          </span>
        </div>
        <div className="scale-map-scroll">
          <ScaleMap />
        </div>
        <div className="map-footnote">
          <span>{ui("尺度区间是典型示意，随材料、算法与计算资源变化。")}</span>
          <span>{ui("对数坐标 · 非严格边界")}</span>
        </div>
      </section>
      <section className="methods-section" id="methods">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted">YOUR MODELING TOOLKIT</div>
            <h2>{ui("认识方法，从一个问题开始")}</h2>
          </div>
          <span className="quiet-label">{ui("直觉 → 理论 → 实验 → 代码")}</span>
        </div>
        <div className="filter-tabs" aria-label={ui("按尺度筛选")}>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "selected" : ""}
          >
            {ui("全部方法")}
            <span>11</span>
          </button>
          {scales.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={filter === s.id ? "selected" : ""}
            >
              <span className={`scale-dot ${s.id}`} />
              {ui(s.name)}
            </button>
          ))}
        </div>
        <div className="method-grid">
          {methods
            .filter((m) => filter === "all" || m.scale === filter)
            .map((m) => (
              <a
                href={`#/method/${m.id}`}
                key={m.id}
                className={`method-card ${m.scale}`}
              >
                <div className="card-top">
                  <span className="card-symbol">{m.short}</span>
                  <span className="card-scale">
                    {ui(scaleOf(m.scale).name)}
                  </span>
                  <ArrowUpRight size={18} />
                </div>
                <h3>{m.title}</h3>
                {locale === "zh" && (
                  <div className="card-english">{m.english}</div>
                )}
                <MathMarkdown>{m.tagline}</MathMarkdown>
                <div className="card-bottom">
                  <span>
                    <FlaskConical size={13} />
                    {ui("交互实验")}
                  </span>
                  <span>{m.length}</span>
                </div>
              </a>
            ))}
        </div>
      </section>
      <section className="start-banner">
        <div className="banner-icon">
          <GraduationCap size={32} />
        </div>
        <div>
          <span className="eyebrow muted">NOT SURE WHERE TO START?</span>
          <h2>{ui("第一次接触多尺度建模？")}</h2>
          <p>{ui("从热扩散或原子运动开始，先看见现象，再走进方程。")}</p>
        </div>
        <a href="#/path" className="button secondary">
          {ui("查看学习路线")}
          <ArrowRight size={17} />
        </a>
      </section>
    </div>
  );
}
function ScaleMap() {
  const { locale, setLocale, ui } = useUI();
  const methods = methodsFor(locale);
  const [active, setActive] = useState<ScaleId | null>(null);
  const groups = [
    { x: 14, y: 76, w: 24, h: 24 },
    { x: 30, y: 59, w: 25, h: 25 },
    { x: 46, y: 41, w: 25, h: 25 },
    { x: 62, y: 23, w: 25, h: 25 },
    { x: 77, y: 4, w: 23, h: 28 },
  ];
  return (
    <div className="scale-map">
      <div className="axis-title y-title">
        {ui("特征时间")}
        <span>TIME</span>
      </div>
      <div className="y-ticks">
        {["hours", "s", "ms", "μs", "ns", "ps", "fs"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="map-plot">
        <div className="map-grid" />
        <div className="map-diagonal" />
        {scales.map((s, i) => (
          <div
            key={s.id}
            className={`map-region ${s.id} ${active === s.id ? "focused" : ""}`}
            style={{
              left: `${groups[i].x - 10}%`,
              top: `${groups[i].y}%`,
              width: `${groups[i].w}%`,
              height: `${groups[i].h}%`,
            }}
            onMouseEnter={() => setActive(s.id)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="region-title">
              <span>{s.number}</span>
              <strong>{ui(s.name)}</strong>
              {locale === "zh" && <small>{s.en}</small>}
            </div>
            <div className="region-links">
              {methods
                .filter((m) => m.scale === s.id)
                .map((m) => (
                  <a
                    href={`#/method/${m.id}`}
                    key={m.id}
                    title={`${m.title} · ${m.english}`}
                  >
                    {m.short}
                    <ArrowUpRight size={11} />
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="x-ticks">
        {["Å", "nm", "μm", "mm", "m"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="axis-title x-title">
        {ui("特征长度")}
        <span>LENGTH</span>
      </div>
    </div>
  );
}
function MethodPage({ method: m }: { method: Method }) {
  const { locale, ui } = useUI();
  const methods = methodsFor(locale);
  const [tab, setTab] = useState("theory");
  const [copied, setCopied] = useState(false);
  const index = methods.indexOf(m);
  const s = scaleOf(m.scale);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.code);
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  const download = () => {
    const u = URL.createObjectURL(
      new Blob([m.code], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = u;
    a.download = `${m.id}-example.py`;
    a.click();
    URL.revokeObjectURL(u);
  };
  return (
    <article className={`page method-page ${m.scale}`}>
      <a href="#/" className="back-link">
        <ChevronLeft size={15} />
        {ui("返回尺度地图")}
      </a>
      <div className="method-hero">
        <div>
          <div className="eyebrow">
            <span className={`scale-dot ${m.scale}`} />
            {s.number} / {ui(s.name)} <span className="eyebrow-line" />{" "}
            {m.short}
          </div>
          <h1>{m.title}</h1>
          {locale === "zh" && <p className="method-english">{m.english}</p>}
          <MathMarkdown className="method-description">
            {m.description}
          </MathMarkdown>
        </div>
        <div className="method-monogram">
          {m.short}
          <Atom size={90} />
        </div>
      </div>
      <div className="method-facts">
        <div>
          <span>{ui("典型长度")}</span>
          <b>{m.length}</b>
        </div>
        <div>
          <span>{ui("特征时间")}</span>
          <b>{m.time}</b>
        </div>
        <div>
          <span>{ui("学习级别")}</span>
          <b>{m.difficulty}</b>
        </div>
        <div>
          <span>{ui("建议基础")}</span>
          <b>{m.prerequisites.join(" · ")}</b>
        </div>
      </div>
      <div className="chapter-tabs" role="tablist" aria-label={ui("章节内容")}>
        {[
          { id: "theory", title: ui("概念与理论"), icon: BookOpen },
          { id: "lab", title: ui("交互实验"), icon: FlaskConical },
          { id: "code", title: ui("算法与代码"), icon: Code2 },
          { id: "more", title: ui("应用与延伸"), icon: Compass },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-controls="chapter-panel"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={tab === t.id ? "active" : ""}
          >
            <t.icon size={17} />
            {t.title}
          </button>
        ))}
      </div>
      <div id="chapter-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "theory" && (
          <div className="theory-content">
            <div className="intuition-callout">
              <div className="callout-icon">
                <Sparkles size={23} />
              </div>
              <div>
                <span className="eyebrow muted">{ui("先建立直觉")}</span>
                <h2>{m.tagline}</h2>
                <MathMarkdown>{m.intuition}</MathMarkdown>
              </div>
            </div>
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">STEP BY STEP</div>
                <h2>{ui("从现象走进模型")}</h2>
              </div>
            </div>
            <div className="concept-grid">
              {m.concepts.map((c, i) => (
                <section className="concept-card" key={c.title}>
                  <span className="step-number">0{i + 1}</span>
                  <h3>{c.title.replace(/^0\d\s*·\s*/, "")}</h3>
                  <MathMarkdown>{c.body}</MathMarkdown>
                </section>
              ))}
            </div>
            <section className="equation-card">
              <div className="eyebrow muted">
                {ui("THE CORE IDEA / 核心方程")}
              </div>
              <MathMarkdown display className="equation">
                {m.equation.formula}
              </MathMarkdown>
              <MathMarkdown>{m.equation.explanation}</MathMarkdown>
            </section>
            <Suspense fallback={<p>{ui("正在展开理论…")}</p>}>
              <TheoryReading method={m} />
            </Suspense>
            <div className="next-lab">
              <div>
                <h3>{ui("把方程变成你能看见的现象")}</h3>
                <p>
                  {m.experiment.title} {ui("· 调整参数，检验你的直觉。")}
                </p>
              </div>
              <button className="button primary" onClick={() => setTab("lab")}>
                {ui("打开交互实验")}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        {tab === "lab" && (
          <section className="lab-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">LEARN BY DOING</div>
                <h2>{m.experiment.title}</h2>
                <MathMarkdown>{m.experiment.description}</MathMarkdown>
              </div>
            </div>
            <Suspense
              fallback={
                <div className="loading-panel">{ui("正在准备交互实验…")}</div>
              }
            >
              <SimulationLab method={m} />
            </Suspense>
            <div className="lab-notes">
              <div>
                <h3>
                  <Search size={17} />
                  {ui("试着观察")}
                </h3>
                <ol>
                  {m.experiment.observe.map((x) => (
                    <li key={x}>
                      <MathMarkdown>{x}</MathMarkdown>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3>
                  <Compass size={17} />
                  {ui("模型的边界")}
                </h3>
                <MathMarkdown>{m.experiment.limitations}</MathMarkdown>
              </div>
            </div>
          </section>
        )}
        {tab === "code" && (
          <section>
            <div className="section-heading">
              <div>
                <div className="eyebrow muted">UNDER THE HOOD</div>
                <h2>{ui("理解算法，再写下第一行代码")}</h2>
                <p>
                  {ui("用 Python / NumPy 阅读核心算法，逐步理解每一次更新。")}
                </p>
              </div>
            </div>
            <ol className="algorithm-steps">
              {m.steps.map((x, i) => (
                <li key={x}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <MathMarkdown>{x}</MathMarkdown>
                </li>
              ))}
            </ol>
            <div className="code-block">
              <div className="code-toolbar">
                <span>
                  <Code2 size={16} />
                  {m.id}-example.py <small>{m.codeLanguage}</small>
                </span>
                <div>
                  <button onClick={copy}>
                    {copied ? <CheckCheck size={15} /> : <Copy size={15} />}{" "}
                    {copied ? ui("已复制") : ui("复制")}
                  </button>
                  <button onClick={download}>
                    <Download size={15} />
                    {ui("下载")}
                  </button>
                </div>
              </div>
              <pre tabIndex={0}>
                <code>{m.code}</code>
              </pre>
            </div>
            <p className="code-note">
              {ui(
                "示例需要 Python 3 与 NumPy。请结合模型假设理解代码中的参数与边界条件。",
              )}
            </p>
          </section>
        )}
        {tab === "more" && (
          <section>
            <div className="detail-columns">
              <div className="detail-card">
                <h2>{ui("它能回答什么？")}</h2>
                <ul>
                  {m.applications.map((x) => (
                    <li key={x}>
                      <MathMarkdown>{x}</MathMarkdown>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-card">
                <h2>{ui("使用前要知道")}</h2>
                <ul>
                  {m.limitations.map((x) => (
                    <li key={x}>
                      <MathMarkdown>{x}</MathMarkdown>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h2 className="subsection-title">{ui("跨过尺度的桥梁")}</h2>
            <div className="connection-list">
              {m.connections.map((c) => {
                const next = methods.find((x) => x.id === c.id)!;
                return (
                  <a href={`#/method/${c.id}`} key={c.id}>
                    <span className={`connection-abbr ${next.scale}`}>
                      {next.short}
                    </span>
                    <div>
                      <h3>{next.title}</h3>
                      <MathMarkdown>{c.reason}</MathMarkdown>
                    </div>
                    <ArrowUpRight size={20} />
                  </a>
                );
              })}
            </div>
            <h2 className="subsection-title">{ui("继续阅读")}</h2>
            <ReferenceList refs={m.references} />
          </section>
        )}
      </div>
      <nav className="chapter-pagination" aria-label={ui("前后章节")}>
        {index > 0 ? (
          <a href={`#/method/${methods[index - 1].id}`}>
            <ChevronLeft size={20} />
            <span>
              <small>{ui("上一种方法")}</small>
              {methods[index - 1].title}
            </span>
          </a>
        ) : (
          <a href="#/">
            <ChevronLeft size={20} />
            <span>
              <small>{ui("回到起点")}</small>
              {ui("尺度地图")}
            </span>
          </a>
        )}
        {index < methods.length - 1 ? (
          <a href={`#/method/${methods[index + 1].id}`}>
            <span>
              <small>{ui("下一种方法")}</small>
              {methods[index + 1].title}
            </span>
            <ChevronRight size={20} />
          </a>
        ) : (
          <a href="#/compare">
            <span>
              <small>{ui("建立全局认识")}</small>
              {ui("比较建模方法")}
            </span>
            <ChevronRight size={20} />
          </a>
        )}
      </nav>
    </article>
  );
}
function LearningPath() {
  const { locale, setLocale, ui } = useUI();
  const methods = methodsFor(locale);
  const paths = [
    {
      title: ui("先看见，再理解"),
      tag: ui("推荐入门"),
      body: ui("从你熟悉的热传导和弹性变形开始，建立“方程—离散—计算”的直觉。"),
      ids: ["fdm", "fem", "constitutive"],
    },
    {
      title: ui("从原子寻找答案"),
      tag: ui("材料微观路线"),
      body: ui("看原子如何运动，理解热涨落，再思考原子间的力从哪里来。"),
      ids: ["md", "mc", "dft", "hf"],
    },
    {
      title: ui("把尺度连接起来"),
      tag: ui("进阶探索"),
      body: ui("观察缺陷、扩散、界面与晶粒，理解微观机制如何影响宏观响应。"),
      ids: ["kmc", "dd", "phase-field", "crystal-plasticity"],
    },
  ];
  return (
    <div className="page simple-page">
      <PageTitle
        eyebrow="A PATH THAT FITS YOU"
        title={ui("每一种好奇，都有一条路线。")}
        description={ui(
          "不必从最小的尺度开始。选一个熟悉的物理问题，让你的第一步更轻松。",
        )}
      />
      {paths.map((p, i) => (
        <section key={p.title} className="learning-path">
          <div className="path-heading">
            <span className="path-number">0{i + 1}</span>
            <div>
              <span className="eyebrow muted">{p.tag}</span>
              <h2>{p.title}</h2>
              <p>{p.body}</p>
            </div>
          </div>
          <div className="path-stops">
            {p.ids.map((id, n) => {
              const m = methods.find((x) => x.id === id)!;
              return (
                <a key={id} href={`#/method/${id}`} className={m.scale}>
                  <span>{n + 1}</span>
                  <div>
                    <b>{m.title}</b>
                    <small>{m.short}</small>
                  </div>
                  <ArrowRight size={17} />
                </a>
              );
            })}
          </div>
        </section>
      ))}
      <div className="info-note">
        <BookOpen size={22} />
        <p>
          {ui(
            "推荐学习节奏：读直觉 → 猜测调参结果 → 运行实验 → 回看方程 → 阅读代码。每次只改变一个参数，记录你看到的变化。",
          )}
        </p>
      </div>
    </div>
  );
}
function Compare() {
  const { locale, setLocale, ui } = useUI();
  const methods = methodsFor(locale);
  return (
    <div className="page simple-page">
      <PageTitle
        eyebrow="CHOOSE YOUR LENS"
        title={ui("同一个材料，不同的观察方式。")}
        description={ui(
          "先明确问题，再选择方法。尺度是线索，物理假设和所需精度才是关键。",
        )}
      />
      <div className="comparison-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>{ui("方法")}</th>
              <th>{ui("描述对象")}</th>
              <th>{ui("典型长度")}</th>
              <th>{ui("时间含义")}</th>
              <th>{ui("核心问题")}</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.id}>
                <td>
                  <a href={`#/method/${m.id}`}>
                    <b>{m.short}</b>
                    {m.title}
                    <ArrowUpRight size={13} />
                  </a>
                </td>
                <td>{ui(scaleOf(m.scale).name)}</td>
                <td>{m.length}</td>
                <td>{m.time}</td>
                <td>
                  <MathMarkdown>{m.tagline}</MathMarkdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="info-note">
        <Compass size={24} />
        <p>
          {ui(
            "各尺度范围有重叠，算法也常常组合使用。Monte Carlo 采样步数通常不是物理时间；电子基态方法中的迭代次数也不是动力学时间。请查看每章的假设与边界。",
          )}
        </p>
      </div>
      <a href="#/path" className="button secondary">
        {ui("找到适合我的入门路线")}
        <ArrowRight size={16} />
      </a>
    </div>
  );
}
function Resources() {
  const { locale, setLocale, ui } = useUI();
  const methods = methodsFor(locale);
  const refs = useMemo(() => {
    const all = methods.flatMap((m) => m.references);
    return all.filter((r, i) => all.findIndex((x) => x.url === r.url) === i);
  }, []);
  return (
    <div className="page simple-page">
      <PageTitle
        eyebrow="KEEP ASKING WHY"
        title={ui("沿着经典，继续探索。")}
        description={ui(
          "教材、原始论文与开放文档。交互实验是起点；完整的推导与严谨应用，需要回到这些资料。",
        )}
      />
      <div className="info-note">
        <GraduationCap size={24} />
        <p>
          {ui(
            "本站按初学者的学习顺序重述概念，所有动画均为教学模型。部分教材或论文需要机构访问权限，开放文档可直接阅读。",
          )}
        </p>
      </div>
      <ReferenceList refs={refs} />
      <div className="resources-end">
        <h2>{ui("一起把这份教材变得更好")}</h2>
        <p>{ui("发现科学表述、代码或体验问题，欢迎在仓库提出。")}</p>
        <a
          className="button secondary"
          href="https://github.com/Yazhuo-Liu/MultiscaleModeling/issues"
          target="_blank"
          rel="noreferrer"
        >
          {ui("前往 GitHub")}
          <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-title">
      <div className="eyebrow muted">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function ReferenceList({ refs }: { refs: Method["references"] }) {
  return (
    <ol className="references">
      {refs.map((r, i) => (
        <li key={r.url + i}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <div>
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.title}
              <ExternalLink size={14} />
            </a>
            <p>{r.author}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export default App;
