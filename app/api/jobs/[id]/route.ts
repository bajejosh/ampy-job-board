import { NextResponse } from "next/server";
import { errorResponse, readJsonObject } from "@/lib/http";
import { deleteJob, parseJobInput, updateJob } from "@/lib/jobs";
import { requireEmployee } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    await requireEmployee();
    const job = await updateJob((await params).id, parseJobInput(await readJsonObject(request)));
    return NextResponse.json({ job });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    await requireEmployee({ admin: true });
    await deleteJob((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
