import { savePersonRequest } from "@/lib/people-api";

type Context = { params: Promise<{ type: string; id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { type, id } = await params;
  return savePersonRequest(request, type, id);
}
