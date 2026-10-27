export default function Loading() {
  return (
    <main className="shell shell-detail" aria-busy="true" aria-live="polite">
      <div className="loading-panel">
        <span className="spinner" aria-hidden="true" />
        <p>Loading job details…</p>
      </div>
    </main>
  );
}
