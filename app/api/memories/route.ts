import { NextResponse } from "next/server";
import { listMemories } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const memories = await listMemories();
    return NextResponse.json({ memories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Anılar yüklenemedi." },
      { status: 500 }
    );
  }
}
