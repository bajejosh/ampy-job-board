# Design baseline — Ampy Job Board

> Role: REFERENCE
> As of: 2026-10-27
> Review by: 2027-01-25

## 1. Reference

- Reference: A compact internal operations board, optimized for scanning rather than a marketing site.
- What we take from it: calm hierarchy, a single work queue, obvious status labels, and one focused detail flow.
- What we deliberately do not: dense spreadsheet chrome, decorative dashboard metrics, or an admin sidebar.

## 1b. Aesthetic direction

- Subject, audience, primary job: Ampy service jobs; an operations coordinator; identify what needs attention and record the next update.
- Tone in three words: calm, capable, practical.
- Type: Avenir Next / Avenir for a warm operational voice, with Segoe UI as a platform fallback.
- Palette: ink for hierarchy, paper for the workspace, mint for the primary action, amber for new work, cool blue/purple for secondary statuses.
- The one memorable thing: the small amber circular AS mark in the board header.
- Motion stance: subtle lift on interactive rows and buttons only.
- Banned defaults: tracked all-caps eyebrow labels are allowed only as short metadata; no hero stat row, decorative gradients, identical card grid, or fade-up animation.

## 2. Source of truth

| Thing | Lives at | Notes |
|---|---|---|
| Design tokens | `app/globals.css` | All palette, spacing, radii, and shadows live here. |
| Component kit | `components/` | `JobBoard`, `StatusBadge`, and `NoteForm` own their patterns. |
| Live catalogue | none | This is a small standalone test app. |
| Icon set | Text symbols only | Avoids introducing a second visual language for this scope. |
| Font | System Avenir stack | No remote font dependency. |

## 3. The three critical flows

1. When an operations coordinator opens the board on desktop or phone, they need to scan and filter jobs in under 30 seconds.
2. When they select a job, they need to confirm the customer, location, status, type, and value without losing context.
3. When they learn a useful update, they need to save a note from the detail page and see clear saving or failure feedback.

## 3b. The choice budget

- The primary decision on the main screen is which job to open; the browse surface intentionally shows all matching jobs.
- Defaults: all statuses, empty customer search, and no required fields beyond note content.
- Deferred: editing jobs, changing status, assignments, auth, and notifications.
- Activation path: open board → optionally search/filter → open job → write one note.
- Exempt: the job list is a comparison/browse surface; the note form collects the one response needed to save an update.

## 4. The ugliest real data

- Longest realistic string: `Harper Street Clinic` and `Outdoor power and lighting`; both must wrap without breaking the row.
- Largest realistic collection: 20 seeded jobs on the main list.
- Empty case: filters return no jobs; show an explanatory empty state and a one-tap reset.
- Slow case: database queries take longer than a normal interaction; show route-level loading UI and preserve the submitted filter URL.
- Permission case: no auth layer is in scope; a future protected deployment must add a distinct unauthorized state.

## 5. Platform targets

- Viewports designed for: 1440px desktop, 1024px laptop, 390px phone.
- Primary input: mouse and touch.
- Minimum tap target: 44px.
- Browsers or devices: current Chrome, Safari, and Firefox; iPhone-width layout is a required check.
- Offline: N/A for the Postgres-backed flow; request failures surface as errors.

## 6. Vocabulary

| User-facing word | Never shown as |
|---|---|
| Job | `jobs` table row |
| Customer | `customer` field name |
| Suburb | `suburb` field name |
| Job type | `job_type` |
| In progress | `in_progress` |
| Note | `job_notes` |

## 7. Non-goals

- Authentication, roles, job editing, status transitions, attachments, notifications, pagination, and production deployment.

**Verification:** BUILD ONLY until a real Postgres-backed walkthrough is run at desktop and 390px widths.
