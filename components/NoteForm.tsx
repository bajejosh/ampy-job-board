"use client";

import { FormEvent, useId, useState } from "react";
import { JobNote } from "@/lib/types";

export function NoteForm({ jobId, onSaved }: { jobId: string; onSaved?: (note: JobNote) => void }) {
  const inputId = useId();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() || isSaving) return;

    setIsSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch(`/api/jobs/${jobId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; note?: JobNote };

      if (!response.ok || !result.note) {
        throw new Error(result.error ?? "The note could not be saved");
      }

      setContent("");
      setMessage("Note saved");
      onSaved?.(result.note);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "The note could not be saved");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <label htmlFor={inputId}>Add a note</label>
      <textarea
        id={inputId}
        name="content"
        rows={3}
        maxLength={1000}
        placeholder="Share a useful update with the team…"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={isSaving}
      />
      <div className="note-form-footer">
        <span className={isError ? "form-message form-message-error" : "form-message"} role={isError ? "alert" : "status"} aria-live="polite">
          {message ?? `${content.length}/1,000 characters`}
        </span>
        <button className="button button-primary" type="submit" disabled={isSaving || !content.trim()}>
          {isSaving ? "Saving…" : "Save note"}
        </button>
      </div>
    </form>
  );
}
