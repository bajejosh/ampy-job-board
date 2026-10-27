import { NextResponse } from "next/server";
import { createJob } from "@/lib/jobs";
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

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  try {
    const job = await createJob(parseInput(await request.json()));
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create job" }, { status: 400 });
  }
}
