"use client";

import { useEffect, useState } from "react";
import type { Memory } from "@/lib/types";

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    fetch("/api/memories")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error || "Anılar yüklenemedi.");
        }
        return body.memories as Memory[];
      })
      .then((data) => {
        if (alive) {
          setMemories(data);
        }
      })
      .catch((err) => {
        if (alive) {
          setError(err instanceof Error ? err.message : "Anılar yüklenemedi.");
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return { memories, loading, error };
}
