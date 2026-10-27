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
  employee_id?: string | null;
  employee_name?: string | null;
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
    employeeId: row.employee_id,
    employeeName: row.employee_name,
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
    `SELECT j.id, j.customer, j.suburb, j.job_type, j.status, j.value, j.created_at, j.employee_id, e.name AS employee_name
     FROM jobs j LEFT JOIN employees e ON e.id = j.employee_id ${where} ORDER BY j.created_at DESC`,
    values,
  );

  return rows?.map(mapJob) ?? [];
}

export async function getJob(id: string) {
  if (!isDatabaseConfigured()) return sampleJobs.find((job) => job.id === id) ?? null;

  const rows = await dbQuery<JobRow>(
    `SELECT j.id, j.customer, j.suburb, j.job_type, j.status, j.value, j.created_at, j.employee_id, e.name AS employee_name FROM jobs j LEFT JOIN employees e ON e.id = j.employee_id WHERE j.id = $1`,
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

export type JobInput = Pick<Job, "customer" | "suburb" | "jobType" | "status" | "value"> & { employeeId?: string | null };

export async function createJob(input: JobInput) {
  if (!isDatabaseConfigured()) throw new Error("A database is required for admin changes");
  const id = `job-${crypto.randomUUID()}`;
  const rows = await dbQuery<JobRow>(
    `INSERT INTO jobs (id, customer, suburb, job_type, status, value, employee_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, customer, suburb, job_type, status, value, created_at, employee_id`,
    [id, input.customer, input.suburb, input.jobType, input.status, input.value, input.employeeId ?? null],
  );
  if (!rows?.[0]) throw new Error("The job could not be created");
  return mapJob(rows[0]);
}

export async function updateJob(id: string, input: JobInput) {
  if (!isDatabaseConfigured()) throw new Error("A database is required for admin changes");
  const rows = await dbQuery<JobRow>(
    `UPDATE jobs SET customer = $2, suburb = $3, job_type = $4, status = $5, value = $6, employee_id = $7
     WHERE id = $1
     RETURNING id, customer, suburb, job_type, status, value, created_at, employee_id`,
    [id, input.customer, input.suburb, input.jobType, input.status, input.value, input.employeeId ?? null],
  );
  if (!rows?.[0]) throw new Error("The job could not be found");
  return mapJob(rows[0]);
}

export async function deleteJob(id: string) {
  if (!isDatabaseConfigured()) throw new Error("A database is required for admin changes");
  const rows = await dbQuery<{ id: string }>("DELETE FROM jobs WHERE id = $1 RETURNING id", [id]);
  if (!rows?.[0]) throw new Error("The job could not be found");
}
