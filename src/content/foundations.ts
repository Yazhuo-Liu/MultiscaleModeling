import { scaleFoundations } from "./foundations-scale";
import { atomicFoundations } from "./foundations-atomic";
import { materialFoundations } from "./foundations-materials";
import type { FoundationId, FoundationLesson } from "./foundations-types";
import type { Locale } from "../i18n";

export const foundations: Record<
  FoundationId,
  Record<Locale, FoundationLesson>
> = {
  ...scaleFoundations,
  ...atomicFoundations,
  ...materialFoundations,
};
export const getFoundation = (
  id: FoundationId,
  locale: Locale,
): FoundationLesson => foundations[id][locale];
