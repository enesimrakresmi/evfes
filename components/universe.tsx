"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Memory } from "@/lib/types";
import MemoryModal from "@/components/memory-modal";
import { useMemories } from "@/components/use-memories";

const IntroParticles = dynamic(() => import("@/components/intro-particles"), {
  ssr: false
});

const LoadingScreen = dynamic(() => import("@/components/loading-screen"), {
  ssr: false
});

const STORAGE_KEY = "bizim-evrenimiz-discovered";

function readDiscovered() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return new Set<string>(value ? JSON.parse(value) : []);
  } catch {
    return new Set<string>();
  }
}

export default function Universe() {
  const { memories, loading, error } = useMemories();
  const [introDone, setIntroDone] = useState(false);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setDiscovered(readDiscovered());
  }, []);

  const openMemory = useCallback((memory: Memory) => {
    setSelected(memory);
    setDiscovered((current) => {
      const next = new Set(current);
      next.add(memory.id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const backgroundStars = useMemo(
    () =>
      Array.from({ length: 110 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 1.8,
        delay: Math.random() * 3
      })),
    []
  );

  return (
    <main className="universe-bg relative h-[100svh] w-screen overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        {backgroundStars.map((star) => (
          <span
            key={star.id}
            className="twinkle absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              boxShadow: "0 0 12px rgba(255,255,255,.65)"
            }}
          />
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-75"
        animate={{ x: [0, -8, 7, 0], y: [0, 6, -6, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute left-[8%] top-[16%] h-48 w-48 rounded-full bg-roseglow/7 blur-3xl" />
        <div className="absolute right-[12%] top-[12%] h-56 w-56 rounded-full bg-aurora/7 blur-3xl" />
        <div className="absolute bottom-[10%] left-[48%] h-56 w-56 rounded-full bg-stargold/7 blur-3xl" />
      </motion.div>

      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm text-white/82 backdrop-blur-md sm:left-6 sm:top-6">
        Keşfedilen Anılar:{" "}
        <span className="font-semibold text-stargold">
          {discovered.size} / {memories.length}
        </span>
      </div>

      {loading ? <LoadingScreen /> : null}

      {error ? (
        <div className="absolute inset-x-4 top-20 z-20 mx-auto max-w-md rounded-2xl border border-roseglow/30 bg-black/45 p-4 text-center text-sm text-white/80 backdrop-blur">
          {error}
        </div>
      ) : null}

      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        {memories.map((memory) => {
          const isOpen = discovered.has(memory.id);

          return (
            <button
              key={memory.id}
              type="button"
              aria-label={`${memory.title} anısını aç`}
              onClick={() => openMemory(memory)}
              className="group absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none"
              style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
            >
              <span
                className="absolute h-2.5 w-2.5 rounded-full transition duration-300 group-hover:scale-150 group-focus-visible:scale-150"
                style={{
                  background: memory.color,
                  boxShadow: `0 0 18px ${memory.color}, 0 0 42px ${memory.color}`
                }}
              />
              <span
                className={`absolute h-7 w-7 rounded-full border transition ${
                  isOpen ? "border-stargold/55" : "border-white/25"
                } group-hover:border-white/80`}
              />
            </button>
          );
        })}
      </motion.div>

      {!introDone ? <IntroParticles onComplete={() => setIntroDone(true)} /> : null}

      <motion.div
        className="pointer-events-none absolute bottom-5 left-0 right-0 z-20 flex justify-center px-6 sm:bottom-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1.8, delay: 0.4 }}
      >
        <p className="universe-quote text-center font-display text-sm italic text-white/38 sm:text-base">
          evrenimiz hâlâ genişlemeye devam ediyorsa,{" "}
          <span className="text-white/55">hâlâ doğru yerdesin demektir.</span>
        </p>
      </motion.div>

      <MemoryModal memory={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
