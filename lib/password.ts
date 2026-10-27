import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Format: scrypt$N$r$p$salt$hash (salt and hash base64url). Kept dependency-free so
// scripts/create-admin.ts can import it directly.
const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;

export const MIN_PASSWORD_LENGTH = 12;

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

// Hashes written before 2026-10-27 were hex scrypt with ADMIN_KEY as a shared salt.
// They still verify so existing accounts keep working; login rehashes them.
function verifyLegacy(password: string, stored: string) {
  const key = process.env.ADMIN_KEY;
  if (!key || !/^[0-9a-f]{64}$/.test(stored)) return false;
  const expected = Buffer.from(stored, "hex");
  return timingSafeEqual(scryptSync(password, key, 32), expected);
}

export function isLegacyHash(stored: string) {
  return !stored.startsWith("scrypt$");
}

export function verifyPassword(password: string, stored: string) {
  if (isLegacyHash(stored)) return verifyLegacy(password, stored);
  const [, n, r, p, salt, hash] = stored.split("$");
  const expected = Buffer.from(hash ?? "", "base64url");
  if (!salt || expected.length === 0) return false;
  const actual = scryptSync(password, Buffer.from(salt, "base64url"), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return timingSafeEqual(actual, expected);
}

// Used when no account matches, so a missing email costs the same time as a wrong password.
const DUMMY_HASH = hashPassword(randomBytes(16).toString("hex"));
export function burnPasswordCheck(password: string) {
  verifyPassword(password, DUMMY_HASH);
}

export function newSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
