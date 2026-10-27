-- Idempotent: safe to run on a fresh database and to re-run on an existing one.
-- On an existing database it backfills customers from job names before linking jobs to them.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT, suburb TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS employees (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, contact TEXT, email TEXT UNIQUE, password_hash TEXT, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
ALTER TABLE employees ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS access TEXT NOT NULL DEFAULT 'staff' CHECK (access IN ('admin', 'staff'));
UPDATE employees SET email = NULL WHERE trim(email) = '';
CREATE UNIQUE INDEX IF NOT EXISTS employees_email_lower_idx ON employees (lower(email));

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
-- jobs.customer is now a name snapshot kept for older deployments; customer_id is the source of truth.
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_id TEXT REFERENCES customers(id) ON DELETE RESTRICT;
INSERT INTO customers (id, name, suburb)
SELECT 'customer-' || gen_random_uuid(), j.customer, min(j.suburb)
FROM jobs j
WHERE j.customer_id IS NULL AND NOT EXISTS (SELECT 1 FROM customers c WHERE lower(c.name) = lower(j.customer))
GROUP BY j.customer;
UPDATE jobs j SET customer_id = c.id FROM customers c WHERE j.customer_id IS NULL AND lower(c.name) = lower(j.customer);
ALTER TABLE jobs ALTER COLUMN customer_id SET NOT NULL;

CREATE TABLE IF NOT EXISTS job_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Nullable only for notes written before authors were recorded; the API always sets it.
ALTER TABLE job_notes ADD COLUMN IF NOT EXISTS author_id TEXT REFERENCES employees(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  ip TEXT NOT NULL,
  succeeded BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_customer_id_idx ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS job_notes_job_id_created_at_idx ON job_notes(job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sessions_employee_id_idx ON sessions(employee_id);
CREATE INDEX IF NOT EXISTS login_attempts_recent_idx ON login_attempts(attempted_at);
