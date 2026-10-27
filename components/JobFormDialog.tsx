"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Customer, Employee, Job, JOB_STATUSES, statusLabel } from "@/lib/types";

type Props = {
  job?: Job;
  customers: Customer[];
  employees: Employee[];
  canDelete?: boolean;
  triggerLabel: string;
  triggerClassName: string;
  onSaved: (job: Job) => void;
  onDeleted?: (jobId: string) => void;
};

type Form = { customerId: string; suburb: string; jobType: string; status: string; value: string; employeeId: string };

function initialForm(job?: Job): Form {
  return {
    customerId: job?.customerId ?? "",
    suburb: job?.suburb ?? "",
    jobType: job?.jobType ?? "",
    status: job?.status ?? "new",
    value: job ? String(job.value) : "",
    employeeId: job?.employeeId ?? "",
  };
}

export function JobFormDialog({ job, customers, employees, canDelete, triggerLabel, triggerClassName, onSaved, onDeleted }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [form, setForm] = useState<Form>(() => initialForm(job));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // Inactive employees stay selectable only if the job is already assigned to them.
  const assignable = employees.filter((employee) => employee.active || employee.id === job?.employeeId);

  function open() {
    setForm(initialForm(job));
    setError("");
    setConfirmingDelete(false);
    dialogRef.current?.showModal();
  }

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function chooseCustomer(customerId: string) {
    const customer = customers.find((item) => item.id === customerId);
    setForm((current) => ({ ...current, customerId, suburb: current.suburb || customer?.suburb || "" }));
  }

  async function request(url: string, init: RequestInit) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(url, init);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? `Request failed (${response.status})`);
      return payload;
    } catch (caught) {
      setError(caught instanceof Error && caught.message !== "Failed to fetch" ? caught.message : "Couldn't reach the server. Check your connection and try again.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const payload = await request(job ? `/api/jobs/${job.id}` : "/api/jobs", {
      method: job ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!payload) return;
    onSaved(payload.job);
    dialogRef.current?.close();
  }

  async function remove() {
    if (!job) return;
    const payload = await request(`/api/jobs/${job.id}`, { method: "DELETE" });
    if (!payload) return;
    dialogRef.current?.close();
    onDeleted?.(job.id);
  }

  return (
    <>
      <button className={triggerClassName} type="button" onClick={open}>{triggerLabel}</button>
      <dialog ref={dialogRef} className="job-modal" aria-labelledby={titleId}>
        <form className="modal-card admin-form" onSubmit={submit}>
          <div className="modal-header">
            <div><span className="eyebrow">{job ? "Edit job" : "New job"}</span><h2 id={titleId}>{job ? "Update job" : "Add a job"}</h2></div>
            <button className="modal-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button>
          </div>
          <div className="admin-fields">
            <label>Customer
              <select required value={form.customerId} onChange={(event) => chooseCustomer(event.target.value)}>
                <option value="" disabled>Choose a customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </label>
            <label>Suburb<input required value={form.suburb} onChange={(event) => set("suburb", event.target.value)} /></label>
            <label>Job type<input required value={form.jobType} onChange={(event) => set("jobType", event.target.value)} /></label>
            <label>Assigned to
              <select value={form.employeeId} onChange={(event) => set("employeeId", event.target.value)}>
                <option value="">Unassigned</option>
                {assignable.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}{employee.active ? "" : " (inactive)"}</option>)}
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(event) => set("status", event.target.value)}>
                {JOB_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
              </select>
            </label>
            <label>Value (AUD)<input required type="number" min="0" step="0.01" inputMode="decimal" value={form.value} onChange={(event) => set("value", event.target.value)} /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : job ? "Save changes" : "Create job"}</button>
            <button className="button button-secondary" type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
            {job && canDelete && (confirmingDelete
              ? <button className="button button-danger" type="button" disabled={saving} onClick={remove}>Confirm delete</button>
              : <button className="button button-danger" type="button" onClick={() => setConfirmingDelete(true)}>Delete job</button>)}
          </div>
          {confirmingDelete && <p className="confirm-copy">This removes the job and all its notes. It can't be undone.</p>}
        </form>
      </dialog>
    </>
  );
}
