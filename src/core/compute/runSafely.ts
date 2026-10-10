import type { ComputeContext, ComputeResult } from "../types";

/** Throw if the compute run was aborted. */
export function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    const err = new Error("Compute aborted");
    err.name = "AbortError";
    throw err;
  }
}

/** Yield to the event loop so UI stays responsive during long demos. */
export function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 32 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Helper for chunked numeric loops in browser demos.
 * Calls `step(i)` for i in [0, n), yielding every `chunk` iterations.
 */
export async function forEachChunked(
  n: number,
  chunk: number,
  step: (i: number) => void,
  ctx: ComputeContext,
): Promise<void> {
  for (let i = 0; i < n; i++) {
    throwIfAborted(ctx.signal);
    step(i);
    if (i > 0 && i % chunk === 0) {
      ctx.onProgress?.(i / n);
      await yieldToMain();
    }
  }
  ctx.onProgress?.(1);
}

export function emptyResult(summary: string): ComputeResult {
  return { summary };
}
