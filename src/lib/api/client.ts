// Typed API client built on the OpenAPI schema generated from the Django
// backend. Adds JWT bearer headers on every request and transparently
// refreshes the access token once when the API returns 401, then retries.

import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../auth/storage";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Single in-flight refresh promise so a burst of 401s only triggers one
// refresh round-trip and queues up behind it.
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refresh = getRefreshToken();
  if (!refresh) return null;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${baseUrl}/api/token/refresh/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) {
        clearTokens();
        return null;
      }
      const data = (await res.json()) as { access?: string };
      if (!data.access) {
        clearTokens();
        return null;
      }
      setTokens(data.access);
      return data.access;
    } catch {
      clearTokens();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = getAccessToken();
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
  async onResponse({ request, response }) {
    if (response.status !== 401) return response;
    // The refresh endpoint itself returning 401 means the refresh token is dead.
    if (request.url.endsWith("/api/token/refresh/")) return response;

    const newAccess = await refreshAccessToken();
    if (!newAccess) {
      // Bubble up so callers (router guard, query error boundary) can react.
      onUnauthorized();
      return response;
    }

    // Retry the original request with the fresh token. Clone everything so we
    // don't consume the original body.
    const retried = new Request(request.url, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.bodyUsed ? undefined : await request.clone().arrayBuffer(),
      credentials: request.credentials,
      mode: request.mode,
    });
    retried.headers.set("Authorization", `Bearer ${newAccess}`);
    return fetch(retried);
  },
};

// Pluggable hook so the AuthProvider can wire navigation/logout when the
// refresh round-trip ultimately fails.
let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

export const api = createClient<paths>({ baseUrl });
api.use(authMiddleware);
