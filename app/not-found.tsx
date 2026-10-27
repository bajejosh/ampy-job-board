import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <section className="state-panel">
        <span className="eyebrow">Not found</span>
        <h1>That job is no longer on the board</h1>
        <p>The link may be outdated, or the job may not exist in this workspace.</p>
        <Link className="button button-primary" href="/">
          Back to jobs
        </Link>
      </section>
    </main>
  );
}
