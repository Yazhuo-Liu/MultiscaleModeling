import { useEffect, useRef } from "react";
import type { RenderDemo } from "@/core/types";
import { createRenderHost } from "@/core/render/createRenderHost";

interface Props {
  demo: RenderDemo;
}

/** Mounts a module's WebGL demo and tears it down on unmount / demo change. */
export function RenderHost({ demo }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const host = createRenderHost(canvas);
    const disposeDemo = demo.mount(host.ctx);

    const onResize = () => {
      host.resize();
    };
    window.addEventListener("resize", onResize);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    if (canvas.parentElement) ro?.observe(canvas.parentElement);

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      disposeDemo();
      host.destroy();
    };
  }, [demo]);

  return (
    <div className="render-stage">
      <canvas ref={canvasRef} className="render-canvas" aria-label="WebGL demo" />
    </div>
  );
}
