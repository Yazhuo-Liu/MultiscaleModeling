export type MethodId =
  | "dft"
  | "hf"
  | "md"
  | "mc"
  | "dd"
  | "kmc"
  | "phase-field"
  | "crystal-plasticity"
  | "constitutive"
  | "fem"
  | "fdm";
export type ScaleId =
  "electronic" | "atomistic" | "mesoscopic" | "microstructure" | "continuum";
export interface Method {
  id: MethodId;
  scale: ScaleId;
  title: string;
  english: string;
  short: string;
  tagline: string;
  description: string;
  length: string;
  time: string;
  difficulty: string;
  prerequisites: string[];
  intuition: string;
  concepts: { title: string; body: string }[];
  equation: { formula: string; explanation: string };
  steps: string[];
  code: string;
  codeLanguage: string;
  experiment: {
    title: string;
    description: string;
    observe: string[];
    limitations: string;
  };
  applications: string[];
  limitations: string[];
  connections: { id: MethodId; reason: string }[];
  references: { title: string; author: string; url: string }[];
}
export interface Control {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit?: string;
}
export interface Point3 {
  x: number;
  y: number;
  z: number;
  value?: number;
  radius?: number;
}
export interface SimulationFrame {
  time: number;
  points?: Point3[];
  edges?: [number, number][];
  grid?: { width: number; height: number; values: number[] };
  /** Cartesian volume; x varies fastest: x + width * (y + height * z). */
  volume?: { width: number; height: number; depth: number; values: number[] };
  /** Side length of a centered cubic simulation box, in the model's units. */
  box?: number;
  curves?: { name: string; points: [number, number][] }[];
  metrics: { label: string; value: number; unit?: string }[];
}
export interface Simulation {
  step: (steps?: number) => SimulationFrame;
  reset: (params?: Record<string, number>) => SimulationFrame;
}
export interface SimulationDefinition {
  controls: Control[];
  view: "particles" | "field" | "curves" | "mesh";
  description: string;
}
