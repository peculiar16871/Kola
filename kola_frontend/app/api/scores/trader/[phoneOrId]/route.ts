import { proxyBackend } from "@/lib/backend";

export async function GET(
  _request: Request,
  { params }: { params: { phoneOrId: string } }
) {
  return proxyBackend(`/api/scores/trader/${encodeURIComponent(params.phoneOrId)}`);
}
