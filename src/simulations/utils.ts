export function randomGenerator(seed = 24103) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  };
}
export const clamp = (x: number, low: number, high: number) =>
  Math.max(low, Math.min(high, x));
export const countSteps = (n = 1) =>
  Math.round(clamp(Number.isFinite(n) ? n : 1, 1, 100));
export function parameter(
  p: Record<string, number>,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const value = p[key];
  return Number.isFinite(value) ? clamp(value, min, max) : fallback;
}
