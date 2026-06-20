import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { randomMemoryPosition, randomStarColor, sanitizeMemoryPayload } from "@/lib/memory-utils";
import { getSupabaseAdmin, listMemories } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    return NextResponse.json({ memories: await listMemories() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Anılar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    const payload = sanitizeMemoryPayload(await request.json());
    const position = randomMemoryPosition();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("memories")
      .insert({
        ...payload,
        ...position,
        color: randomStarColor()
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ memory: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Anı oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
