import type { ComponentType } from "react";

/** Spatial / temporal scale band for multiscale taxonomy. */
export type ScaleBand =
  | "electronic"
  | "atomic"
  | "mesoscale"
  | "continuum"
  | "cross-scale";

/** Static educational content for a module's introduction tab. */
export interface IntroSection {
  heading: string;
  body: string;
}

export interface IntroContent {
  /** One-line pitch shown under the module title. */
  lead: string;
  /** Ordered sections (theory, assumptions, typical workflow, …). */
  sections: IntroSection[];
  /** Optional further reading / references. */
  references?: { label: string; href?: string }[];
}

/**
 * WebGL / canvas demo host context.
 * Modules receive a canvas and must clean up in `dispose`.
 */
export interface RenderContext {
  canvas: HTMLCanvasElement;
  /** CSS pixel size; DPR is applied by the host when resizing. */
  width: number;
  height: number;
  /** Prefer this for animation loops so the host can pause off-screen. */
  requestFrame: (cb: FrameRequestCallback) => number;
  cancelFrame: (id: number) => void;
}

export interface RenderDemo {
  /** Short label for the Render tab. */
  label?: string;
  /** Set up scene; return dispose callback. */
  mount: (ctx: RenderContext) => () => void;
}

/**
 * Browser-side lightweight compute demo.
 * Prefer pure JS/TS; WASM can be swapped in behind the same contract later.
 */
export interface ComputeParam {
  id: string;
  label: string;
  type: "number" | "select" | "boolean";
  default: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface ComputeResult {
  /** Primary numeric / textual summary. */
  summary: string;
  /** Optional series for simple charts (x, y pairs). */
  series?: { x: number; y: number; label?: string }[];
  /** Free-form table rows. */
  table?: { headers: string[]; rows: (string | number)[][] };
}

export interface ComputeContext {
  /** Abort long runs when the user leaves the tab or starts another job. */
  signal: AbortSignal;
  /** Optional progress 0–1 for UI. */
  onProgress?: (ratio: number, message?: string) => void;
}

export interface ComputeDemo {
  label?: string;
  description?: string;
  params: ComputeParam[];
  /**
   * Run a lightweight demo. Must be cancellable via `ctx.signal`.
   * Keep work chunked (await / requestIdleCallback) so the UI stays responsive.
   */
  run: (
    values: Record<string, number | string | boolean>,
    ctx: ComputeContext,
  ) => Promise<ComputeResult>;
}

/**
 * A self-contained educational unit.
 * Add a new folder under `src/modules/<id>/`, export a ModelingModule,
 * and register it in `src/modules/index.ts` — no other wiring required.
 */
export interface ModelingModule {
  id: string;
  title: string;
  /** Short card blurb on the home scale map. */
  summary: string;
  scale: ScaleBand;
  /** Accent used on cards / scale map (CSS color). */
  accent: string;
  tags?: string[];
  intro: IntroContent;
  /** Optional custom React panel instead of default markdown-like intro. */
  IntroPanel?: ComponentType;
  render?: RenderDemo;
  compute?: ComputeDemo;
  /** Optional custom React panels for advanced demos. */
  RenderPanel?: ComponentType;
  ComputePanel?: ComponentType;
}

export const SCALE_LABELS: Record<ScaleBand, string> = {
  electronic: "电子尺度",
  atomic: "原子 / 分子尺度",
  mesoscale: "介观尺度",
  continuum: "连续介质尺度",
  "cross-scale": "跨尺度",
};

export const SCALE_ORDER: ScaleBand[] = [
  "electronic",
  "atomic",
  "mesoscale",
  "continuum",
  "cross-scale",
];
