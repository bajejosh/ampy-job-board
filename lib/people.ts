import { dbQuery, isDatabaseConfigured } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
export type Customer = { id: string; name: string; contact: string | null; suburb: string };
export type Employee = { id: string; name: string; role: string; contact: string | null; email: string | null; active: boolean };
export async function getCustomers() { if (!isDatabaseConfigured()) return [] as Customer[]; return (await dbQuery<Customer>("SELECT id, name, contact, suburb FROM customers ORDER BY name")) ?? []; }
export async function getEmployees() { if (!isDatabaseConfigured()) return [] as Employee[]; return (await dbQuery<Employee>("SELECT id, name, role, contact, email, active FROM employees ORDER BY active DESC, name")) ?? []; }
export async function savePerson(type: "customers" | "employees", id: string | null, input: Record<string, unknown>) {
  if (!isDatabaseConfigured()) throw new Error("A database is required");
  const table = type === "customers" ? "customers" : "employees";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) throw new Error("Name is required");
  if (type === "customers") {
    const suburb = typeof input.suburb === "string" ? input.suburb.trim() : "";
    const contact = typeof input.contact === "string" ? input.contact.trim() : null;
    const personId = id ?? `customer-${crypto.randomUUID()}`;
    const rows = await dbQuery<Customer>(id ? `UPDATE ${table} SET name=$2, contact=$3, suburb=$4 WHERE id=$1 RETURNING id,name,contact,suburb` : `INSERT INTO ${table} (id,name,contact,suburb) VALUES ($1,$2,$3,$4) RETURNING id,name,contact,suburb`, id ? [id,name,contact,suburb] : [personId,name,contact,suburb]);
    return rows?.[0];
  }
  const role = typeof input.role === "string" ? input.role.trim() : "Employee"; const contact = typeof input.contact === "string" ? input.contact.trim() : null; const email = typeof input.email === "string" ? input.email.trim() : null; const password = typeof input.password === "string" ? input.password : ""; const active = input.active !== false && input.active !== "false"; const personId = id ?? `employee-${crypto.randomUUID()}`; const passwordHash = password ? hashPassword(password) : null;
  const rows = await dbQuery<Employee>(id ? `UPDATE ${table} SET name=$2, role=$3, contact=$4, email=$5, active=$6${passwordHash ? ", password_hash=$7" : ""} WHERE id=$1 RETURNING id,name,role,contact,email,active` : `INSERT INTO ${table} (id,name,role,contact,email,password_hash,active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,name,role,contact,email,active`, id ? (passwordHash ? [id,name,role,contact,email,active,passwordHash] : [id,name,role,contact,email,active]) : [personId,name,role,contact,email,passwordHash,active]); return rows?.[0];
}
