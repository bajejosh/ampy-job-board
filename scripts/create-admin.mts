// Creates the first admin, or promotes an existing employee to admin and resets their password.
// Usage: ADMIN_EMAIL=… ADMIN_NAME=… ADMIN_PASSWORD=… DATABASE_URL=… npm run create-admin
import { Client } from "pg";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../lib/password.ts";

const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, DATABASE_URL, PGSSL } = process.env;
const email = ADMIN_EMAIL?.trim().toLowerCase();

if (!DATABASE_URL || !email || !ADMIN_PASSWORD) {
  console.error("Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD (ADMIN_NAME is optional).");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < MIN_PASSWORD_LENGTH) {
  console.error(`ADMIN_PASSWORD needs at least ${MIN_PASSWORD_LENGTH} characters.`);
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL, ssl: PGSSL === "true" ? { rejectUnauthorized: false } : undefined });
await client.connect();
const passwordHash = hashPassword(ADMIN_PASSWORD);
const updated = await client.query(
  "UPDATE employees SET access = 'admin', active = TRUE, password_hash = $2 WHERE lower(email) = $1 RETURNING id",
  [email, passwordHash],
);
if (updated.rowCount === 0) {
  await client.query(
    "INSERT INTO employees (id, name, role, email, password_hash, access) VALUES ($1, $2, 'Admin', $3, $4, 'admin')",
    [`employee-${crypto.randomUUID()}`, ADMIN_NAME?.trim() || email, email, passwordHash],
  );
}
await client.query("UPDATE sessions SET revoked_at = NOW() WHERE revoked_at IS NULL AND employee_id IN (SELECT id FROM employees WHERE lower(email) = $1)", [email]);
console.log(updated.rowCount ? `Promoted ${email} to admin and reset the password.` : `Created admin ${email}.`);
await client.end();
