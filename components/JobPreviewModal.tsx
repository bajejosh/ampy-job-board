"use client";

import Link from "next/link";
import { useRef } from "react";
import { Job } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export function JobPreviewModal({ job }: { job: Job }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return <>
    <button className="job-row job-row-button" type="button" onClick={() => dialogRef.current?.showModal()}>
      <div className="job-main"><div className="job-title-line"><h3>{job.customer}</h3><StatusBadge status={job.status} /></div><p>{job.jobType} <span aria-hidden="true">·</span> {job.suburb}</p></div>
      <div className="job-value"><span>Value</span><strong>{formatCurrency(job.value)}</strong></div><span className="row-arrow" aria-hidden="true">↗</span>
    </button>
    <dialog ref={dialogRef} className="job-modal">
      <div className="modal-card"><div className="modal-header"><div><span className="eyebrow">Job {job.id.replace("job-", "#")}</span><h2>{job.jobType}</h2><p className="modal-subtitle">{job.customer} · {job.suburb}</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button></div>
        <div className="modal-summary"><StatusBadge status={job.status} /><strong>{formatCurrency(job.value)}</strong></div>
        <dl className="details-list"><div><dt>Customer</dt><dd>{job.customer}</dd></div><div><dt>Suburb</dt><dd>{job.suburb}</dd></div><div><dt>Created</dt><dd>{formatDate(job.createdAt)}</dd></div></dl>
        <div className="modal-actions"><Link className="button button-primary" href={`/jobs/${job.id}`}>Open details & notes</Link><button className="button button-secondary" type="button" onClick={() => dialogRef.current?.close()}>Close</button></div>
      </div>
    </dialog>
  </>;
}
