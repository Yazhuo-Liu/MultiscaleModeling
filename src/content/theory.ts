import type { MethodId } from "../types";
import type { Locale } from "../i18n";
import { microscopicTheory } from "./theory-microscopic";
import { mesoscopicTheory } from "./theory-mesoscopic";
import { continuumTheory } from "./theory-continuum";
export interface DerivationStage {
  level: "simple" | "general" | "extension";
  title: string;
  assumptions: string[];
  steps: { explanation: string; formula: string }[];
  conclusion: string;
}
export interface TheoryLesson {
  derivation: {
    title: string;
    introduction: string;
    stages: DerivationStage[];
  };
  objectives: string[];
  sections: {
    title: string;
    paragraphs: string[];
    formula?: string;
    symbols?: { symbol: string; meaning: string }[];
  }[];
  workedExample: {
    title: string;
    given: string;
    steps: string[];
    result: string;
  };
  pitfalls: string[];
  question: { prompt: string; answer: string };
  diagram: { title: string; caption: string; labels: string[] };
}
export type TheorySet = Partial<Record<MethodId, Record<Locale, TheoryLesson>>>;
const lessons: TheorySet = {
  ...microscopicTheory,
  ...mesoscopicTheory,
  ...continuumTheory,
};
export function getTheory(id: MethodId, locale: Locale): TheoryLesson {
  return lessons[id]![locale];
}
