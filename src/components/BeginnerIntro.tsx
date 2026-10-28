import { ArrowRight, Eye, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { getBeginner } from "../content/beginner";
import type { FoundationId } from "../content/foundations-types";
import type { MethodId } from "../types";
import { useLanguage } from "../i18n";

export default function BeginnerIntro({
  id,
  onExplore,
  onContinue,
  children,
}: {
  id: MethodId | FoundationId;
  onExplore?: () => void;
  onContinue?: () => void;
  children?: ReactNode;
}) {
  const { locale, t } = useLanguage();
  const lesson = getBeginner(id, locale);
  return (
    <div className="beginner-intro" data-lesson={id}>
      <section className="beginner-question">
        <div className="eyebrow muted">
          <Sparkles size={16} aria-hidden="true" />
          {t("从一个问题开始", "START WITH A QUESTION")}
        </div>
        <h2>{lesson.question}</h2>
        <p>{lesson.everyday}</p>
      </section>
      {children}
      <ol className="beginner-steps">
        {lesson.steps.map((step, i) => (
          <li className="beginner-step" key={i}>
            <span className="step-number" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="beginner-takeaway">
        <strong>{t("先记住这一点", "THE IDEA TO KEEP")}</strong>
        <p>{lesson.takeaway}</p>
      </div>
      <section className="beginner-observation">
        <h3>
          <Eye size={18} aria-hidden="true" />
          {t("带着问题去观察", "WATCH WITH A QUESTION")}
        </h3>
        <p>{lesson.tryThis}</p>
        <p>{lesson.notice}</p>
      </section>
      <details className="beginner-vocabulary">
        <summary>{t("认识三个词", "Three useful words")}</summary>
        <dl>
          {lesson.vocabulary.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </details>
      {(onExplore || onContinue) && (
        <div className="beginner-actions">
          {onExplore && (
            <button className="button primary" onClick={onExplore}>
              {t("动手看一看", "Explore the demo")}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
          {onContinue && (
            <button className="button secondary" onClick={onContinue}>
              {t("下一步：理解模型", "Next: understand the model")}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
