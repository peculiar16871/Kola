import { NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "https://kola-wib6.onrender.com";

export function getBackendConfig() {
  return {
    baseUrl: (process.env.KOLA_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, ""),
    apiKey: process.env.KOLA_BACKEND_API_KEY || process.env.API_KEY || ""
  };
}

export async function proxyBackend(
  path: string,
  init: RequestInit = {}
) {
  const { baseUrl, apiKey } = getBackendConfig();
  if (!apiKey) {
    return NextResponse.json(
      { detail: "KOLA_BACKEND_API_KEY is not configured for the frontend server." },
      { status: 500 }
    );
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-key": apiKey,
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : { detail: await response.text() };

  return NextResponse.json(body, { status: response.status });
}
