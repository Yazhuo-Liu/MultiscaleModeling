import type { ModelingModule, ScaleBand } from "./types";
import { SCALE_ORDER } from "./types";

const modules = new Map<string, ModelingModule>();

/** Register a module. Called once from `src/modules/index.ts`. */
export function registerModule(mod: ModelingModule): void {
  if (modules.has(mod.id)) {
    throw new Error(`Module already registered: ${mod.id}`);
  }
  modules.set(mod.id, mod);
}

export function getModule(id: string): ModelingModule | undefined {
  return modules.get(id);
}

export function listModules(): ModelingModule[] {
  return SCALE_ORDER.flatMap((scale) =>
    [...modules.values()].filter((m) => m.scale === scale),
  ).concat(
    [...modules.values()].filter(
      (m) => !SCALE_ORDER.includes(m.scale as ScaleBand),
    ),
  );
}

export function modulesByScale(scale: ScaleBand): ModelingModule[] {
  return [...modules.values()].filter((m) => m.scale === scale);
}

export function allModuleIds(): string[] {
  return [...modules.keys()];
}
