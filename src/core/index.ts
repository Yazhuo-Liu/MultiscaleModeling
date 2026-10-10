export type {
  ScaleBand,
  IntroSection,
  IntroContent,
  RenderContext,
  RenderDemo,
  ComputeParam,
  ComputeResult,
  ComputeContext,
  ComputeDemo,
  ModelingModule,
} from "./types";
export { SCALE_LABELS, SCALE_ORDER } from "./types";
export {
  registerModule,
  getModule,
  listModules,
  modulesByScale,
  allModuleIds,
} from "./registry";
export { createRenderHost } from "./render/createRenderHost";
export { mountSimpleScene, physicalMat } from "./render/simpleScene";
export {
  throwIfAborted,
  yieldToMain,
  forEachChunked,
  emptyResult,
} from "./compute/runSafely";
