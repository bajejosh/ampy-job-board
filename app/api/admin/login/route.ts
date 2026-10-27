import { NextResponse } from "next/server";
import { adminCookieHeader } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const configured = process.env.ADMIN_KEY;
  const cookie = adminCookieHeader();
  if (!configured || !cookie || typeof password !== "string" || password !== configured) {
    return NextResponse.json({ error: "Incorrect admin password" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", cookie);
  return response;
}
