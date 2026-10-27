CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT, suburb TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS employees (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, contact TEXT, email TEXT UNIQUE, password_hash TEXT, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
ALTER TABLE employees ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  suburb TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'scheduled', 'in_progress', 'completed')),
  value NUMERIC(12, 2) NOT NULL CHECK (value >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS job_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_customer_idx ON jobs(customer);
CREATE INDEX IF NOT EXISTS job_notes_job_id_created_at_idx ON job_notes(job_id, created_at DESC);
