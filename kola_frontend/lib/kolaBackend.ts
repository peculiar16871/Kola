const DEFAULT_BACKEND_URL = "https://kola-wib6.onrender.com";

export function getKolaBackendConfig() {
  const baseUrl =
    process.env.KOLA_BACKEND_URL ??
    process.env.KOLA_API_URL ??
    process.env.NEXT_PUBLIC_KOLA_API_URL ??
    DEFAULT_BACKEND_URL;
  const apiKey = process.env.KOLA_BACKEND_API_KEY ?? process.env.KOLA_API_KEY ?? process.env.API_KEY ?? null;

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    apiKey,
  };
}

export async function fetchKolaBackend(path: string, init: RequestInit = {}) {
  const { baseUrl, apiKey } = getKolaBackendConfig();
  const headers = new Headers(init.headers);

  if (apiKey) {
    headers.set("X-API-Key", apiKey);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

function getErrorMessage(body: Record<string, any>) {
  if (typeof body.error === "string") return body.error;
  if (typeof body.detail === "string") return body.detail;
  if (typeof body.detail?.message === "string") return body.detail.message;
  if (typeof body.detail?.squad_response?.message === "string") return body.detail.squad_response.message;
  if (typeof body.message === "string") return body.message;
  return "KOLA backend request failed.";
}

export async function proxyKolaJson(path: string, init: RequestInit = {}) {
  const response = await fetchKolaBackend(path, init);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      body: {
        error: getErrorMessage(body),
        detail: body.detail ?? body.error ?? body,
      },
    };
  }

  return {
    ok: true,
    status: response.status,
    body,
  };
}
