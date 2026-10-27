import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "ampy_admin";

function expectedToken() {
  const key = process.env.ADMIN_KEY;
  return key ? createHmac("sha256", key).update("ampy-admin").digest("hex") : null;
}

export function isAdminRequest(request: Request) {
  const expected = expectedToken();
  const actual = request.headers.get("cookie")?.match(/(?:^|; )ampy_admin=([^;]+)/)?.[1];
  if (!expected || !actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function isAdminCookie(value?: string) {
  const expected = expectedToken();
  if (!expected || !value || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function adminCookieHeader() {
  const token = expectedToken();
  if (!token) return null;
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export { COOKIE_NAME };
