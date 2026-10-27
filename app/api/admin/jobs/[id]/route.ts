import { NextResponse } from "next/server";
import { deleteJob, updateJob } from "@/lib/jobs";
import { JOB_STATUSES } from "@/lib/types";
import { isAdminRequest } from "@/lib/admin-auth";

function parseInput(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid job payload");
  const input = value as Record<string, unknown>;
  const customer = typeof input.customer === "string" ? input.customer.trim() : "";
  const suburb = typeof input.suburb === "string" ? input.suburb.trim() : "";
  const jobType = typeof input.jobType === "string" ? input.jobType.trim() : "";
  const status = typeof input.status === "string" ? input.status : "";
  const amount = Number(input.value);
  if (!customer || !suburb || !jobType || !JOB_STATUSES.includes(status as never) || !Number.isFinite(amount) || amount < 0) {
    throw new Error("Enter a customer, suburb, job type, valid status, and non-negative value");
  }
  return { customer, suburb, jobType, status: status as typeof JOB_STATUSES[number], value: amount };
}

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  try {
    const { id } = await params;
    const job = await updateJob(id, parseInput(await request.json()));
    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update job" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!isAdminRequest(_request)) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  try {
    await deleteJob((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not delete job" }, { status: 400 });
  }
}
