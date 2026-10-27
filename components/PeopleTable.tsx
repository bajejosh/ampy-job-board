"use client";

import { FormEvent, useId, useRef, useState } from "react";
import type { Customer, Employee } from "@/lib/types";

const PAGE_SIZE = 5;

type Props =
  | { type: "customers"; initial: Customer[]; canEdit: boolean; currentEmployeeId: string }
  | { type: "employees"; initial: Employee[]; canEdit: boolean; currentEmployeeId: string };

type Person = Customer | Employee;

export function PeopleTable(props: Props) {
  const { type, canEdit, currentEmployeeId } = props;
  const isCustomer = type === "customers";
  const noun = isCustomer ? "customer" : "employee";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [items, setItems] = useState<Person[]>(props.initial);
  const [editing, setEditing] = useState<Person | null>(null);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Bumped on every open so the uncontrolled inputs pick up fresh defaults.
  const [formKey, setFormKey] = useState(0);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const editingEmployee = !isCustomer ? (editing as Employee | null) : null;
  const editingSelf = editingEmployee?.id === currentEmployeeId;

  function open(person: Person | null) {
    setEditing(person);
    setError("");
    setFormKey((key) => key + 1);
    dialogRef.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    setError("");
    try {
      const response = await fetch(editing ? `/api/people/${type}/${editing.id}` : `/api/people/${type}`, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? `Could not save (${response.status})`);
      const saved = payload.person as Person;
      setItems((current) => (editing ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]));
      if (!editing) setPage(1);
      dialogRef.current?.close();
    } catch (caught) {
      setError(caught instanceof Error && caught.message !== "Failed to fetch" ? caught.message : "Couldn't reach the server. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return <>
    {canEdit && <div className="directory-actions"><button className="button button-primary" type="button" onClick={() => open(null)}>+ Add {noun}</button></div>}
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">{isCustomer ? "Customer" : "Employee"}</th>
            <th scope="col">{isCustomer ? "Suburb" : "Role"}</th>
            <th scope="col">{isCustomer ? "Contact" : "Email"}</th>
            {!isCustomer && <th scope="col">Status</th>}
            {canEdit && <th scope="col"><span className="visually-hidden">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {visible.map((person) => (
            <tr key={person.id}>
              <th scope="row"><strong>{person.name}</strong>{!isCustomer && (person as Employee).access === "admin" && <small> · Admin</small>}</th>
              <td>{isCustomer ? (person as Customer).suburb : (person as Employee).role}</td>
              <td>{(isCustomer ? person.contact : (person as Employee).email) || "—"}</td>
              {!isCustomer && <td><span className={`table-status ${(person as Employee).active ? "is-active" : ""}`}>{(person as Employee).active ? "Active" : "Inactive"}</span></td>}
              {canEdit && <td><button className="table-action" type="button" onClick={() => open(person)} aria-label={`Edit ${person.name}`}>Edit</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <nav className="pagination" aria-label={`${noun} pages`}>
      <span>Page {currentPage} of {pageCount}</span>
      <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button>
    </nav>
    <dialog ref={dialogRef} className="job-modal" aria-labelledby={titleId}>
      <form key={formKey} className="modal-card admin-form" onSubmit={submit}>
        <div className="modal-header">
          <div><span className="eyebrow">{isCustomer ? "Customer" : "Employee account"}</span><h2 id={titleId}>{editing ? "Edit" : "Add"} {noun}</h2></div>
          <button type="button" className="modal-close" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <div className="admin-fields">
          <label>Name<input name="name" defaultValue={editing?.name ?? ""} required /></label>
          {isCustomer ? (
            <label>Suburb<input name="suburb" defaultValue={(editing as Customer | null)?.suburb ?? ""} required /></label>
          ) : (
            <>
              <label>Role<input name="role" defaultValue={editingEmployee?.role ?? ""} placeholder="Electrician" required /></label>
              <label>Email<input name="email" type="email" defaultValue={editingEmployee?.email ?? ""} autoComplete="off" /><small>Needed to sign in</small></label>
              <label>Password<input name="password" type="password" minLength={12} autoComplete="new-password" placeholder={editing ? "Leave blank to keep current" : "At least 12 characters"} /><small>Leave blank for a directory-only entry</small></label>
              <label>Access
                <select name="access" defaultValue={editingEmployee?.access ?? "staff"} disabled={editingSelf}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>Status
                <select name="active" defaultValue={editingEmployee?.active === false ? "false" : "true"} disabled={editingSelf}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>
              {editingSelf && <><input type="hidden" name="access" value="admin" /><input type="hidden" name="active" value="true" /></>}
            </>
          )}
          <label>{isCustomer ? "Contact" : "Phone or other contact"}<input name="contact" defaultValue={editing?.contact ?? ""} /></label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          <button type="button" className="button button-secondary" onClick={() => dialogRef.current?.close()}>Cancel</button>
        </div>
      </form>
    </dialog>
  </>;
}
