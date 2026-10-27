import { NextResponse } from "next/server";
import { addNote, getJob, getNotes } from "@/lib/jobs";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ notes: await getNotes(id) });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a note in the request body" }, { status: 400 });
  }

  const content = typeof payload === "object" && payload !== null && "content" in payload
    ? (payload as { content?: unknown }).content
    : undefined;

  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Write a note before saving" }, { status: 400 });
  }

  if (content.trim().length > 1000) {
    return NextResponse.json({ error: "Keep notes under 1,000 characters" }, { status: 400 });
  }

  const note = await addNote(job.id, content.trim());
  return NextResponse.json({ note }, { status: 201 });
}
