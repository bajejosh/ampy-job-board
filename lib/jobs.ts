import { dbQuery } from "@/lib/db";
import { HttpError } from "@/lib/http";
import { Job, JobNote, JobStatus, JOB_STATUSES } from "@/lib/types";

type JobRow = {
  id: string;
  customer_id: string;
  customer: string;
  suburb: string;
  job_type: string;
  status: JobStatus;
  value: number | string;
  created_at: Date | string;
  employee_id: string | null;
  employee_name: string | null;
};

type NoteRow = {
  id: string;
  job_id: string;
  content: string;
  created_at: Date | string;
  author_id: string | null;
  author_name: string | null;
};

const JOB_SELECT = `SELECT j.id, j.customer_id, c.name AS customer, j.suburb, j.job_type, j.status, j.value, j.created_at, j.employee_id, e.name AS employee_name
  FROM jobs j JOIN customers c ON c.id = j.customer_id LEFT JOIN employees e ON e.id = j.employee_id`;

function mapJob(row: JobRow): Job {
  return {
    id: row.id,
    customerId: row.customer_id,
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
    authorId: row.author_id,
    authorName: row.author_name,
  };
}

export async function getJobs() {
  const rows = await dbQuery<JobRow>(`${JOB_SELECT} ORDER BY j.created_at DESC`);
  return rows.map(mapJob);
}

export async function getJob(id: string) {
  const rows = await dbQuery<JobRow>(`${JOB_SELECT} WHERE j.id = $1`, [id]);
  return rows[0] ? mapJob(rows[0]) : null;
}

export async function getNotes(jobId: string) {
  const rows = await dbQuery<NoteRow>(
    `SELECT n.id, n.job_id, n.content, n.created_at, n.author_id, e.name AS author_name
     FROM job_notes n LEFT JOIN employees e ON e.id = n.author_id
     WHERE n.job_id = $1 ORDER BY n.created_at DESC`,
    [jobId],
  );
  return rows.map(mapNote);
}

export async function addNote(jobId: string, authorId: string, content: string) {
  const rows = await dbQuery<NoteRow>(
    `WITH inserted AS (
       INSERT INTO job_notes (job_id, author_id, content) VALUES ($1, $2, $3)
       RETURNING id, job_id, content, created_at, author_id
     )
     SELECT inserted.*, e.name AS author_name FROM inserted LEFT JOIN employees e ON e.id = inserted.author_id`,
    [jobId, authorId, content],
  );
  return mapNote(rows[0]);
}

export type JobInput = { customerId: string; suburb: string; jobType: string; status: JobStatus; value: number; employeeId: string | null };

export function parseJobInput(input: Record<string, unknown>): JobInput {
  const text = (key: string) => (typeof input[key] === "string" ? (input[key] as string).trim() : "");
  const customerId = text("customerId");
  const suburb = text("suburb");
  const jobType = text("jobType");
  const status = text("status");
  const value = Number(input.value);
  if (!customerId || !suburb || !jobType) throw new HttpError(400, "Choose a customer and enter a suburb and job type");
  if (!JOB_STATUSES.includes(status as JobStatus)) throw new HttpError(400, "Choose a valid status");
  if (input.value === "" || !Number.isFinite(value) || value < 0) throw new HttpError(400, "Enter a value of 0 or more");
  return { customerId, suburb, jobType, status: status as JobStatus, value, employeeId: text("employeeId") || null };
}

// jobs.customer is a name snapshot kept for older deployments reading the same database.
export async function createJob(input: JobInput) {
  const id = `job-${crypto.randomUUID()}`;
  await dbQuery(
    `INSERT INTO jobs (id, customer_id, customer, suburb, job_type, status, value, employee_id)
     SELECT $1, c.id, c.name, $3, $4, $5, $6, $7 FROM customers c WHERE c.id = $2`,
    [id, input.customerId, input.suburb, input.jobType, input.status, input.value, input.employeeId],
  );
  const job = await getJob(id);
  if (!job) throw new HttpError(400, "That customer no longer exists");
  return job;
}

export async function updateJob(id: string, input: JobInput) {
  const rows = await dbQuery<{ id: string }>(
    `UPDATE jobs j SET customer_id = c.id, customer = c.name, suburb = $3, job_type = $4, status = $5, value = $6, employee_id = $7
     FROM customers c WHERE j.id = $1 AND c.id = $2 RETURNING j.id`,
    [id, input.customerId, input.suburb, input.jobType, input.status, input.value, input.employeeId],
  );
  if (!rows[0]) throw new HttpError(404, "That job or customer no longer exists");
  return (await getJob(id))!;
}

export async function deleteJob(id: string) {
  const rows = await dbQuery<{ id: string }>("DELETE FROM jobs WHERE id = $1 RETURNING id", [id]);
  if (!rows[0]) throw new HttpError(404, "That job no longer exists");
}
