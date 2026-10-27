"use client";
import { useState } from "react";
import { JobPreviewModal } from "@/components/JobPreviewModal";
import { JobFormDialog } from "@/components/JobFormDialog";
import { Customer, Employee, Job, JobStatus, JOB_STATUSES, statusLabel } from "@/lib/types";
import type { CurrentEmployee } from "@/lib/session";

type JobBoardProps = {
  jobs: Job[];
  customers: Customer[];
  employees: Employee[];
  currentEmployee: CurrentEmployee;
  search: string;
  status?: JobStatus;
};

const PAGE_SIZE = 5;

export function JobBoard({ jobs, customers, employees, currentEmployee, search, status }: JobBoardProps) {
  const [query, setQuery] = useState(search);
  const [activeStatus, setActiveStatus] = useState<JobStatus | undefined>(status);
  const [allJobs, setAllJobs] = useState(jobs);
  const [page, setPage] = useState(1);

  const visibleJobs = allJobs.filter((job) => (!query || job.customer.toLowerCase().includes(query.toLowerCase())) && (!activeStatus || job.status === activeStatus));
  const pageCount = Math.max(1, Math.ceil(visibleJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageJobs = visibleJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filtered = Boolean(query || activeStatus);
  const filterDescription = filtered
    ? `Showing ${visibleJobs.length} ${visibleJobs.length === 1 ? "job" : "jobs"} for the current filters.`
    : `${allJobs.length} ${allJobs.length === 1 ? "job" : "jobs"} in the queue.`;

  function changeQuery(value: string) { setQuery(value); setPage(1); }
  function changeStatus(value: JobStatus | undefined) { setActiveStatus(value); setPage(1); }
  function clearFilters() { changeQuery(""); changeStatus(undefined); }
  function replaceJob(job: Job) { setAllJobs((current) => current.map((item) => (item.id === job.id ? job : item))); }
  function removeJob(jobId: string) { setAllJobs((current) => current.filter((item) => item.id !== jobId)); }

  return (
    <>
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
        <form className="filter-form" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="search-field">
            <span>Search customers</span>
            <input name="search" type="search" placeholder="Try “Miller”" value={query} onChange={(event) => changeQuery(event.target.value)} />
          </label>
          <label className="status-field">
            <span>Status</span>
            <select name="status" value={activeStatus ?? ""} onChange={(event) => changeStatus((event.target.value as JobStatus) || undefined)}>
              <option value="">All statuses</option>
              {JOB_STATUSES.map((jobStatus) => (
                <option key={jobStatus} value={jobStatus}>{statusLabel(jobStatus)}</option>
              ))}
            </select>
          </label>
          {filtered ? <button className="clear-link" type="button" onClick={clearFilters}>Clear filters</button> : null}
        </form>
      </section>

      <section className="board-section" aria-labelledby="jobs-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Work queue</span>
            <h2 id="jobs-heading">Jobs</h2>
          </div>
          <p aria-live="polite">{filterDescription}</p>
          <JobFormDialog
            customers={customers}
            employees={employees}
            triggerLabel="+ Add job"
            triggerClassName="button button-primary"
            onSaved={(job) => { setAllJobs((current) => [job, ...current]); clearFilters(); }}
          />
        </div>

        {visibleJobs.length === 0 ? (
          <div className="state-panel state-panel-inline">
            <span className="empty-icon" aria-hidden="true">⌕</span>
            <h3>{filtered ? "No jobs match those filters" : "No jobs yet"}</h3>
            <p>{filtered ? "Try a different customer name or show all statuses." : "Add the first job to start the queue."}</p>
            {filtered && <button className="button button-secondary" type="button" onClick={clearFilters}>Show all jobs</button>}
          </div>
        ) : (
          <>
            <div className="job-table-head"><span>Customer</span><span>Job type · suburb</span><span>Value</span><span>Status</span></div>
            <div className="job-list">
              {pageJobs.map((job) => (
                <JobPreviewModal
                  key={job.id}
                  job={job}
                  customers={customers}
                  employees={employees}
                  currentEmployee={currentEmployee}
                  onSaved={replaceJob}
                  onDeleted={removeJob}
                />
              ))}
            </div>
            <nav className="pagination" aria-label="Job pages">
              <span>Page {currentPage} of {pageCount}</span>
              <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
              <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button>
            </nav>
          </>
        )}
      </section>
    </>
  );
}
