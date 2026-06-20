const STAR_COLORS = ["#ffd98a", "#ff8fb3", "#b9e8ff", "#ffffff", "#d9c2ff"];

export function randomMemoryPosition() {
  return {
    x: Math.round((8 + Math.random() * 84) * 100) / 100,
    y: Math.round((13 + Math.random() * 72) * 100) / 100
  };
}

export function randomStarColor() {
  return STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
}

export function sanitizeMemoryPayload(input: unknown) {
  const payload = input as Record<string, unknown>;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const image_url = typeof payload.image_url === "string" ? payload.image_url.trim() : "";

  if (!title || !message) {
    throw new Error("Başlık ve mesaj zorunludur.");
  }

  return { title, message, image_url: image_url || null };
}
