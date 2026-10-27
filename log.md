# Ampy Job Board log

> Role: HISTORY

## 2026-10-27 — Security and workflow fixes (josh/security-fixes)

- Fixed the review's critical and high items: any `ampy_session` value used to pass auth and `/api/people` let anyone create or take over accounts. Sessions are now DB-backed tokens checked on every route; staff/admin roles; per-user scrypt; login rate limit; `/admin` removed.
- Staff can add, edit and assign jobs from the board and drawer; notes record their author; jobs link to customers; pagination resets on filter; forms show server errors; Customers/Employees pages are no longer static.
- Decision: kept `jobs.customer` as a name snapshot so the deployed main-branch build keeps working against the same Neon database during rollout.
- Verification: `tsc --noEmit` and `next build` pass; attacker-style curl tests and a browser walk (staff and admin) passed against a throwaway local Postgres, not Neon.
- Delivery: LOCAL — commit on `josh/security-fixes`, unpushed. Neon still needs `db/schema.sql` re-run and `npm run create-admin` before this branch can be deployed.

## 2026-10-27 — Initial build

- Built the standalone Next.js job board with 20 seeded jobs, status filtering, customer search, detail pages, and note submission.
- Decision: keep Postgres as the production path and provide a clearly labeled in-memory fallback so the UI can be evaluated without local database credentials.
- Proof: `npm run verify` passes; desktop browser smoke covered the 20-job list, search, status filtering, empty state, detail view, and note save. Deployment and push are intentionally out of scope.
- Blockers: no real Postgres credentials or staging environment were provided; the local Playwright mobile binary stalled during installation, so 390px browser walkthrough remains outstanding.
