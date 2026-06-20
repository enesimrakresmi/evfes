"use client";

import { useEffect, useRef } from "react";

export default function LoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animId = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 80 }, (_, i) => ({
      x: Math.abs((Math.sin(i * 78.233) * 43758.5453) % 1) * window.innerWidth,
      y: Math.abs((Math.sin(i * 37.719) * 24634.6345) % 1) * window.innerHeight,
      size: 0.5 + Math.random() * 1.3,
      phase: Math.random() * Math.PI * 2
    }));

    const draw = () => {
      frame++;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      stars.forEach((star) => {
        const opacity = 0.15 + 0.5 * Math.abs(Math.sin(frame * 0.022 + star.phase));
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Pulsing star */}
        <div className="loading-star-container">
          <span className="loading-star-core" />
          <span className="loading-star-ring1" />
          <span className="loading-star-ring2" />
        </div>

        <p className="loading-text font-display text-xl tracking-[0.18em] text-white/75">
          Evren hazırlanıyor
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}
