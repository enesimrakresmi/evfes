import { NextResponse } from "next/server";
import { clearAdminCookie, isAdminRequest, setAdminCookie } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminRequest() });
}

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD yapılandırılmamış." },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ authenticated: false });
}
