import Link from "next/link";
import { notFound } from "next/navigation";
import { NotesPanel } from "@/components/NotesPanel";
import { StatusBadge } from "@/components/StatusBadge";
import { getJob, getNotes } from "@/lib/jobs";
import { formatCurrency, formatDate } from "@/lib/format";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const notes = await getNotes(job.id);

  return (
    <main className="shell shell-detail">
      <header className="topbar">
        <Link className="brand" href="/">
          <img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" />
          <span className="brand-context">Operations workspace</span>
        </Link>
        <a className="brand-call" href="tel:0344163638">Call Ampy · (03) 4416 3638</a>
      </header>

      <div className="detail-back">
        <Link className="back-link" href="/">
          <span aria-hidden="true">←</span> All jobs
        </Link>
      </div>

      <section className="detail-header" aria-labelledby="job-title">
        <div>
          <div className="eyebrow">Job {job.id.replace("job-", "#")}</div>
          <h1 id="job-title">{job.jobType}</h1>
          <p className="detail-subtitle">{job.customer}</p>
        </div>
        <StatusBadge status={job.status} />
      </section>

      <div className="detail-grid">
        <section className="detail-card" aria-labelledby="job-details-heading">
          <div className="card-heading">
            <div>
              <span className="eyebrow">Overview</span>
              <h2 id="job-details-heading">Job details</h2>
            </div>
            <span className="value-large">{formatCurrency(job.value)}</span>
          </div>
          <dl className="details-list">
            <div>
              <dt>Customer</dt>
              <dd>{job.customer}</dd>
            </div>
            <div>
              <dt>Suburb</dt>
              <dd>{job.suburb}</dd>
            </div>
            <div>
              <dt>Job type</dt>
              <dd>{job.jobType}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><StatusBadge status={job.status} /></dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDate(job.createdAt)}</dd>
            </div>
          </dl>
        </section>

        <NotesPanel jobId={job.id} initialNotes={notes} />
      </div>
    </main>
  );
}
