import type { Method } from "../types";
import { useLanguage } from "../i18n";
import { getTheory } from "../content/theory";
import TheoryFigure from "./TheoryFigure";
export default function TheoryReading({ method }: { method: Method }) {
  const { locale, t } = useLanguage();
  const lesson = getTheory(method.id, locale);
  return (
    <div className="theory-reading">
      <section className="learning-objectives">
        <h2>{t("学完这一节，你将能够", "By the end of this chapter")}</h2>
        <ul>
          {lesson.objectives.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      <TheoryFigure
        id={method.id}
        locale={locale}
        title={lesson.diagram.title}
        caption={lesson.diagram.caption}
      />
      <div className="theory-outline">
        <span>{t("深入理解", "GO DEEPER")}</span>
        {lesson.sections.map((s, i) => (
          <a
            key={i}
            href={`#theory-${method.id}-${i}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(`theory-${method.id}-${i}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {String(i + 1).padStart(2, "0")} · {s.title}
          </a>
        ))}
      </div>
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
            <p key={j}>{p}</p>
          ))}
          {s.formula && (
            <div className="theory-formula" aria-label={t("方程", "Equation")}>
              {s.formula}
            </div>
          )}
          {s.symbols && (
            <dl className="symbol-glossary">
              {s.symbols.map((v, j) => (
                <div key={j}>
                  <dt>{v.symbol}</dt>
                  <dd>{v.meaning}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}
      <section className="worked-example">
        <div className="eyebrow">{t("一步步算一遍", "A WORKED EXAMPLE")}</div>
        <h2>{lesson.workedExample.title}</h2>
        <p>{lesson.workedExample.given}</p>
        <ol>
          {lesson.workedExample.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <div className="example-result">
          <strong>{t("得到什么？", "What does this tell us?")}</strong>
          <p>{lesson.workedExample.result}</p>
        </div>
      </section>
      <section className="theory-pitfalls">
        <h2>{t("容易混淆的地方", "Common misconceptions")}</h2>
        <ul>
          {lesson.pitfalls.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
      <section className="self-check">
        <div className="eyebrow">
          {t("停下来想一想", "CHECK YOUR UNDERSTANDING")}
        </div>
        <h2>{lesson.question.prompt}</h2>
        <details>
          <summary>{t("展开参考答案", "Reveal the explanation")}</summary>
          <p>{lesson.question.answer}</p>
        </details>
      </section>
    </div>
  );
}
