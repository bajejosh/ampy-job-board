# Ampy Job Board

A small standalone Next.js job board for Ampy Services. It includes a 20-job sample dataset, customer search, status filtering, job detail pages, and a note form backed by PostgreSQL when `DATABASE_URL` is configured.

## Requirements

- Node.js 20.9+
- PostgreSQL 14+ for the persistent path

## Local setup

```bash
cd /Users/joshuamacaraig/ampy-job-board
npm install
cp .env.example .env.local
```

For the full database path, create a database and run the schema and seed files:

```bash
createdb ampy_jobs
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ampy_jobs
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

Set `DATABASE_URL` in `.env.local` before starting the app:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ampy_jobs
PGSSL=false
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo fallback

If `DATABASE_URL` is not set, the app uses the same 20 sample jobs from `lib/sample-data.ts` and stores added notes in process memory. This is only for local evaluation: notes are not durable and the fallback should not be used as a production deployment.

## Verification

```bash
npm run typecheck
npm run build
```

The detail page also exposes the note API at `POST /api/jobs/:id/notes` with a JSON body such as:

```json
{ "content": "Customer confirmed access for Thursday morning." }
```

## Deploying

The app is ready for a Next.js host such as Vercel, Render, Railway, or a Node server:

1. Create a PostgreSQL database.
2. Run `db/schema.sql`, then `db/seed.sql` against that database.
3. Set `DATABASE_URL` in the host's environment settings. Set `PGSSL=true` if the provider requires SSL.
4. Install dependencies and run `npm run build` during the build step.
5. Run `npm run start` for a Node host, or use the host's standard Next.js deployment flow.

No deployment has been performed from this workspace.
