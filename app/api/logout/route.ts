import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/http";
import { revokeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST() {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) await revokeSession(token);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
