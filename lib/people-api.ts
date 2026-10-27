import { NextResponse } from "next/server";
import { errorResponse, HttpError, readJsonObject } from "@/lib/http";
import { saveCustomer, saveEmployee } from "@/lib/people";
import { requireEmployee } from "@/lib/session";

// Used by /api/people/[type] (create) and /api/people/[type]/[id] (update). Any employee manages customers; only admins manage employees.
export async function savePersonRequest(request: Request, type: string, id: string | null) {
  try {
    if (type === "customers") {
      await requireEmployee();
      const person = await saveCustomer(id, await readJsonObject(request));
      return NextResponse.json({ person }, { status: id ? 200 : 201 });
    }
    if (type === "employees") {
      const actor = await requireEmployee({ admin: true });
      const person = await saveEmployee(id, await readJsonObject(request), actor);
      return NextResponse.json({ person }, { status: id ? 200 : 201 });
    }
    throw new HttpError(404, "Unknown directory");
  } catch (error) {
    return errorResponse(error);
  }
}
