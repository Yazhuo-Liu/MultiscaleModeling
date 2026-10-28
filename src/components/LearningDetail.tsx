import type { ReactNode } from "react";

/** Keep optional detail within reach without making it the entry point. */
export default function LearningDetail({
  collapsed,
  title,
  children,
  testId,
}: {
  collapsed: boolean;
  title: string;
  children: ReactNode;
  testId?: string;
}) {
  return collapsed ? (
    <details className="learning-detail" data-testid={testId}>
      <summary>{title}</summary>
      <div className="learning-detail-body">{children}</div>
    </details>
  ) : (
    <>{children}</>
  );
}
