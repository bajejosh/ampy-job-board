import { NextResponse } from "next/server";
import { errorResponse, HttpError, readJsonObject } from "@/lib/http";
import { addNote, getJob, getNotes } from "@/lib/jobs";
import { requireEmployee } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

async function requireJob(params: RouteContext["params"]) {
  const job = await getJob((await params).id);
  if (!job) throw new HttpError(404, "Job not found");
  return job;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireEmployee();
    const job = await requireJob(params);
    return NextResponse.json({ notes: await getNotes(job.id) });
  } catch (error) {
    return errorResponse(error);
  }
}

// The author always comes from the session, never from the request body.
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const employee = await requireEmployee();
    const job = await requireJob(params);
    const body = await readJsonObject(request);
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) throw new HttpError(400, "Write a note before saving");
    if (content.length > 1000) throw new HttpError(400, "Keep notes under 1,000 characters");
    const note = await addNote(job.id, employee.id, content);
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
