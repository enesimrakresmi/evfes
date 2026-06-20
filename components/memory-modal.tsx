"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { Memory } from "@/lib/types";

type MemoryModalProps = {
  memory: Memory | null;
  onClose: () => void;
};

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  useEffect(() => {
    if (!memory) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.article
            className="glass relative flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px]"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg transition hover:bg-white/15"
              aria-label="Anıyı kapat"
            >
              <X size={19} />
            </button>
            {memory.image_url ? (
              <div className="overflow-auto flex-1">
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-auto block"
                />
              </div>
            ) : null}
            <div className="flex shrink-0 flex-col justify-center p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[.32em] text-stargold/80">
                BİZİM EVRENİMİZ
              </p>
              <h2 className="mt-3 font-display text-2xl leading-tight text-white sm:text-4xl">
                {memory.title}
              </h2>
              {memory.created_at ? (
                <time className="mt-4 text-sm text-white/55" dateTime={memory.created_at}>
                  {new Intl.DateTimeFormat("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }).format(new Date(memory.created_at))}
                </time>
              ) : null}
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
