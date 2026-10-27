import type { Method } from "../types";
import { useLanguage } from "../i18n";
import { getTheory } from "../content/theory";
import TheoryFigure from "./TheoryFigure";
import MathMarkdown from "./MathMarkdown";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}

export default function TheoryReading({ method }: { method: Method }) {
  const { locale, t } = useLanguage();
  const lesson = getTheory(method.id, locale);
  const levels = {
    simple: t("从简单情形出发", "Start with a simple case"),
    general: t("引入更一般的情形", "Build the general case"),
    extension: t("向更广的问题扩展", "Extend the model"),
  };
  return (
    <div className="theory-reading">
      <section className="learning-objectives">
        <h2>{t("学完这一节，你将能够", "By the end of this chapter")}</h2>
        <ul>
          {lesson.objectives.map((x) => (
            <li key={x}>
              <MathMarkdown>{x}</MathMarkdown>
            </li>
          ))}
        </ul>
      </section>
      <TheoryFigure
        id={method.id}
        locale={locale}
        title={lesson.diagram.title}
        caption={lesson.diagram.caption}
      />
      <nav
        className="theory-outline"
        aria-label={t("本章理论导航", "Theory navigation")}
      >
        <span>{t("深入理解", "GO DEEPER")}</span>
        {lesson.sections.map((s, i) => (
          <a
            key={i}
            href={`#theory-${method.id}-${i}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(`theory-${method.id}-${i}`);
            }}
          >
            {String(i + 1).padStart(2, "0")} · {s.title}
          </a>
        ))}
        <a
          href={`#derive-${method.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(`derive-${method.id}`);
          }}
        >
          {t(
            "逐步推导：简单 → 一般 → 扩展",
            "Step-by-step derivation: simple → general → extended",
          )}
        </a>
      </nav>
      {lesson.sections.map((s, i) => (
        <section
          className="theory-section"
          id={`theory-${method.id}-${i}`}
          key={i}
        >
          <div className="theory-section-heading">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h2>{s.title}</h2>
          </div>
          {s.paragraphs.map((p, j) => (
            <MathMarkdown key={j}>{p}</MathMarkdown>
          ))}
          {s.formula && (
            <div className="theory-formula" aria-label={t("方程", "Equation")}>
              <MathMarkdown display>{s.formula}</MathMarkdown>
            </div>
          )}
          {s.symbols && (
            <dl className="symbol-glossary">
              {s.symbols.map((v, j) => (
                <div key={j}>
                  <dt>
                    <MathMarkdown inlineMath>{v.symbol}</MathMarkdown>
                  </dt>
                  <dd>
                    <MathMarkdown>{v.meaning}</MathMarkdown>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}
      <section className="derivation-path" id={`derive-${method.id}`}>
        <header className="derivation-heading">
          <div className="eyebrow">
            {t("把公式一步步推出来", "BUILD THE EQUATIONS")}
          </div>
          <h2>{lesson.derivation.title}</h2>
          <MathMarkdown>{lesson.derivation.introduction}</MathMarkdown>
        </header>
        <nav
          className="derivation-map"
          aria-label={t("推导阶段", "Derivation stages")}
        >
          {lesson.derivation.stages.map((stage, i) => (
            <a
              key={stage.level}
              href={`#derive-${method.id}-${stage.level}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(`derive-${method.id}-${stage.level}`);
              }}
            >
              <span>0{i + 1}</span>
              {levels[stage.level]}
            </a>
          ))}
        </nav>
        {lesson.derivation.stages.map((stage, i) => (
          <section
            className={`derivation-stage stage-${stage.level}`}
            id={`derive-${method.id}-${stage.level}`}
            key={stage.level}
          >
            <div className="derivation-stage-label">
              <span>0{i + 1}</span>
              {levels[stage.level]}
            </div>
            <h3>{stage.title}</h3>
            <div className="derivation-assumptions">
              <h4>{t("先说明假设", "Start with the assumptions")}</h4>
              <ul>
                {stage.assumptions.map((a, j) => (
                  <li key={j}>
                    <MathMarkdown>{a}</MathMarkdown>
                  </li>
                ))}
              </ul>
            </div>
            <ol className="derivation-steps">
              {stage.steps.map((step, j) => (
                <li className="derivation-step" key={j}>
                  <span className="derivation-step-number">
                    {i + 1}.{j + 1}
                  </span>
                  <div className="derivation-step-content">
                    <MathMarkdown>{step.explanation}</MathMarkdown>
                    <MathMarkdown display>{step.formula}</MathMarkdown>
                  </div>
                </li>
              ))}
            </ol>
            <div className="derivation-takeaway">
              <strong>
                {t("这一阶段说明了什么", "What this stage tells us")}
              </strong>
              <MathMarkdown>{stage.conclusion}</MathMarkdown>
            </div>
          </section>
        ))}
      </section>
      <section className="worked-example">
        <div className="eyebrow">{t("一步步算一遍", "A WORKED EXAMPLE")}</div>
        <h2>
          <MathMarkdown inline>{lesson.workedExample.title}</MathMarkdown>
        </h2>
        <MathMarkdown>{lesson.workedExample.given}</MathMarkdown>
        <ol>
          {lesson.workedExample.steps.map((s, i) => (
            <li key={i}>
              <MathMarkdown>{s}</MathMarkdown>
            </li>
          ))}
        </ol>
        <div className="example-result">
          <strong>{t("得到什么？", "What does this tell us?")}</strong>
          <MathMarkdown>{lesson.workedExample.result}</MathMarkdown>
        </div>
      </section>
      <section className="theory-pitfalls">
        <h2>{t("容易混淆的地方", "Common misconceptions")}</h2>
        <ul>
          {lesson.pitfalls.map((p) => (
            <li key={p}>
              <MathMarkdown>{p}</MathMarkdown>
            </li>
          ))}
        </ul>
      </section>
      <section className="self-check">
        <div className="eyebrow">
          {t("停下来想一想", "CHECK YOUR UNDERSTANDING")}
        </div>
        <h2>
          <MathMarkdown inline>{lesson.question.prompt}</MathMarkdown>
        </h2>
        <details>
          <summary>{t("展开参考答案", "Reveal the explanation")}</summary>
          <MathMarkdown>{lesson.question.answer}</MathMarkdown>
        </details>
      </section>
    </div>
  );
}
