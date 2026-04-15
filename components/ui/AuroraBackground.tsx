"use client";

import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: string;
}

interface AuroraBackgroundProps {
  intensity?: "subtle" | "medium" | "vivid";
  /** Extra inline styles on the wrapper */
  style?: React.CSSProperties;
}

const palettes = {
  subtle: [
    "rgba(102,126,234,0.22)",
    "rgba(240,147,251,0.18)",
    "rgba(253,160,133,0.15)",
    "rgba(118,75,162,0.16)",
  ],
  medium: [
    "rgba(102,126,234,0.38)",
    "rgba(240,147,251,0.32)",
    "rgba(253,160,133,0.28)",
    "rgba(245,87,108,0.22)",
  ],
  vivid: [
    "rgba(102,126,234,0.55)",
    "rgba(240,147,251,0.48)",
    "rgba(253,160,133,0.42)",
    "rgba(245,87,108,0.36)",
  ],
};

export function AuroraBackground({
  intensity = "medium",
  style = {},
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = palettes[intensity];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    // Initialise blobs
    blobsRef.current = colors.map((color, i) => ({
      x: canvas.width * (0.15 + i * 0.22),
      y: canvas.height * (0.2 + (i % 2) * 0.45),
      r: Math.min(canvas.width, canvas.height) * (0.28 + i * 0.04),
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.3,
      color,
    }));

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Soft base gradient
      const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bg.addColorStop(0, "#f0f4ff");
      bg.addColorStop(0.5, "#fef6ff");
      bg.addColorStop(1, "#fff5f0");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw blobs
      for (const blob of blobsRef.current) {
        blob.x += blob.dx;
        blob.y += blob.dy;

        // Bounce off edges
        if (blob.x < -blob.r * 0.5) blob.dx = Math.abs(blob.dx);
        if (blob.x > canvas.width + blob.r * 0.5) blob.dx = -Math.abs(blob.dx);
        if (blob.y < -blob.r * 0.5) blob.dy = Math.abs(blob.dy);
        if (blob.y > canvas.height + blob.r * 0.5) blob.dy = -Math.abs(blob.dy);

        const grad = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.r
        );
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
