// Registers the PWA service worker on the client. Idempotent — safe to call
// multiple times. Skipped on the server and during dev unless explicitly enabled.

export function registerServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  // Vite sets import.meta.env.DEV in dev mode; skip SW there to avoid stale
  // module caching while iterating.
  if (import.meta.env.DEV) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
      console.warn("SW registration failed:", err);
    });
  });
}
