import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!process.env.DATABASE_URL) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function dbQuery<T extends QueryResultRow>(text: string, values: readonly unknown[] = []) {
  const database = getPool();
  if (!database) return null;
  const result = await database.query<T>(text, [...values]);
  return result.rows;
}
