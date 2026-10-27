"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="shell">
      <section className="state-panel" role="alert">
        <span className="eyebrow">Connection issue</span>
        <h1>We couldn’t load the job board</h1>
        <p>Check the database connection, then try the board again.</p>
        <button type="button" className="button button-primary" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
