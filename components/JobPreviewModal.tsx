"use client";

import { useRef, useState } from "react";
import { Job } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { NotesPanel } from "@/components/NotesPanel";
import { JobNote } from "@/lib/types";

export function JobPreviewModal({ job }: { job: Job }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState<JobNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  async function open() { dialogRef.current?.showModal(); if (!loaded) { setLoadingNotes(true); try { const response = await fetch(`/api/jobs/${job.id}/notes`); const payload = await response.json(); if (response.ok) setNotes(payload.notes); setLoaded(true); } finally { setLoadingNotes(false); } } }
  return <>
    <button className="job-row job-row-button" type="button" onClick={open}>
      <div className="job-main"><div className="job-title-line"><h3>{job.customer}</h3></div><p>{job.jobType} <span aria-hidden="true">·</span> {job.suburb}</p></div>
      <div className="job-value"><strong>{formatCurrency(job.value)}</strong></div><StatusBadge status={job.status} /><span className="row-arrow" aria-hidden="true">↗</span>
    </button>
    <dialog ref={dialogRef} className="job-modal">
      <div className="modal-card modal-card-wide"><div className="modal-header"><div><span className="eyebrow">Job {job.id.replace("job-", "#")}</span><h2>{job.jobType}</h2><p className="modal-subtitle">{job.customer} · {job.suburb}</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button></div>
        <div className="job-modal-columns"><div>
        <div className="modal-summary"><StatusBadge status={job.status} /><strong>{formatCurrency(job.value)}</strong></div>
        <dl className="details-list"><div><dt>Customer</dt><dd>{job.customer}</dd></div><div><dt>Suburb</dt><dd>{job.suburb}</dd></div><div><dt>Assigned to</dt><dd>{job.employeeName ?? "Unassigned"}</dd></div><div><dt>Created</dt><dd>{formatDate(job.createdAt)}</dd></div></dl>
        </div>{loadingNotes ? <div className="notes-loading" aria-live="polite"><span className="notes-spinner" aria-hidden="true" />Loading comments…</div> : <NotesPanel jobId={job.id} initialNotes={notes} />}</div><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => dialogRef.current?.close()}>Close</button></div>
      </div>
    </dialog>
  </>;
}
