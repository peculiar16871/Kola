import { proxyBackend } from "@/lib/backend";

export async function POST(request: Request) {
  const payload = await request.json();
  return proxyBackend("/api/groups/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
