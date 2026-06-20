"use client";

import { useEffect, useRef } from "react";

type Particle = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  ex: number;
  ey: number;
  size: number;
  hue: number;
};

type IntroParticlesProps = {
  onComplete: () => void;
};

const INTRO_TEXT = "Enes ✦ Efsa";
const PARTICLE_COUNT = 980;

export default function IntroParticles({ onComplete }: IntroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const completed = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let animation = 0;
    let particles: Particle[] = [];
    let introFontSize = 92;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const sampler = document.createElement("canvas");
      const samplerContext = sampler.getContext("2d", { willReadFrequently: true });
      if (!samplerContext) {
        return;
      }

      sampler.width = width;
      sampler.height = height;
      introFontSize = Math.min(width / 6.4, height / 3.6, 152);
      samplerContext.fillStyle = "#fff";
      samplerContext.textAlign = "center";
      samplerContext.textBaseline = "middle";
      samplerContext.font = `800 ${introFontSize}px Georgia, serif`;
      samplerContext.fillText(INTRO_TEXT, width / 2, height / 2);

      const image = samplerContext.getImageData(0, 0, width, height).data;
      const points: Array<{ x: number; y: number }> = [];
      const step = Math.max(5, Math.floor(width / 135));

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (image[(y * width + x) * 4 + 3] > 150) {
            points.push({ x, y });
          }
        }
      }

      const total = Math.min(PARTICLE_COUNT, points.length);
      particles = Array.from({ length: total }, (_, index) => {
        const target = points[Math.floor((index / total) * points.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(width, height) * (0.32 + Math.random() * 0.55);

        return {
          sx: Math.random() * width,
          sy: Math.random() * height,
          tx: target.x,
          ty: target.y,
          ex: width / 2 + Math.cos(angle) * distance,
          ey: height / 2 + Math.sin(angle) * distance,
          size: 1.1 + Math.random() * 1.8,
          hue: Math.random() > 0.6 ? 44 + Math.random() * 20 : (Math.random() > 0.5 ? 200 + Math.random() * 60 : 340 + Math.random() * 30)
        };
      });
    };

    const drawTextGlow = (opacity: number) => {
      context.save();
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `800 ${introFontSize}px Georgia, serif`;
      context.shadowColor = "rgba(255, 189, 207, .95)";
      context.shadowBlur = 34;
      context.fillStyle = `rgba(255, 244, 232, ${opacity})`;
      context.fillText(INTRO_TEXT, width / 2, height / 2);
      context.shadowBlur = 0;
      context.strokeStyle = `rgba(255, 217, 138, ${opacity * 0.45})`;
      context.lineWidth = 1.1;
      context.strokeText(INTRO_TEXT, width / 2, height / 2);
      context.restore();
    };

    const drawBackgroundStars = () => {
      context.shadowBlur = 0;
      for (let i = 0; i < 120; i += 1) {
        const x = (Math.sin(i * 78.233) * 43758.5453) % 1;
        const y = (Math.sin(i * 37.719) * 24634.6345) % 1;
        const px = Math.abs(x) * width;
        const py = Math.abs(y) * height;
        const opacity = 0.12 + 0.28 * Math.sin(frame * 0.02 + i);
        context.fillStyle = `rgba(255,255,255,${Math.max(opacity, 0.08)})`;
        context.beginPath();
        context.arc(px, py, i % 9 === 0 ? 1.2 : 0.65, 0, Math.PI * 2);
        context.fill();
      }
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      drawBackgroundStars();

      const gather = easeInOutCubic(Math.min(frame / 105, 1));
      const hold = frame > 105 && frame <= 255;
      const disperse = easeInOutCubic(Math.min(Math.max((frame - 255) / 95, 0), 1));
      const textOpacity = frame <= 255 ? Math.min(gather * 0.85 + 0.1, 0.95) : Math.max(0.95 * (1 - disperse), 0);

      if (textOpacity > 0.02) {
        drawTextGlow(textOpacity);
      }

      particles.forEach((particle, index) => {
        let x = particle.sx + (particle.tx - particle.sx) * gather;
        let y = particle.sy + (particle.ty - particle.sy) * gather;

        if (hold) {
          x = particle.tx + Math.sin(frame * 0.035 + index) * 0.45;
          y = particle.ty + Math.cos(frame * 0.035 + index) * 0.45;
        }

        if (frame > 255) {
          x = particle.tx + (particle.ex - particle.tx) * disperse;
          y = particle.ty + (particle.ey - particle.ty) * disperse;
        }

        const alpha = frame > 255 ? 1 - disperse : 0.62 + Math.sin(frame * 0.045 + index) * 0.26;
        context.shadowColor = `hsla(${particle.hue}, 90%, 72%, .75)`;
        context.shadowBlur = 8;
        context.fillStyle = `rgba(255, 245, 226, ${Math.max(alpha, 0)})`;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      if (frame > 355 && !completed.current) {
        completed.current = true;
        onComplete();
      }

      if (!completed.current) {
        animation = requestAnimationFrame(draw);
      }
    };

    fit();
    draw();
    window.addEventListener("resize", fit);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", fit);
    };
  }, [onComplete]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30" aria-hidden="true" />;
}
