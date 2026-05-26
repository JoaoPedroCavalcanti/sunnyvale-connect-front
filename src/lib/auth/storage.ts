// Low-level token storage. localStorage in the browser, no-ops on the server
// so SSR doesn't crash. Tokens are read synchronously to keep the API client
// simple.

const ACCESS_KEY = "sv.auth.access";
const REFRESH_KEY = "sv.auth.refresh";

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return safeStorage()?.getItem(ACCESS_KEY) ?? null;
}

export function getRefreshToken(): string | null {
  return safeStorage()?.getItem(REFRESH_KEY) ?? null;
}

export function setTokens(access: string, refresh?: string): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(ACCESS_KEY, access);
  if (refresh) s.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(ACCESS_KEY);
  s.removeItem(REFRESH_KEY);
}
