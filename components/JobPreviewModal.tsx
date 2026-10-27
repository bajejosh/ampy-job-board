"use client";

import { useId, useRef, useState } from "react";
import { Customer, Employee, Job, JobNote } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { NotesPanel } from "@/components/NotesPanel";
import { JobFormDialog } from "@/components/JobFormDialog";
import type { CurrentEmployee } from "@/lib/session";

type Props = {
  job: Job;
  customers: Customer[];
  employees: Employee[];
  currentEmployee: CurrentEmployee;
  onSaved: (job: Job) => void;
  onDeleted: (jobId: string) => void;
};

type NotesState = { status: "idle" | "loading" | "error" } | { status: "loaded"; notes: JobNote[] };

export function JobPreviewModal({ job, customers, employees, currentEmployee, onSaved, onDeleted }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [notes, setNotes] = useState<NotesState>({ status: "idle" });

  async function loadNotes() {
    setNotes({ status: "loading" });
    try {
      const response = await fetch(`/api/jobs/${job.id}/notes`);
      if (!response.ok) throw new Error(String(response.status));
      const payload = (await response.json()) as { notes: JobNote[] };
      setNotes({ status: "loaded", notes: payload.notes });
    } catch {
      setNotes({ status: "error" });
    }
  }

  function open() {
    dialogRef.current?.showModal();
    if (notes.status !== "loaded" && notes.status !== "loading") void loadNotes();
  }

  return <>
    <button className="job-row job-row-button" type="button" onClick={open}>
      <div className="job-main"><div className="job-title-line"><h3>{job.customer}</h3></div><p>{job.jobType} <span aria-hidden="true">·</span> {job.suburb}</p></div>
      <div className="job-value"><strong>{formatCurrency(job.value)}</strong></div><StatusBadge status={job.status} /><span className="row-arrow" aria-hidden="true">↗</span>
    </button>
    <dialog ref={dialogRef} className="job-modal" aria-labelledby={titleId}>
      <div className="modal-card modal-card-wide"><div className="modal-header"><div><span className="eyebrow">Job {job.id.replace("job-", "#")}</span><h2 id={titleId}>{job.jobType}</h2><p className="modal-subtitle">{job.customer} · {job.suburb}</p></div><button className="modal-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button></div>
        <div className="job-modal-columns"><div>
        <div className="modal-summary"><StatusBadge status={job.status} /><strong>{formatCurrency(job.value)}</strong></div>
        <dl className="details-list"><div><dt>Customer</dt><dd>{job.customer}</dd></div><div><dt>Suburb</dt><dd>{job.suburb}</dd></div><div><dt>Assigned to</dt><dd>{job.employeeName ?? "Unassigned"}</dd></div><div><dt>Created</dt><dd>{formatDate(job.createdAt)}</dd></div></dl>
        </div>
        {notes.status === "loaded" ? (
          <NotesPanel jobId={job.id} initialNotes={notes.notes} currentEmployeeId={currentEmployee.id} />
        ) : notes.status === "error" ? (
          <div className="notes-loading" role="alert">Couldn&apos;t load notes. <button className="table-action" type="button" onClick={loadNotes}>Try again</button></div>
        ) : (
          <div className="notes-loading" aria-live="polite"><span className="notes-spinner" aria-hidden="true" />Loading notes…</div>
        )}
        </div>
        <div className="modal-actions">
          <JobFormDialog
            job={job}
            customers={customers}
            employees={employees}
            canDelete={currentEmployee.access === "admin"}
            triggerLabel="Edit job"
            triggerClassName="button button-primary"
            onSaved={onSaved}
            onDeleted={(jobId) => { dialogRef.current?.close(); onDeleted(jobId); }}
          />
          <button className="button button-secondary" type="button" onClick={() => dialogRef.current?.close()}>Close</button>
        </div>
      </div>
    </dialog>
  </>;
}
