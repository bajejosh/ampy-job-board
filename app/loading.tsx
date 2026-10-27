export default function Loading() {
  return (
    <main className="shell" aria-busy="true" aria-live="polite">
      <div className="loading-panel">
        <span className="spinner" aria-hidden="true" />
        <p>Loading jobs…</p>
      </div>
    </main>
  );
}
