import type { MethodId } from "../types";

export type FoundationId =
  | "why-multiscale"
  | "scales-and-limits"
  | "error-propagation"
  | "electronic-structure"
  | "atomic-orbitals"
  | "bonding"
  | "band-structure"
  | "formation-energy";

export interface FoundationLesson {
  title: string;
  subtitle: string;
  lead: string;
  readMinutes: number;
  objectives: string[];
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    equation?: string;
    equationNote?: string;
    bullets?: string[];
    table?: { headers: string[]; rows: string[][] };
  }[];
  derivation: {
    title: string;
    intro: string;
    steps: {
      title: string;
      explanation: string;
      formula: string;
      note?: string;
    }[];
  };
  example: {
    title: string;
    problem: string;
    solution: string[];
    result: string;
  };
  misconceptions: { myth: string; correction: string }[];
  questions: { question: string; answer: string }[];
  connections: { method: MethodId; reason: string }[];
  references: { label: string; url: string; detail: string }[];
}
