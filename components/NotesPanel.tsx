"use client";

import { useEffect, useState } from "react";
import { NoteForm } from "@/components/NoteForm";
import { formatDate } from "@/lib/format";
import { JobNote } from "@/lib/types";

export function NotesPanel({ jobId, initialNotes }: { jobId: string; initialNotes: JobNote[] }) {
  const [notes, setNotes] = useState(initialNotes);
  useEffect(() => { setNotes(initialNotes); }, [initialNotes]);

  return (
    <section className="detail-card notes-card" aria-label="Comments">
      <div className="notes-list" aria-live="polite">
        {notes.length === 0 ? (
          <p className="empty-copy">No notes yet. Add the first update for the team.</p>
        ) : (
          notes.map((note) => (
            <article className="note" key={note.id}>
              <p>{note.content}</p>
              <time dateTime={note.createdAt}>You · {formatDate(note.createdAt, true)}</time>
            </article>
          ))
        )}
      </div>
      <NoteForm jobId={jobId} onSaved={(note) => setNotes((current) => [note, ...current])} />
    </section>
  );
}
