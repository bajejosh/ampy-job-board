# Ampy Job Board tasks

> Role: CURRENT
> As of: 2026-10-27
> Review by: 2026-11-26

## Now

- Josh: review `josh/security-fixes`, then decide when to run `db/schema.sql` and `npm run create-admin` on Neon.
- Deploy only after the Neon migration; the old main-branch build has the auth bypass.

## Next

- Medium review items: filters in the URL, one shared job drawer, semantic jobs table, smaller hero on mobile.
- Numbered migrations instead of the single idempotent schema file.
- Strict SSL to Neon (drop `rejectUnauthorized: false`).
