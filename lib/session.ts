import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbQuery } from "@/lib/db";
import { HttpError } from "@/lib/http";
import { hashToken, newSessionToken } from "@/lib/password";
import type { Access } from "@/lib/types";

export const SESSION_COOKIE = "ampy_session";
const SESSION_HOURS = 12;

export type CurrentEmployee = { id: string; name: string; email: string; access: Access };

export function sessionCookieOptions(maxAge = SESSION_HOURS * 3600) {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge };
}

export async function createSession(employeeId: string) {
  const token = newSessionToken();
  await dbQuery(
    `INSERT INTO sessions (token_hash, employee_id, expires_at) VALUES ($1, $2, NOW() + make_interval(hours => $3))`,
    [hashToken(token), employeeId, SESSION_HOURS],
  );
  return token;
}

export async function revokeSession(token: string) {
  await dbQuery("UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL", [hashToken(token)]);
}

export async function revokeEmployeeSessions(employeeId: string) {
  await dbQuery("UPDATE sessions SET revoked_at = NOW() WHERE employee_id = $1 AND revoked_at IS NULL", [employeeId]);
}

// Checked against the database on every request, so logout, deactivation and
// password resets take effect immediately.
export const getCurrentEmployee = cache(async (): Promise<CurrentEmployee | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await dbQuery<CurrentEmployee>(
    `SELECT e.id, e.name, e.email, e.access
     FROM sessions s JOIN employees e ON e.id = s.employee_id
     WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW() AND e.active`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
});

export async function requireEmployee(options: { admin?: boolean } = {}) {
  const employee = await getCurrentEmployee();
  if (!employee) throw new HttpError(401, "Sign in to continue");
  if (options.admin && employee.access !== "admin") throw new HttpError(403, "Only admins can do that");
  return employee;
}

export async function requirePageEmployee() {
  const employee = await getCurrentEmployee();
  if (!employee) redirect("/login");
  return employee;
}
