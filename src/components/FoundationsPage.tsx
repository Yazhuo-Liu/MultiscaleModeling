import { Fragment, lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { useLanguage } from "../i18n";
import { foundationIndex } from "../content/foundation-index";
import { getFoundation } from "../content/foundations";
import type { FoundationId } from "../content/foundations-types";
import { methods as methodsZh } from "../content/methods";
import { methodsEn } from "../content/methods.en";
import MathMarkdown from "./MathMarkdown";
import FoundationFigure from "./FoundationFigure";
import BeginnerIntro from "./BeginnerIntro";

const Orbitals = lazy(() =>
  import("./OrbitalExplorer").then((m) => ({ default: m.OrbitalExplorer })),
);
const Experiments = lazy(() =>
  import("./FoundationExperiments").then((m) => ({
    default: ({ id, beginner }: { id: FoundationId; beginner?: boolean }) =>
      id === "error-propagation" ? (
        <m.UncertaintyExplorer beginner={beginner} />
      ) : id === "band-structure" ? (
        <m.BandExplorer beginner={beginner} />
      ) : (
        <m.FormationEnergyExplorer beginner={beginner} />
      ),
  })),
);

/** A deliberately equation-free first picture; the full scientific diagram is in level two. */
function FoundationIntroFigure({ id }: { id: FoundationId }) {
  const { t } = useLanguage();
  const electronic = id === "electronic-structure";
  const bonding = id === "bonding";
  const limits = id === "scales-and-limits";
  const title = electronic
    ? t(
        "先问：电子在哪里更可能出现？",
        "First ask: where is an electron more likely to be found?",
      )
    : bonding
      ? t(
          "原子靠近，电子的分布也会改变",
          "As atoms approach, the electron distribution changes",
        )
      : limits
        ? t(
            "换一种观察方式，就保留另一种细节",
            "A different view keeps a different kind of detail",
          )
        : t("一块材料，三种观察距离", "One material, three viewing distances");
  const labels = electronic
    ? [
        t("原子核", "Nucleus"),
        t("电子分布", "Electron distribution"),
        t("原子的性质", "Atomic properties"),
      ]
    : bonding
      ? [
          t("两个原子", "Two atoms"),
          t("相互靠近", "Coming closer"),
          t("共同形成材料", "Forming a material"),
        ]
      : limits
        ? [
            t("看到形状", "See the shape"),
            t("看到晶粒", "See the grains"),
            t("看到原子", "See the atoms"),
          ]
        : [
            t("一根金属杆", "A metal bar"),
            t("内部的晶粒", "Grains inside"),
            t("排列的原子", "Arranged atoms"),
          ];
  const caption = electronic
    ? t(
        "云状区域表示可能找到电子的位置。电子不是沿着一条固定轨道绕圈的小球。",
        "The cloud marks possible places to find an electron. An electron is not a tiny ball circling along a fixed track.",
      )
    : bonding
      ? t(
          "这里画的是成键的直觉示意。不同的电子分布会产生不同的键，进而影响材料的强度和导电性。",
          "This is a schematic picture of bonding. Different electron distributions create different bonds and help explain strength and conductivity.",
        )
      : limits
        ? t(
            "看清原子并不自动意味着能算出整座桥。先明确要回答的问题，再决定保留哪些细节。",
            "Seeing atoms clearly does not automatically let us calculate a whole bridge. Choose the question first, then decide which details to keep.",
          )
        : t(
            "杆会不会变形，与内部晶粒和原子有关。多尺度建模把不同层次的信息联系起来。",
            "How a bar deforms depends on its grains and atoms. Multiscale modeling connects information across these levels.",
          );
  return (
    <figure className="foundation-figure foundation-intro-figure">
      <h3>{title}</h3>
      <div
        className="foundation-figure-viewport"
        role="region"
        aria-label={title}
        tabIndex={0}
      >
        <svg viewBox="0 0 720 220" role="img" aria-label={title}>
          <defs>
            <radialGradient id={`intro-cloud-${id}`}>
              <stop
                offset="0"
                stopColor="var(--figure-teal)"
                stopOpacity=".6"
              />
              <stop offset="1" stopColor="var(--figure-teal)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {labels.map((label, i) => (
            <g key={label} transform={`translate(${i * 240},0)`}>
              <rect
                x="16"
                y="14"
                width="208"
                height="155"
                rx="18"
                fill="var(--bg)"
              />
              {electronic ? (
                <>
                  {i > 0 && (
                    <circle
                      cx="120"
                      cy="90"
                      r={i === 1 ? 61 : 48}
                      fill={`url(#intro-cloud-${id})`}
                    />
                  )}
                  <circle cx="120" cy="90" r="10" fill="var(--figure-orange)" />
                  {i === 2 && (
                    <>
                      <circle
                        cx="87"
                        cy="90"
                        r="36"
                        fill={`url(#intro-cloud-${id})`}
                      />
                      <circle
                        cx="153"
                        cy="90"
                        r="36"
                        fill={`url(#intro-cloud-${id})`}
                      />
                    </>
                  )}
                </>
              ) : bonding ? (
                <>
                  <ellipse
                    cx={i === 0 ? 78 : 101}
                    cy="90"
                    rx={i === 2 ? 65 : 40}
                    ry="46"
                    fill={`url(#intro-cloud-${id})`}
                  />
                  <ellipse
                    cx={i === 0 ? 162 : 139}
                    cy="90"
                    rx={i === 2 ? 65 : 40}
                    ry="46"
                    fill={`url(#intro-cloud-${id})`}
                  />
                  <circle
                    cx={i === 0 ? 78 : 101}
                    cy="90"
                    r="9"
                    fill="var(--figure-orange)"
                  />
                  <circle
                    cx={i === 0 ? 162 : 139}
                    cy="90"
                    r="9"
                    fill="var(--figure-orange)"
                  />
                  {i === 2 && (
                    <path
                      d="M110 90h20"
                      stroke="var(--figure-teal)"
                      strokeWidth="4"
                    />
                  )}
                </>
              ) : i === 0 ? (
                <>
                  <path
                    d="M45 67h130l22 20H67Z"
                    fill="var(--figure-teal)"
                    opacity=".5"
                  />
                  <path
                    d="M67 87h130v33H67Z"
                    fill="var(--figure-teal)"
                    opacity=".8"
                  />
                  <path
                    d="M45 67l22 20v33l-22-20Z"
                    fill="var(--figure-ink)"
                    opacity=".4"
                  />
                </>
              ) : i === 1 ? (
                <g stroke="var(--figure-teal)" strokeWidth="2" fill="none">
                  <rect x="55" y="43" width="130" height="100" rx="5" />
                  <path d="M95 43l20 35-23 31-37-8m60-23 37 10 33-27m-93 48 18 34m42-55-12 55" />
                </g>
              ) : (
                Array.from({ length: 20 }, (_, j) => (
                  <circle
                    key={j}
                    cx={64 + (j % 5) * 28}
                    cy={48 + Math.floor(j / 5) * 28}
                    r="8"
                    fill="var(--figure-teal)"
                    opacity={j === 7 ? 0.3 : 0.85}
                  />
                ))
              )}
              <text
                x="120"
                y="200"
                textAnchor="middle"
                className="figure-title"
              >
                {label}
              </text>
              {i < 2 && (
                <path d="M226 90h11m-4-4 4 4-4 4" className="figure-axis" />
              )}
            </g>
          ))}
        </svg>
      </div>
      <figcaption>
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}

export default function FoundationsPage({ id }: { id?: FoundationId }) {
  const { locale, t } = useLanguage();
  const [level, setLevel] = useState<"intro" | "model" | "advanced">("intro");
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  useEffect(() => {
    setLevel("intro");
    setScrollTarget(null);
  }, [id]);
  useEffect(() => {
    if (scrollTarget) {
      goTo(scrollTarget);
      setScrollTarget(null);
    }
  }, [level, scrollTarget]);
  const changeLevel = (next: typeof level, target = "foundation-levels") => {
    setLevel(next);
    setScrollTarget(target);
  };
  if (!id)
    return (
      <div className="page foundations-page">
        <header className="foundation-hero">
          <div className="eyebrow">
            {t(
              "先理解材料，再选择模型",
              "UNDERSTAND THE MATERIAL. CHOOSE THE MODEL.",
            )}
          </div>
          <h1>{t("把基础，连成一幅图。", "Connect the foundations.")}</h1>
          <p>
            {t(
              "从为什么需要多尺度，到一个电子如何参与成键。沿着八个问题，建立读懂建模方法的共同语言。",
              "From why we need multiple scales to how an electron participates in a bond: eight questions build a shared language for understanding models.",
            )}
          </p>
          <a className="button primary" href="#/foundation/why-multiscale">
            {t("从第一个问题开始", "Start with the first question")}
            <ArrowRight size={17} />
          </a>
        </header>
        <FoundationFigure id="why-multiscale" />
        {(["scales", "atoms", "materials"] as const).map((group, n) => (
          <section className="foundation-group" key={group}>
            <div className="foundation-group-heading">
              <span>0{n + 1}</span>
              <div>
                <h2>
                  {group === "scales"
                    ? t("认识模型与预测", "Models and predictions")
                    : group === "atoms"
                      ? t("走进电子与原子", "Electrons and atoms")
                      : t(
                          "从成键到材料性质",
                          "From bonding to material properties",
                        )}
                </h2>
                <p>
                  {group === "scales"
                    ? t(
                        "为什么建模？什么被保留，什么被忽略？",
                        "Why model? What is retained, and what is left out?",
                      )
                    : group === "atoms"
                      ? t(
                          "用概率、能量和量子态理解微观世界。",
                          "Understand the microscopic world through probability, energy and quantum states.",
                        )
                      : t(
                          "把原子连接起来，理解导电性与稳定性。",
                          "Connect atoms to understand electronic behavior and stability.",
                        )}
                </p>
              </div>
            </div>
            <div className="foundation-card-grid">
              {foundationIndex
                .filter((x) => x.group === group)
                .map((item) => (
                  <a
                    className="foundation-card"
                    key={item.id}
                    href={`#/foundation/${item.id}`}
                  >
                    <div className="foundation-card-top">
                      <span>
                        {String(foundationIndex.indexOf(item) + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                      <ArrowUpRight size={19} />
                    </div>
                    <h3>{item.title[locale]}</h3>
                    <p>{item.summary[locale]}</p>
                    <span className="foundation-card-action">
                      {t("进入这一章", "Explore this chapter")}
                      <ArrowRight size={15} />
                    </span>
                  </a>
                ))}
            </div>
          </section>
        ))}
        <div className="foundation-next-methods">
          <BookOpen size={25} />
          <div>
            <h2>
              {t(
                "已经熟悉这些概念？",
                "Already comfortable with the foundations?",
              )}
            </h2>
            <p>
              {t(
                "回到尺度地图，为你的物理问题选择合适的方法。",
                "Return to the scale map and choose a method for your physical question.",
              )}
            </p>
          </div>
          <a className="button secondary" href="#/">
            {t("探索建模方法", "Explore the methods")}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );

  const lesson = getFoundation(id, locale);
  const index = foundationIndex.findIndex((x) => x.id === id);
  const methods = locale === "zh" ? methodsZh : methodsEn;
  const widget =
    id === "atomic-orbitals" ? (
      <Orbitals beginner={level === "intro"} />
    ) : ["error-propagation", "band-structure", "formation-energy"].includes(
        id,
      ) ? (
      <Experiments id={id} beginner={level === "intro"} />
    ) : null;
  return (
    <article className="page foundation-lesson" data-foundation={id}>
      <a className="back-link" href="#/foundations">
        <ChevronLeft size={15} />
        {t("返回基础知识", "Back to foundations")}
      </a>
      <header className="foundation-hero">
        <div className="eyebrow">
          {t("基础知识", "FOUNDATIONS")}
          <span className="eyebrow-line" />
          {String(index + 1).padStart(2, "0")} / 08
        </div>
        <h1>{lesson.title}</h1>
        <p className="foundation-subtitle">{lesson.subtitle}</p>
        {level !== "intro" && (
          <div className="foundation-reading-time">
            <Clock3 size={15} />
            {t(
              `阅读约 ${lesson.readMinutes} 分钟`,
              `About ${lesson.readMinutes} min to read`,
            )}
          </div>
        )}
      </header>
      <div
        className="learning-levels"
        id="foundation-levels"
        role="tablist"
        aria-label={t("选择阅读层次", "Choose a learning level")}
      >
        {(
          [
            ["intro", t("先看现象", "See the idea")],
            ["model", t("理解模型", "Understand the model")],
            ["advanced", t("公式与推导", "Equations & derivations")],
          ] as const
        ).map(([value, label], i) => (
          <button
            type="button"
            key={value}
            id={`foundation-tab-${value}`}
            data-testid={`foundation-level-${value}`}
            role="tab"
            aria-selected={level === value}
            aria-controls="foundation-level-panel"
            tabIndex={level === value ? 0 : -1}
            className={level === value ? "active" : ""}
            onClick={() => changeLevel(value)}
            onKeyDown={(event) => {
              const values = ["intro", "model", "advanced"] as const;
              const next =
                event.key === "ArrowRight"
                  ? (i + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (i + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : -1;
              if (next < 0) return;
              event.preventDefault();
              changeLevel(values[next]);
              document
                .getElementById(`foundation-tab-${values[next]}`)
                ?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <div
        className="foundation-reading"
        id="foundation-level-panel"
        role="tabpanel"
        aria-labelledby={`foundation-tab-${level}`}
        data-level={level}
      >
        {level === "intro" && (
          <>
            <BeginnerIntro id={id} onContinue={() => changeLevel("model")}>
              <div
                id={`foundation-${id}-exploration`}
                className="foundation-intro-exploration"
              >
                {widget ? (
                  <Suspense
                    fallback={
                      <p className="loading-panel">
                        {t("正在展开图示…", "Opening the exploration…")}
                      </p>
                    }
                  >
                    {widget}
                  </Suspense>
                ) : (
                  <FoundationIntroFigure id={id} />
                )}
              </div>
            </BeginnerIntro>
          </>
        )}
        {level === "model" && (
          <>
            <MathMarkdown className="foundation-lead">
              {lesson.lead}
            </MathMarkdown>
            <section className="learning-objectives">
              <h2>
                {t("这一章要回答的问题", "Questions this chapter will answer")}
              </h2>
              <ul>
                {lesson.objectives.map((x, i) => (
                  <li key={i}>
                    <MathMarkdown>{x}</MathMarkdown>
                  </li>
                ))}
              </ul>
            </section>
            <nav
              className="foundation-outline"
              aria-label={t("本章目录", "Chapter contents")}
            >
              <span>{t("沿着这个顺序阅读", "FOLLOW THE IDEAS")}</span>
              {lesson.sections.map((s, i) => (
                <a
                  href={`#foundation-${id}-${s.id}`}
                  key={s.id}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(`foundation-${id}-${s.id}`);
                  }}
                >
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {s.title.replace(/^\d+\s*·\s*/, "")}
                </a>
              ))}
              <a
                href={`#foundation-${id}-derivation`}
                onClick={(e) => {
                  e.preventDefault();
                  changeLevel("advanced", `foundation-${id}-derivation`);
                }}
              >
                <b>↳</b>
                {t("一步步推导与练习", "Derivation and practice")}
              </a>
            </nav>
            {lesson.sections.map((s, i) => (
              <Fragment key={s.id}>
                <section
                  className="foundation-section"
                  id={`foundation-${id}-${s.id}`}
                >
                  <div className="theory-section-heading">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <h2>{s.title.replace(/^\d+\s*·\s*/, "")}</h2>
                  </div>
                  {s.paragraphs.map((p, j) => (
                    <MathMarkdown key={j}>{p}</MathMarkdown>
                  ))}
                  {(s.equation || s.equationNote) && (
                    <details className="foundation-equation-disclosure">
                      <summary>
                        {t(
                          "用公式表达这个想法",
                          "Express this idea as an equation",
                        )}
                      </summary>
                      {s.equation && (
                        <div className="theory-formula">
                          <MathMarkdown display>{s.equation}</MathMarkdown>
                        </div>
                      )}
                      {s.equationNote && (
                        <MathMarkdown className="foundation-equation-note">
                          {s.equationNote}
                        </MathMarkdown>
                      )}
                    </details>
                  )}
                  {s.bullets && (
                    <ul>
                      {s.bullets.map((b, j) => (
                        <li key={j}>
                          <MathMarkdown>{b}</MathMarkdown>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.table && (
                    <div
                      className="foundation-table-scroll"
                      tabIndex={0}
                      role="region"
                      aria-label={s.title.replace(/^\d+\s*·\s*/, "")}
                    >
                      <table className="foundation-table">
                        <caption>{s.title.replace(/^\d+\s*·\s*/, "")}</caption>
                        <thead>
                          <tr>
                            {s.table.headers.map((h, j) => (
                              <th key={j} scope="col">
                                <MathMarkdown inline>{h}</MathMarkdown>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.table.rows.map((r, j) => (
                            <tr key={j}>
                              {r.map((c, k) =>
                                k === 0 ? (
                                  <th scope="row" key={k}>
                                    <MathMarkdown>{c}</MathMarkdown>
                                  </th>
                                ) : (
                                  <td key={k}>
                                    <MathMarkdown>{c}</MathMarkdown>
                                  </td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
                {i === 0 && <FoundationFigure id={id} />}
                {i === 1 && widget && (
                  <Suspense
                    fallback={
                      <p className="loading-panel">
                        {t("正在展开图示…", "Opening the exploration…")}
                      </p>
                    }
                  >
                    {widget}
                  </Suspense>
                )}
              </Fragment>
            ))}
            <div className="learning-next">
              <p>
                {t(
                  "已经能用自己的话解释现象？接下来看看这些关系怎样写成方程。",
                  "Can you explain the idea in your own words? Next, see how the relationships become equations.",
                )}
              </p>
              <button
                className="button primary"
                onClick={() => changeLevel("advanced")}
              >
                {t("下一步：公式与推导", "Next: equations & derivations")}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
        {level === "advanced" && (
          <>
            <div className="learning-level-note">
              <p>
                {t(
                  "这一层保留完整推导与计算练习。遇到不熟悉的词，可以先回到「理解模型」。",
                  "This level contains the derivations and numerical practice. Return to “Understand the model” whenever a term feels unfamiliar.",
                )}
              </p>
              <button
                className="button secondary"
                onClick={() => changeLevel("model")}
              >
                {t("回顾模型", "Review the model")}
              </button>
            </div>
            <section
              className="foundation-derivation"
              id={`foundation-${id}-derivation`}
            >
              <div className="eyebrow">
                {t("从直觉走向方程", "FROM INTUITION TO EQUATIONS")}
              </div>
              <h2>{lesson.derivation.title}</h2>
              <MathMarkdown>{lesson.derivation.intro}</MathMarkdown>
              <ol className="derivation-steps">
                {lesson.derivation.steps.map((step, i) => (
                  <li className="derivation-step" key={i}>
                    <span className="derivation-step-number">0{i + 1}</span>
                    <div className="derivation-step-content">
                      <h3>{step.title}</h3>
                      <MathMarkdown>{step.explanation}</MathMarkdown>
                      <MathMarkdown display>{step.formula}</MathMarkdown>
                      {step.note && (
                        <MathMarkdown className="foundation-equation-note">
                          {step.note}
                        </MathMarkdown>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            <section className="worked-example">
              <div className="eyebrow">
                {t("一起算一个例子", "A WORKED EXAMPLE")}
              </div>
              <h2>{lesson.example.title}</h2>
              <MathMarkdown>{lesson.example.problem}</MathMarkdown>
              <ol>
                {lesson.example.solution.map((s, i) => (
                  <li key={i}>
                    <MathMarkdown>{s}</MathMarkdown>
                  </li>
                ))}
              </ol>
              <div className="foundation-example-result">
                <MathMarkdown>{lesson.example.result}</MathMarkdown>
              </div>
            </section>
          </>
        )}
        {level !== "intro" && (
          <>
            <section className="foundation-misconceptions">
              <h2>{t("几个容易混淆的地方", "Common points of confusion")}</h2>
              {lesson.misconceptions.map((m, i) => (
                <div key={i}>
                  <h3>
                    <MathMarkdown inline>{m.myth}</MathMarkdown>
                  </h3>
                  <MathMarkdown>{m.correction}</MathMarkdown>
                </div>
              ))}
            </section>
            <section className="self-check">
              <h2>
                {t(
                  "停下来，检验一下理解",
                  "Pause and check your understanding",
                )}
              </h2>
              {lesson.questions.map((q, i) => (
                <details key={i}>
                  <summary>
                    <MathMarkdown inline>{q.question}</MathMarkdown>
                  </summary>
                  <MathMarkdown>{q.answer}</MathMarkdown>
                </details>
              ))}
            </section>
            <section className="foundation-connections">
              <h2>
                {t("把基础带入建模方法", "Take these ideas into a method")}
              </h2>
              <div className="connection-list">
                {lesson.connections.map((c) => (
                  <a key={c.method} href={`#/method/${c.method}`}>
                    <span
                      className={`connection-abbr ${methods.find((m) => m.id === c.method)!.scale}`}
                    >
                      {methods.find((m) => m.id === c.method)!.short}
                    </span>
                    <div>
                      <h3>{methods.find((m) => m.id === c.method)!.title}</h3>
                      <MathMarkdown>{c.reason}</MathMarkdown>
                    </div>
                    <ArrowUpRight size={18} />
                  </a>
                ))}
              </div>
            </section>
            <section className="foundation-references">
              <h2>{t("继续阅读", "Further reading")}</h2>
              <ol>
                {lesson.references.map((r, i) => (
                  <li key={i}>
                    <a href={r.url} target="_blank" rel="noreferrer noopener">
                      {r.label}
                      <ArrowUpRight size={14} />
                    </a>
                    <p>{r.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </div>
      <nav
        className="chapter-pagination"
        aria-label={t("基础章节导航", "Foundation chapter navigation")}
      >
        <a
          href={
            index > 0
              ? `#/foundation/${foundationIndex[index - 1].id}`
              : "#/foundations"
          }
        >
          <ChevronLeft size={20} />
          <span>
            <small>{t("上一章", "Previous")}</small>
            {index > 0
              ? foundationIndex[index - 1].title[locale]
              : t("基础知识目录", "Foundations index")}
          </span>
        </a>
        <a
          href={
            index < foundationIndex.length - 1
              ? `#/foundation/${foundationIndex[index + 1].id}`
              : "#/"
          }
        >
          <span>
            <small>{t("继续探索", "Continue exploring")}</small>
            {index < foundationIndex.length - 1
              ? foundationIndex[index + 1].title[locale]
              : t("建模方法与尺度地图", "Methods and the scale map")}
          </span>
          <ChevronRight size={20} />
        </a>
      </nav>
    </article>
  );
}
