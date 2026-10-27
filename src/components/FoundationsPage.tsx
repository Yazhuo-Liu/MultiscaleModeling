import { Fragment, lazy, Suspense } from "react";
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

const Orbitals = lazy(() =>
  import("./OrbitalExplorer").then((m) => ({ default: m.OrbitalExplorer })),
);
const Experiments = lazy(() =>
  import("./FoundationExperiments").then((m) => ({
    default: ({ id }: { id: FoundationId }) =>
      id === "error-propagation" ? (
        <m.UncertaintyExplorer />
      ) : id === "band-structure" ? (
        <m.BandExplorer />
      ) : (
        <m.FormationEnergyExplorer />
      ),
  })),
);

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
      <Orbitals />
    ) : ["error-propagation", "band-structure", "formation-energy"].includes(
        id,
      ) ? (
      <Experiments id={id} />
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
        <div className="foundation-reading-time">
          <Clock3 size={15} />
          {t(
            `阅读约 ${lesson.readMinutes} 分钟`,
            `About ${lesson.readMinutes} min to read`,
          )}
        </div>
        <MathMarkdown className="foundation-lead">{lesson.lead}</MathMarkdown>
      </header>
      <div className="foundation-reading">
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
              goTo(`foundation-${id}-derivation`);
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
            {t("停下来，检验一下理解", "Pause and check your understanding")}
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
          <h2>{t("把基础带入建模方法", "Take these ideas into a method")}</h2>
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
