import { savePersonRequest } from "@/lib/people-api";

type Context = { params: Promise<{ type: string }> };

export async function POST(request: Request, { params }: Context) {
  return savePersonRequest(request, (await params).type, null);
}
