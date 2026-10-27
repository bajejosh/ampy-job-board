"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="shell shell-detail">
      <section className="state-panel" role="alert">
        <span className="eyebrow">Connection issue</span>
        <h1>We couldn’t load this job</h1>
        <p>Check the database connection, then try the job details again.</p>
        <button type="button" className="button button-primary" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
