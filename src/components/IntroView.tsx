import type { IntroContent } from "@/core/types";

interface Props {
  intro: IntroContent;
}

export function IntroView({ intro }: Props) {
  return (
    <article className="intro-view">
      <p className="intro-lead">{intro.lead}</p>
      {intro.sections.map((s) => (
        <section key={s.heading} className="intro-section">
          <h3>{s.heading}</h3>
          <p>{s.body}</p>
        </section>
      ))}
      {intro.references && intro.references.length > 0 ? (
        <section className="intro-section">
          <h3>延伸阅读</h3>
          <ul className="ref-list">
            {intro.references.map((r) => (
              <li key={r.label}>
                {r.href ? (
                  <a href={r.href} target="_blank" rel="noreferrer">
                    {r.label}
                  </a>
                ) : (
                  r.label
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
