import { dbQuery } from "@/lib/db";
import { HttpError } from "@/lib/http";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/password";
import { revokeEmployeeSessions, type CurrentEmployee } from "@/lib/session";
import type { Access, Customer, Employee } from "@/lib/types";

const EMPLOYEE_COLUMNS = "id, name, role, contact, email, active, access";

export async function getCustomers() {
  return dbQuery<Customer>("SELECT id, name, contact, suburb FROM customers ORDER BY name");
}

export async function getEmployees() {
  return dbQuery<Employee>(`SELECT ${EMPLOYEE_COLUMNS} FROM employees ORDER BY active DESC, name`);
}

function text(input: Record<string, unknown>, key: string) {
  return typeof input[key] === "string" ? (input[key] as string).trim() : "";
}

// Empty optional fields are stored as NULL, never "" (an empty email would collide on the unique index).
function optional(input: Record<string, unknown>, key: string) {
  return text(input, key) || null;
}

export async function saveCustomer(id: string | null, input: Record<string, unknown>) {
  const name = text(input, "name");
  const suburb = text(input, "suburb");
  if (!name || !suburb) throw new HttpError(400, "Enter a name and suburb");
  const contact = optional(input, "contact");
  const rows = id
    ? await dbQuery<Customer>("UPDATE customers SET name = $2, contact = $3, suburb = $4 WHERE id = $1 RETURNING id, name, contact, suburb", [id, name, contact, suburb])
    : await dbQuery<Customer>("INSERT INTO customers (id, name, contact, suburb) VALUES ($1, $2, $3, $4) RETURNING id, name, contact, suburb", [`customer-${crypto.randomUUID()}`, name, contact, suburb]);
  if (!rows[0]) throw new HttpError(404, "That customer no longer exists");
  return rows[0];
}

export async function saveEmployee(id: string | null, input: Record<string, unknown>, actor: CurrentEmployee) {
  const name = text(input, "name");
  const role = text(input, "role");
  const email = optional(input, "email")?.toLowerCase() ?? null;
  const contact = optional(input, "contact");
  const password = typeof input.password === "string" ? input.password : "";
  const active = input.active !== false && input.active !== "false";
  const access: Access = input.access === "admin" ? "admin" : "staff";

  if (!name || !role) throw new HttpError(400, "Enter a name and role");
  if (password && password.length < MIN_PASSWORD_LENGTH) throw new HttpError(400, `Passwords need at least ${MIN_PASSWORD_LENGTH} characters`);
  if (password && !email) throw new HttpError(400, "Add an email so this employee can sign in");
  if (id === actor.id && (!active || access !== "admin")) throw new HttpError(400, "You can't deactivate yourself or remove your own admin access");

  const passwordHash = password ? hashPassword(password) : null;
  const rows = id
    ? await dbQuery<Employee>(
        `UPDATE employees SET name = $2, role = $3, contact = $4, email = $5, active = $6, access = $7, password_hash = COALESCE($8, password_hash)
         WHERE id = $1 RETURNING ${EMPLOYEE_COLUMNS}`,
        [id, name, role, contact, email, active, access, passwordHash],
      )
    : await dbQuery<Employee>(
        `INSERT INTO employees (id, name, role, contact, email, active, access, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${EMPLOYEE_COLUMNS}`,
        [`employee-${crypto.randomUUID()}`, name, role, contact, email, active, access, passwordHash],
      );
  if (!rows[0]) throw new HttpError(404, "That employee no longer exists");

  // A password reset, deactivation or removed email signs the employee out everywhere.
  if (id && (passwordHash || !active || !email)) await revokeEmployeeSessions(id);
  return rows[0];
}
