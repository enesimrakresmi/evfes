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

    // Prevent background scroll on mobile when modal is open
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.article
            className="glass relative flex w-full flex-col overflow-hidden rounded-t-[28px] sm:max-h-[92svh] sm:max-w-2xl sm:rounded-[28px]"
            style={{ maxHeight: "92svh" }}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Drag handle — visible on mobile only */}
            <div className="flex shrink-0 justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-white/25" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg transition hover:bg-white/15 active:bg-white/15"
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

            <div className="flex shrink-0 flex-col justify-center p-5 sm:p-8">
              <p className="text-[10px] uppercase tracking-[.32em] text-stargold/80 sm:text-xs">
                BİZİM EVRENİMİZ
              </p>
              <h2 className="mt-2 font-display text-xl leading-tight text-white sm:mt-3 sm:text-4xl">
                {memory.title}
              </h2>
              {memory.created_at ? (
                <time className="mt-3 text-xs text-white/50 sm:mt-4 sm:text-sm" dateTime={memory.created_at}>
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
