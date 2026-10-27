import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

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
  const result = await getPool().query<T>(text, [...values]);
  return result.rows;
}
