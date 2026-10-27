import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
const key = () => process.env.ADMIN_KEY ?? "local-ampy-key";
export function hashPassword(password: string) { return scryptSync(password, key(), 32).toString("hex"); }
export function verifyPassword(password: string, hash: string) { const expected = Buffer.from(hashPassword(password), "hex"); const actual = Buffer.from(hash, "hex"); return expected.length === actual.length && timingSafeEqual(expected, actual); }
export function sessionValue(employeeId: string) { return `${employeeId}.${createHmac("sha256", key()).update(employeeId).digest("hex")}`; }
export function verifySession(value?: string) { if (!value) return null; const [id, signature] = value.split("."); if (!id || !signature) return null; return signature === createHmac("sha256", key()).update(id).digest("hex") ? id : null; }
