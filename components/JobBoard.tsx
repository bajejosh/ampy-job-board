"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { JobPreviewModal } from "@/components/JobPreviewModal";
import { Job, JobStatus, JOB_STATUSES, statusLabel } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { AddJobModal } from "@/components/AddJobModal";
import { Employee } from "@/lib/people";

type JobBoardProps = {
  jobs: Job[];
  search: string;
  status?: JobStatus;
  employees: Employee[];
};

export function JobBoard({ jobs, search, status, employees }: JobBoardProps) {
  const [query, setQuery] = useState(search);
  const [activeStatus, setActiveStatus] = useState<JobStatus | undefined>(status);
  const [allJobs, setAllJobs] = useState(jobs);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const visibleJobs = useMemo(() => allJobs.filter((job) => (!query || job.customer.toLowerCase().includes(query.toLowerCase())) && (!activeStatus || job.status === activeStatus)), [allJobs, query, activeStatus]);
  const filterDescription = query || activeStatus
    ? `Showing ${visibleJobs.length} ${visibleJobs.length === 1 ? "job" : "jobs"} for the current filters.`
    : "20 service jobs ready for a quick team check-in.";
  const pageCount = Math.max(1, Math.ceil(visibleJobs.length / pageSize));
  const pageJobs = visibleJobs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="dashboard-shell"><aside className="dashboard-sidebar"><Link className="sidebar-brand" href="/"><img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" /></Link><div className="sidebar-label">Workspace</div><Link className="sidebar-link sidebar-link-active" href="/">Overview</Link><nav className="sidebar-directory-links"><Link className="sidebar-link" href="/customers">Customers</Link><Link className="sidebar-link" href="/employees">Employees</Link></nav><div className="sidebar-label">View by status</div>{JOB_STATUSES.map((item) => <button className={`sidebar-link sidebar-link-button ${activeStatus === item ? "sidebar-link-selected" : ""}`} key={item} onClick={() => setActiveStatus(activeStatus === item ? undefined : item)}>{statusLabel(item)}</button>)}<div className="sidebar-spacer" /><a className="sidebar-phone" href="tel:0344163638">Call Ampy<br /><strong>(03) 4416 3638</strong></a></aside><section className="dashboard-main"><header className="topbar">
        <Link className="brand" href="/">
          <img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" />
          <span className="brand-context">Operations workspace</span>
        </Link>
        <AddJobModal employees={employees} onCreated={(job) => setAllJobs((current) => [job, ...current])} />
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
            <input name="search" type="search" placeholder="Try “Miller”" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="status-field">
            <span>Status</span>
            <select name="status" value={activeStatus ?? ""} onChange={(event) => setActiveStatus(event.target.value as JobStatus || undefined)}>
              <option value="">All statuses</option>
              {JOB_STATUSES.map((jobStatus) => (
                <option key={jobStatus} value={jobStatus}>{statusLabel(jobStatus)}</option>
              ))}
            </select>
          </label>
          <button className="button button-primary filter-submit" type="button">Apply filters</button>
          {query || activeStatus ? <button className="clear-link" type="button" onClick={() => { setQuery(""); setActiveStatus(undefined); }}>Clear filters</button> : null}
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

        {visibleJobs.length === 0 ? (
          <div className="state-panel state-panel-inline">
            <span className="empty-icon" aria-hidden="true">⌕</span>
            <h3>No jobs match those filters</h3>
            <p>Try a different customer name or show all statuses.</p>
            <Link className="button button-secondary" href="/">Show all jobs</Link>
          </div>
        ) : (
          <><div className="job-table-head"><span>Customer</span><span>Job type · suburb</span><span>Value</span><span>Status</span></div><div className="job-list">
            {pageJobs.map((job) => <JobPreviewModal job={job} key={job.id} />)}
          </div></>
        )}
        {visibleJobs.length > 0 && <div className="pagination"><span>Page {page} of {pageCount}</span><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><button disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button></div>}
      </section>

      <footer className="board-footer">
        <span>Internal operations view</span>
        <span>Postgres-ready · demo data included</span>
      </footer>
      </section></main>
  );
}
