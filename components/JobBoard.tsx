import Link from "next/link";
import { JobPreviewModal } from "@/components/JobPreviewModal";
import { Job, JobStatus, JOB_STATUSES, statusLabel } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

type JobBoardProps = {
  jobs: Job[];
  search: string;
  status?: JobStatus;
};

export function JobBoard({ jobs, search, status }: JobBoardProps) {
  const filterDescription = search || status
    ? `Showing ${jobs.length} ${jobs.length === 1 ? "job" : "jobs"} for the current filters.`
    : "20 service jobs ready for a quick team check-in.";

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" />
          <span className="brand-context">Operations workspace</span>
        </Link>
        <div className="topbar-actions">
          <Link className="admin-link" href="/admin">Admin</Link>
          <a className="brand-call" href="tel:0344163638">Call Ampy · (03) 4416 3638</a>
        </div>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div>
          <div className="eyebrow">Ampy Electrical · Bendigo</div>
          <h1 id="page-title">Keep every job moving.</h1>
          <p className="hero-copy">A clear operations view for the Ampy team, from first call to completed job.</p>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <span>⚡</span>
        </div>
      </section>

      <section className="toolbar" aria-label="Job filters">
        <form method="get" className="filter-form">
          <label className="search-field">
            <span>Search customers</span>
            <input name="search" type="search" placeholder="Try “Miller”" defaultValue={search} />
          </label>
          <label className="status-field">
            <span>Status</span>
            <select name="status" defaultValue={status ?? ""}>
              <option value="">All statuses</option>
              {JOB_STATUSES.map((jobStatus) => (
                <option key={jobStatus} value={jobStatus}>{statusLabel(jobStatus)}</option>
              ))}
            </select>
          </label>
          <button className="button button-primary filter-submit" type="submit">Apply filters</button>
          {search || status ? <Link className="clear-link" href="/">Clear filters</Link> : null}
        </form>
      </section>

      <section className="board-section" aria-labelledby="jobs-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Work queue</span>
            <h2 id="jobs-heading">Jobs</h2>
          </div>
          <p>{filterDescription}</p>
        </div>

        {jobs.length === 0 ? (
          <div className="state-panel state-panel-inline">
            <span className="empty-icon" aria-hidden="true">⌕</span>
            <h3>No jobs match those filters</h3>
            <p>Try a different customer name or show all statuses.</p>
            <Link className="button button-secondary" href="/">Show all jobs</Link>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => <JobPreviewModal job={job} key={job.id} />)}
          </div>
        )}
      </section>

      <footer className="board-footer">
        <span>Internal operations view</span>
        <span>Postgres-ready · demo data included</span>
      </footer>
    </main>
  );
}
