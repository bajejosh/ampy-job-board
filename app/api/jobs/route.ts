import { NextResponse } from "next/server";
import { errorResponse, readJsonObject } from "@/lib/http";
import { createJob, parseJobInput } from "@/lib/jobs";
import { requireEmployee } from "@/lib/session";

export async function POST(request: Request) {
  try {
    await requireEmployee();
    const job = await createJob(parseJobInput(await readJsonObject(request)));
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
