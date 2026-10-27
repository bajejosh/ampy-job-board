import { dbQuery, isDatabaseConfigured } from "@/lib/db";
import { sampleJobs, sampleNotes } from "@/lib/sample-data";
import { Job, JobNote, JobStatus } from "@/lib/types";

type JobRow = {
  id: string;
  customer: string;
  suburb: string;
  job_type: string;
  status: JobStatus;
  value: number | string;
  created_at: Date | string;
};

type NoteRow = {
  id: string;
  job_id: string;
  content: string;
  created_at: Date | string;
};

const fallbackNotes = new Map<string, JobNote[]>();
for (const note of sampleNotes) {
  fallbackNotes.set(note.jobId, [...(fallbackNotes.get(note.jobId) ?? []), note]);
}

function mapJob(row: JobRow): Job {
  return {
    id: row.id,
    customer: row.customer,
    suburb: row.suburb,
    jobType: row.job_type,
    status: row.status,
    value: Number(row.value),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapNote(row: NoteRow): JobNote {
  return {
    id: row.id,
    jobId: row.job_id,
    content: row.content,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getJobs(filters: { search?: string; status?: JobStatus } = {}) {
  if (!isDatabaseConfigured()) {
    const search = filters.search?.toLowerCase() ?? "";
    return sampleJobs.filter((job) => {
      const matchesSearch = !search || job.customer.toLowerCase().includes(search);
      const matchesStatus = !filters.status || job.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }

  const values: string[] = [];
  const conditions: string[] = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`customer ILIKE $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await dbQuery<JobRow>(
    `SELECT id, customer, suburb, job_type, status, value, created_at
     FROM jobs ${where} ORDER BY created_at DESC`,
    values,
  );

  return rows?.map(mapJob) ?? [];
}

export async function getJob(id: string) {
  if (!isDatabaseConfigured()) return sampleJobs.find((job) => job.id === id) ?? null;

  const rows = await dbQuery<JobRow>(
    `SELECT id, customer, suburb, job_type, status, value, created_at FROM jobs WHERE id = $1`,
    [id],
  );
  return rows?.[0] ? mapJob(rows[0]) : null;
}

export async function getNotes(jobId: string) {
  if (!isDatabaseConfigured()) return [...(fallbackNotes.get(jobId) ?? [])].reverse();

  const rows = await dbQuery<NoteRow>(
    `SELECT id, job_id, content, created_at FROM job_notes WHERE job_id = $1 ORDER BY created_at DESC`,
    [jobId],
  );
  return rows?.map(mapNote) ?? [];
}

export async function addNote(jobId: string, content: string) {
  if (!isDatabaseConfigured()) {
    const note: JobNote = {
      id: `demo-note-${Date.now()}`,
      jobId,
      content,
      createdAt: new Date().toISOString(),
    };
    fallbackNotes.set(jobId, [...(fallbackNotes.get(jobId) ?? []), note]);
    return note;
  }

  const rows = await dbQuery<NoteRow>(
    `INSERT INTO job_notes (job_id, content) VALUES ($1, $2)
     RETURNING id, job_id, content, created_at`,
    [jobId, content],
  );

  if (!rows?.[0]) throw new Error("The note could not be saved");
  return mapNote(rows[0]);
}
