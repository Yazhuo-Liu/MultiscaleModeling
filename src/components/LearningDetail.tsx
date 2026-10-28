import type { ReactNode } from "react";

/** Keep optional detail within reach without making it the entry point. */
export default function LearningDetail({
  collapsed,
  title,
  children,
}: {
  collapsed: boolean;
  title: string;
  children: ReactNode;
}) {
  return collapsed ? (
    <details className="learning-detail">
      <summary>{title}</summary>
      <div className="learning-detail-body">{children}</div>
    </details>
  ) : (
    <>{children}</>
  );
}
