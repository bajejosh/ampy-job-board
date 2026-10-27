import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { errorResponse, HttpError, readJsonObject } from "@/lib/http";
import { burnPasswordCheck, hashPassword, isLegacyHash, verifyPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

const WINDOW = "15 minutes";
const MAX_FAILURES_PER_EMAIL = 5;
const MAX_FAILURES_PER_IP = 20;

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function isRateLimited(email: string, ip: string) {
  const rows = await dbQuery<{ by_email: number; by_ip: number }>(
    `SELECT COUNT(*) FILTER (WHERE email = $1)::int AS by_email, COUNT(*) FILTER (WHERE ip = $2)::int AS by_ip
     FROM login_attempts WHERE NOT succeeded AND attempted_at > NOW() - $3::interval`,
    [email, ip, WINDOW],
  );
  return rows[0].by_email >= MAX_FAILURES_PER_EMAIL || rows[0].by_ip >= MAX_FAILURES_PER_IP;
}

async function recordAttempt(email: string, ip: string, succeeded: boolean) {
  await dbQuery("INSERT INTO login_attempts (email, ip, succeeded) VALUES ($1, $2, $3)", [email, ip, succeeded]);
  await dbQuery("DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'");
}

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) throw new HttpError(400, "Enter your email and password");

    const ip = clientIp(request);
    if (await isRateLimited(email, ip)) throw new HttpError(429, "Too many attempts. Wait 15 minutes and try again.");

    const rows = await dbQuery<{ id: string; password_hash: string | null }>(
      "SELECT id, password_hash FROM employees WHERE lower(email) = $1 AND active",
      [email],
    );
    const employee = rows[0];
    const valid = employee?.password_hash ? verifyPassword(password, employee.password_hash) : (burnPasswordCheck(password), false);
    await recordAttempt(email, ip, valid);
    if (!employee || !valid) throw new HttpError(401, "Email or password is incorrect");

    if (isLegacyHash(employee.password_hash!)) {
      await dbQuery("UPDATE employees SET password_hash = $2 WHERE id = $1", [employee.id, hashPassword(password)]);
    }

    const token = await createSession(employee.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
