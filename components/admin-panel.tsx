"use client";

import { motion } from "framer-motion";
import { Edit3, ImagePlus, LogOut, Plus, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import type { Memory } from "@/lib/types";

type FormState = {
  id?: string;
  title: string;
  message: string;
  image_url: string;
};

const emptyForm: FormState = {
  title: "",
  message: "",
  image_url: ""
};

async function parseResponse<T>(response: Response) {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "İşlem tamamlanamadı.");
  }
  return body as T;
}

function EmptyImagePreview({ title = "Görsel yok" }: { title?: string }) {
  return (
    <div className="grid h-full min-h-[150px] place-items-center bg-[radial-gradient(circle_at_center,rgba(255,217,138,.18),rgba(255,255,255,.04)_42%,rgba(0,0,0,.22))] p-4 text-center">
      <div>
        <div className="mx-auto h-3 w-3 rounded-full bg-stargold shadow-star" />
        <p className="mt-4 text-sm text-white/60">{title}</p>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const editing = useMemo(() => Boolean(form.id), [form.id]);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    loadMemories();
  }, [authenticated]);

  async function loadMemories() {
    const data = await parseResponse<{ memories: Memory[] }>(await fetch("/api/admin/memories"));
    setMemories(data.memories);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await parseResponse(await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      }));
      setAuthenticated(true);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setMemories([]);
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.8,
        alwaysKeepResolution: false
      });
      const webp = new File([compressed], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
        type: "image/webp"
      });
      const body = new FormData();
      body.append("file", webp);

      const data = await parseResponse<{ image_url: string }>(
        await fetch("/api/admin/upload", {
          method: "POST",
          body
        })
      );

      setForm((current) => ({ ...current, image_url: data.image_url }));
      setNotice(`Görsel optimize edildi ve yüklendi: ${(webp.size / 1024).toFixed(0)} KB`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.message.trim() && !form.image_url) {
      setError("Fotoğraf veya mesaj alanlarından en az biri dolu olmalıdır.");
      return;
    }

    setBusy(true);

    try {
      const endpoint = editing ? `/api/admin/memories/${form.id}` : "/api/admin/memories";
      const method = editing ? "PUT" : "POST";
      await parseResponse(
        await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            message: form.message,
            image_url: form.image_url
          })
        })
      );
      setForm(emptyForm);
      await loadMemories();
      setNotice(editing ? "Anı güncellendi." : "Anı evrene eklendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anı kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteMemory(memory: Memory) {
    const confirmed = window.confirm(`"${memory.title}" silinsin mi?`);
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      await parseResponse(await fetch(`/api/admin/memories/${memory.id}`, { method: "DELETE" }));
      await loadMemories();
      if (form.id === memory.id) {
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anı silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="universe-bg grid h-[100svh] place-items-center overflow-hidden text-white/75">
        Admin panel hazırlanıyor...
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="universe-bg grid h-[100svh] place-items-center overflow-hidden p-4">
        <motion.form
          onSubmit={login}
          className="glass w-full max-w-md rounded-[28px] p-7"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[.32em] text-stargold/75">BİZİM EVRENİMİZ</p>
          <h1 className="mt-3 font-display text-4xl text-white">Yönetim Paneli</h1>
          <label className="mt-8 block text-sm text-white/70">
            Şifre
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-stargold/70"
              autoFocus
              required
            />
          </label>
          {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-[#170916] transition hover:bg-stargold disabled:opacity-60"
          >
            Giriş Yap
          </button>
        </motion.form>
      </main>
    );
  }

  return (
    <main className="universe-bg h-[100svh] overflow-hidden p-3 text-white sm:p-5">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
        <header className="flex shrink-0 items-center justify-between rounded-3xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md">
          <div>
            <p className="text-xs uppercase tracking-[.3em] text-stargold/70">BİZİM EVRENİMİZ</p>
            <h1 className="font-display text-2xl text-white sm:text-4xl">Anılar</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
            aria-label="Çıkış yap"
          >
            <LogOut size={18} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[430px_1fr]">
          <form onSubmit={saveMemory} className="glass flex min-h-0 flex-col rounded-[28px] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl">{editing ? "Anıyı Düzenle" : "Yeni Anı"}</h2>
              {editing ? (
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                  aria-label="Düzenlemeyi iptal et"
                >
                  <X size={18} />
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-4 overflow-y-auto pr-1">
              <label className="block text-sm text-white/70">
                Başlık
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-stargold/70"
                  required
                />
              </label>

              <label className="block text-sm text-white/70">
                Mesaj <span className="text-white/45">(isteğe bağlı — fotoğraf veya mesaj zorunlu)</span>
                <textarea
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-stargold/70"
                />
              </label>

              <label className="block text-sm text-white/70">
                Görsel <span className="text-white/45">(isteğe bağlı)</span>
                <span className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/25 bg-white/10 px-4 py-4 text-white transition hover:border-stargold/70">
                  <ImagePlus size={19} />
                  {uploading ? "Optimize ediliyor..." : "Görsel seç ve WebP olarak yükle"}
                  <input type="file" accept="image/*" onChange={uploadImage} className="sr-only" disabled={uploading} />
                </span>
              </label>

              {form.image_url ? (
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black/30">
                  <Image src={form.image_url} alt="Yüklenen anı görseli" fill sizes="430px" className="object-cover" />
                </div>
              ) : (
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                  <EmptyImagePreview title="Bu anı görselsiz kaydedilebilir" />
                </div>
              )}

              {notice ? <p className="rounded-2xl bg-emerald-300/10 p-3 text-sm text-emerald-100">{notice}</p> : null}
              {error ? <p className="rounded-2xl bg-rose-400/10 p-3 text-sm text-rose-100">{error}</p> : null}
            </div>

            <button
              type="submit"
              disabled={busy || uploading}
              className="mt-4 flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#170916] transition hover:bg-stargold disabled:opacity-60"
            >
              {editing ? <Save size={18} /> : <Plus size={18} />}
              {editing ? "Kaydet" : "Ekle"}
            </button>
          </form>

          <section className="glass min-h-0 overflow-hidden rounded-[28px] p-4 sm:p-5">
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex shrink-0 items-center justify-between">
                <h2 className="font-display text-2xl">Kayıtlı Anılar</h2>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/70">
                  {memories.length}
                </span>
              </div>
              <div className="mt-4 grid min-h-0 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                {memories.map((memory) => (
                  <article key={memory.id} className="rounded-3xl border border-white/12 bg-black/25 p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/25">
                      {memory.image_url ? (
                        <Image src={memory.image_url} alt={memory.title} fill sizes="300px" className="object-cover" />
                      ) : (
                        <EmptyImagePreview />
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-1 font-semibold">{memory.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      {memory.image_url ? <span className="text-xs text-white/50">📷 Fotoğraf var</span> : null}
                      {memory.message ? <span className="text-xs text-white/50 line-clamp-1">{memory.message.slice(0, 40)}{memory.message.length > 40 ? '...' : ''}</span> : null}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            id: memory.id,
                            title: memory.title,
                            message: memory.message,
                            image_url: memory.image_url || ""
                          })
                        }
                        className="grid h-10 flex-1 place-items-center rounded-2xl border border-white/15 bg-white/10 transition hover:bg-white/20"
                        aria-label={`${memory.title} düzenle`}
                      >
                        <Edit3 size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMemory(memory)}
                        className="grid h-10 flex-1 place-items-center rounded-2xl border border-rose-200/20 bg-rose-400/10 text-rose-100 transition hover:bg-rose-400/20"
                        aria-label={`${memory.title} sil`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
