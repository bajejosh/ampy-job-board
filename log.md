# Ampy Job Board log

> Role: HISTORY

## 2026-10-27 — Initial build

- Built the standalone Next.js job board with 20 seeded jobs, status filtering, customer search, detail pages, and note submission.
- Decision: keep Postgres as the production path and provide a clearly labeled in-memory fallback so the UI can be evaluated without local database credentials.
- Proof: `npm run verify` passes; desktop browser smoke covered the 20-job list, search, status filtering, empty state, detail view, and note save. Deployment and push are intentionally out of scope.
- Blockers: no real Postgres credentials or staging environment were provided; the local Playwright mobile binary stalled during installation, so 390px browser walkthrough remains outstanding.
