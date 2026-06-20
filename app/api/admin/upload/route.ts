import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "memories";
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "WebP formatında bir görsel gerekli." }, { status: 400 });
  }

  if (file.type !== "image/webp") {
    return NextResponse.json({ error: "Yalnızca optimize edilmiş WebP görseller kabul edilir." }, { status: 415 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const path = `${new Date().getFullYear()}/${randomUUID()}.webp`;
    const bytes = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, bytes, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ image_url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Görsel yüklenemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
