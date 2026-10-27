# Ampy Job Board

A small standalone Next.js job board for Ampy Services. It covers a 20-job board with customer search, status filtering and five-per-page pagination, a job drawer with internal notes, customer and employee directories, employee logins, and job assignment, all backed by PostgreSQL.

## Requirements

- Node.js 20.9+
- PostgreSQL 14+ for the persistent path

## Local setup

```bash
npm install
cp .env.example .env.local   # then set DATABASE_URL
```

Create the database, then run the schema and seed. Both files are idempotent, and `schema.sql`
also upgrades a database created by an earlier version (it backfills customers from job names
and adds the session, login-attempt and note-author tables):

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

Seeded employees have no login. Create the first admin (Node 22.18+ runs the TypeScript script directly):

```bash
ADMIN_EMAIL=you@ampy.com.au ADMIN_NAME="Your Name" ADMIN_PASSWORD='at-least-12-chars' npm run create-admin
```

Run it again with an existing email to promote that employee to admin and reset their password.
Then `npm run dev` and sign in at [http://localhost:3000](http://localhost:3000).

## Access

- Every page and API route checks the session against the `sessions` table. Sessions last 12 hours,
  and logging out, deactivating an employee or resetting their password ends them immediately.
- **Staff** can view everything, add and edit jobs, assign employees, write notes and manage customers.
- **Admins** also manage employees (accounts, passwords, access) and can delete jobs.
- Login is limited to 5 failed attempts per email and 20 per IP in 15 minutes.
- Notes record their author from the session; the API ignores any author in the request body.

## Verification

```bash
npm run typecheck
npm run build
```

## Deploying

The app is ready for a Next.js host such as Vercel, Render, Railway, or a Node server:

1. Create a PostgreSQL database.
2. Run `db/schema.sql`, then `db/seed.sql`, then `npm run create-admin` against that database.
3. Set `DATABASE_URL` in the host's environment settings. Set `PGSSL=true` if the provider requires SSL.
4. Install dependencies and run `npm run build` during the build step.
5. Run `npm run start` for a Node host, or use the host's standard Next.js deployment flow.


