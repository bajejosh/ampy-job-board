import { NextResponse } from "next/server";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function readJsonObject(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Send a JSON body");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "Send a JSON object");
  return body as Record<string, unknown>;
}

// Postgres errors never reach the client: known constraint failures get a plain message,
// everything else is logged and returned as a generic 500.
export function errorResponse(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
  const code = typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined;
  if (code === "23505") return NextResponse.json({ error: "That email is already in use" }, { status: 409 });
  if (code === "23503") return NextResponse.json({ error: "A linked customer or employee no longer exists" }, { status: 400 });
  console.error(error);
  return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
}
