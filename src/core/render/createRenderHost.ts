import type { RenderContext } from "../types";

/**
 * Wraps a canvas with resize + rAF helpers shared by all WebGL demos.
 * Modules only implement scene logic; the host owns lifecycle.
 */
export function createRenderHost(
  canvas: HTMLCanvasElement,
): { ctx: RenderContext; resize: () => void; destroy: () => void } {
  let disposed = false;
  const pending = new Set<number>();

  const requestFrame = (cb: FrameRequestCallback) => {
    const id = requestAnimationFrame((t) => {
      pending.delete(id);
      if (!disposed) cb(t);
    });
    pending.add(id);
    return id;
  };

  const cancelFrame = (id: number) => {
    cancelAnimationFrame(id);
    pending.delete(id);
  };

  const measure = () => {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || canvas.clientWidth || 640;
    const height = parent?.clientHeight || canvas.clientHeight || 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return { width, height };
  };

  let size = measure();

  const ctx: RenderContext = {
    canvas,
    get width() {
      return size.width;
    },
    get height() {
      return size.height;
    },
    requestFrame,
    cancelFrame,
  };

  const resize = () => {
    size = measure();
  };

  const destroy = () => {
    disposed = true;
    for (const id of pending) cancelAnimationFrame(id);
    pending.clear();
  };

  return { ctx, resize, destroy };
}
