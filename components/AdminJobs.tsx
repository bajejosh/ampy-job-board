"use client";

import { useState } from "react";
import { Job, JOB_STATUSES, JobStatus, statusLabel } from "@/lib/types";

type Props = { initialJobs: Job[] };
type FormState = Omit<Job, "id" | "createdAt">;
const blank: FormState = { customer: "", suburb: "", jobType: "", status: "new", value: 0 };

export function AdminJobs({ initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs);
  const [form, setForm] = useState<FormState>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Job | null>(null);
  const [deleteError, setDeleteError] = useState("");

  function change(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: field === "value" ? Number(value) : value } as FormState));
  }

  function edit(job: Job) {
    setEditing(job.id);
    setForm({ customer: job.customer, suburb: job.suburb, jobType: job.jobType, status: job.status, value: job.value });
    setMessage("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const response = await fetch(editing ? `/api/admin/jobs/${editing}` : "/api/admin/jobs", {
      method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error ?? "Could not save job"); setBusy(false); return; }
    setJobs((current) => editing ? current.map((job) => job.id === payload.job.id ? payload.job : job) : [payload.job, ...current]);
    setForm(blank); setEditing(null); setMessage(editing ? "Job updated." : "Job created."); setBusy(false); (document.getElementById("job-editor") as HTMLDialogElement).close();
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true); setDeleteError("");
    try {
      const response = await fetch(`/api/admin/jobs/${deleting.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? `Could not delete job (${response.status})`);
      setJobs((current) => current.filter((job) => job.id !== deleting.id)); setDeleting(null); setMessage("Job deleted.");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not delete job");
    } finally { setBusy(false); }
  }

  return <main className="shell admin-shell">
    <header className="topbar"><a className="brand" href="/"><img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" /><span className="brand-context">Admin workspace</span></a><a className="brand-call" href="/">Back to board</a></header>
    <section className="admin-header"><div><div className="eyebrow">Ampy Electrical · Admin</div><h1>Manage jobs.</h1><p className="hero-copy">Keep the work queue accurate for the team.</p></div></section>
    <div className="admin-toolbar"><div><span className="eyebrow">Work queue</span><h2>{jobs.length} jobs</h2></div><button className="button button-primary" onClick={() => { setEditing(null); setForm(blank); setMessage(""); (document.getElementById("job-editor") as HTMLDialogElement).showModal(); }}>+ Add job</button></div>
    <dialog id="job-editor" className="job-modal">
      <form className="modal-card admin-form" onSubmit={save}>
        <div className="modal-header"><div><span className="eyebrow">{editing ? "Edit job" : "New job"}</span><h2>{editing ? "Update details" : "Add a job"}</h2></div><button className="modal-close" type="button" aria-label="Close" onClick={() => (document.getElementById("job-editor") as HTMLDialogElement).close()}>×</button></div>
        <div className="admin-fields">
        <label>Customer<input value={form.customer} onChange={(e) => change("customer", e.target.value)} required /></label>
        <label>Suburb<input value={form.suburb} onChange={(e) => change("suburb", e.target.value)} required /></label>
        <label>Job type<input value={form.jobType} onChange={(e) => change("jobType", e.target.value)} required /></label>
        <label>Status<select value={form.status} onChange={(e) => change("status", e.target.value)}>{JOB_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></label>
        <label>Value (AUD)<input type="number" min="0" step="0.01" value={form.value} onChange={(e) => change("value", e.target.value)} required /></label>
      </div>
        <div className="admin-form-actions"><button className="button button-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create job"}</button><button type="button" className="button button-secondary" onClick={() => (document.getElementById("job-editor") as HTMLDialogElement).close()}>Cancel</button><span className="form-message">{message}</span></div>
      </form>
    </dialog>
    <section className="admin-list">{jobs.map((job) => <div className="admin-row" key={job.id}><div><strong>{job.customer}</strong><span>{job.jobType} · {job.suburb}</span></div><span>{statusLabel(job.status)}</span><span>${job.value.toLocaleString("en-AU")}</span><div className="admin-row-actions"><button className="button button-secondary" onClick={() => { edit(job); (document.getElementById("job-editor") as HTMLDialogElement).showModal(); }}>Edit</button><button className="button button-danger" onClick={() => setDeleting(job)}>Delete</button></div></div>)}</section>
    <dialog open={Boolean(deleting)} className="job-modal" onClick={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}>
      <div className="modal-card confirm-card"><div className="modal-header"><div><span className="eyebrow">Remove job</span><h2>Delete this job?</h2></div><button className="modal-close" type="button" aria-label="Close" onClick={() => setDeleting(null)}>×</button></div><p className="confirm-copy">This will remove <strong>{deleting?.customer}</strong> and its saved notes from the work queue.</p>{deleteError && <p className="form-error">{deleteError}</p>}<div className="modal-actions"><button className="button button-danger" type="button" disabled={busy} onClick={remove}>{busy ? "Deleting…" : "Delete job"}</button><button className="button button-secondary" type="button" onClick={() => setDeleting(null)}>Keep job</button></div></div>
    </dialog>
  </main>;
}
