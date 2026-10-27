"use client";

import { useState } from "react";
import { NoteForm } from "@/components/NoteForm";
import { formatDate } from "@/lib/format";
import { JobNote } from "@/lib/types";

function authorLabel(note: JobNote, currentEmployeeId: string) {
  if (note.authorId === currentEmployeeId) return "You";
  // No author means the note predates author tracking, or its author was deleted.
  return note.authorName ?? "Unknown author";
}

export function NotesPanel({ jobId, initialNotes, currentEmployeeId }: { jobId: string; initialNotes: JobNote[]; currentEmployeeId: string }) {
  const [notes, setNotes] = useState(initialNotes);

  return (
    <section className="detail-card notes-card" aria-label="Notes">
      <div className="notes-list" aria-live="polite">
        {notes.length === 0 ? (
          <p className="empty-copy">No notes yet. Add the first update for the team.</p>
        ) : (
          notes.map((note) => (
            <article className="note" key={note.id}>
              <p>{note.content}</p>
              <time dateTime={note.createdAt}>{authorLabel(note, currentEmployeeId)} · {formatDate(note.createdAt, true)}</time>
            </article>
          ))
        )}
      </div>
      <NoteForm jobId={jobId} onSaved={(note) => setNotes((current) => [note, ...current])} />
    </section>
  );
}
