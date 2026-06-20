import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { sanitizeMemoryPayload } from "@/lib/memory-utils";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = sanitizeMemoryPayload(await request.json());
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("memories")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ memory: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Anı güncellenemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("memories").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Anı silinemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
