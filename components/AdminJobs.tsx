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

  function change(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: field === "value" ? Number(value) : value } as FormState));
  }

  function edit(job: Job) {
    setEditing(job.id);
    setForm({ customer: job.customer, suburb: job.suburb, jobType: job.jobType, status: job.status, value: job.value });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setForm(blank); setEditing(null); setMessage(editing ? "Job updated." : "Job created."); setBusy(false);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this job and its notes?")) return;
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) { setMessage(payload.error ?? "Could not delete job"); setBusy(false); return; }
    setJobs((current) => current.filter((job) => job.id !== id)); setMessage("Job deleted."); setBusy(false);
  }

  return <main className="shell admin-shell">
    <header className="topbar"><a className="brand" href="/"><img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" /><span className="brand-context">Admin workspace</span></a><a className="brand-call" href="/">Back to board</a></header>
    <section className="admin-header"><div><div className="eyebrow">Ampy Electrical · Admin</div><h1>Manage jobs.</h1><p className="hero-copy">Keep the work queue accurate for the team.</p></div></section>
    <form className="admin-form" onSubmit={save}>
      <div className="section-heading"><div><span className="eyebrow">{editing ? "Edit job" : "New job"}</span><h2>{editing ? "Update details" : "Add a job"}</h2></div></div>
      <div className="admin-fields">
        <label>Customer<input value={form.customer} onChange={(e) => change("customer", e.target.value)} required /></label>
        <label>Suburb<input value={form.suburb} onChange={(e) => change("suburb", e.target.value)} required /></label>
        <label>Job type<input value={form.jobType} onChange={(e) => change("jobType", e.target.value)} required /></label>
        <label>Status<select value={form.status} onChange={(e) => change("status", e.target.value)}>{JOB_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></label>
        <label>Value (AUD)<input type="number" min="0" step="0.01" value={form.value} onChange={(e) => change("value", e.target.value)} required /></label>
      </div>
      <div className="admin-form-actions"><button className="button button-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create job"}</button>{editing && <button type="button" className="button button-secondary" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}<span className="form-message">{message}</span></div>
    </form>
    <section className="admin-list"><div className="section-heading"><div><span className="eyebrow">Work queue</span><h2>{jobs.length} jobs</h2></div></div>{jobs.map((job) => <div className="admin-row" key={job.id}><div><strong>{job.customer}</strong><span>{job.jobType} · {job.suburb}</span></div><span>{statusLabel(job.status)}</span><span>${job.value.toLocaleString("en-AU")}</span><div className="admin-row-actions"><button className="button button-secondary" onClick={() => edit(job)}>Edit</button><button className="button button-danger" onClick={() => remove(job.id)}>Delete</button></div></div>)}</section>
  </main>;
}
