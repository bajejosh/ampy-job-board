export const JOB_STATUSES = ["new", "scheduled", "in_progress", "completed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export type Job = {
  id: string;
  customerId: string;
  customer: string;
  suburb: string;
  jobType: string;
  status: JobStatus;
  value: number;
  createdAt: string;
  employeeId: string | null;
  employeeName: string | null;
};

export type JobNote = {
  id: string;
  jobId: string;
  content: string;
  createdAt: string;
  authorId: string | null;
  authorName: string | null;
};

export type Customer = { id: string; name: string; contact: string | null; suburb: string };
export type Access = "admin" | "staff";
export type Employee = { id: string; name: string; role: string; contact: string | null; email: string | null; active: boolean; access: Access };

export function parseStatus(value: string | undefined): JobStatus | undefined {
  return JOB_STATUSES.includes(value as JobStatus) ? value as JobStatus : undefined;
}

export function statusLabel(status: JobStatus) {
  return {
    new: "New",
    scheduled: "Scheduled",
    in_progress: "In progress",
    completed: "Completed",
  }[status];
}
