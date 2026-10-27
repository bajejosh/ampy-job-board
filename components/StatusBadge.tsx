import { JobStatus, statusLabel } from "@/lib/types";

export function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`status-badge status-${status}`}>{statusLabel(status)}</span>;
}
