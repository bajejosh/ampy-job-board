"use client";

import { useState } from "react";
import { NoteForm } from "@/components/NoteForm";
import { formatDate } from "@/lib/format";
import { JobNote } from "@/lib/types";

export function NotesPanel({ jobId, initialNotes }: { jobId: string; initialNotes: JobNote[] }) {
  const [notes, setNotes] = useState(initialNotes);

  return (
    <section className="detail-card notes-card" aria-labelledby="notes-heading">
      <div className="card-heading">
        <div>
          <span className="eyebrow">Team log</span>
          <h2 id="notes-heading">Notes</h2>
        </div>
        <span className="note-count">{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
      </div>

      <NoteForm jobId={jobId} onSaved={(note) => setNotes((current) => [note, ...current])} />

      <div className="notes-list" aria-live="polite">
        {notes.length === 0 ? (
          <p className="empty-copy">No notes yet. Add the first update for the team.</p>
        ) : (
          notes.map((note) => (
            <article className="note" key={note.id}>
              <p>{note.content}</p>
              <time dateTime={note.createdAt}>{formatDate(note.createdAt, true)}</time>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
