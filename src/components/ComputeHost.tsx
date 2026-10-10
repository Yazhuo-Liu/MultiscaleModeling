import { useEffect, useId, useState, useTransition } from "react";
import type { ComputeDemo, ComputeResult } from "@/core/types";

interface Props {
  demo: ComputeDemo;
}

function initialValues(demo: ComputeDemo): Record<string, number | string | boolean> {
  return Object.fromEntries(demo.params.map((p) => [p.id, p.default]));
}

/** Generic parameter form + run button for browser-side demos. */
export function ComputeHost({ demo }: Props) {
  const formId = useId();
  const [values, setValues] = useState(() => initialValues(demo));
  const [result, setResult] = useState<ComputeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setValues(initialValues(demo));
    setResult(null);
    setError(null);
    setProgress(null);
  }, [demo]);

  useEffect(() => {
    if (!running) return;
    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      setError(null);
      setProgress(0);
      try {
        const out = await demo.run(values, {
          signal: ac.signal,
          onProgress: (r) => {
            if (!cancelled) setProgress(r);
          },
        });
        if (!cancelled) {
          startTransition(() => setResult(out));
          setProgress(1);
        }
      } catch (e) {
        if (!cancelled && (e as Error).name !== "AbortError") {
          setError((e as Error).message || "Compute failed");
        }
      } finally {
        if (!cancelled) {
          setRunning(false);
          setProgress(null);
        }
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [running, demo, values]);

  return (
    <div className="compute-host">
      {demo.description ? (
        <p className="compute-desc">{demo.description}</p>
      ) : null}

      <form
        className="compute-form"
        onSubmit={(e) => {
          e.preventDefault();
          setRunning(true);
        }}
      >
        {demo.params.map((p) => {
          const fieldId = `${formId}-${p.id}`;
          return (
            <label key={p.id} className="compute-field" htmlFor={fieldId}>
              <span>{p.label}</span>
              {p.type === "number" ? (
                <input
                  id={fieldId}
                  type="number"
                  value={Number(values[p.id])}
                  min={p.min}
                  max={p.max}
                  step={p.step ?? "any"}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [p.id]: e.target.valueAsNumber,
                    }))
                  }
                />
              ) : null}
              {p.type === "boolean" ? (
                <input
                  id={fieldId}
                  type="checkbox"
                  checked={Boolean(values[p.id])}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [p.id]: e.target.checked }))
                  }
                />
              ) : null}
              {p.type === "select" ? (
                <select
                  id={fieldId}
                  value={String(values[p.id])}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [p.id]: e.target.value }))
                  }
                >
                  {(p.options ?? []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </label>
          );
        })}

        <div className="compute-actions">
          <button type="submit" className="btn primary" disabled={running || pending}>
            {running ? "Running…" : "Run demo"}
          </button>
          {running ? (
            <button
              type="button"
              className="btn ghost"
              onClick={() => setRunning(false)}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {progress != null ? (
        <div className="compute-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
          <div style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      ) : null}

      {error ? <p className="compute-error">{error}</p> : null}

      {result ? (
        <div className="compute-result">
          <p className="compute-summary">{result.summary}</p>
          {result.table ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {result.table.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {result.series && result.series.length > 0 ? (
            <Sparkline series={result.series} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Sparkline({
  series,
}: {
  series: { x: number; y: number }[];
}) {
  const w = 480;
  const h = 120;
  const xs = series.map((p) => p.x);
  const ys = series.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;
  const pts = series
    .map((p, i) => {
      const x = ((p.x - minX) / dx) * (w - 16) + 8;
      const y = h - 8 - ((p.y - minY) / dy) * (h - 16);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Result plot">
      <path d={pts} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
