// SunnyvaleConnect service worker.
// Bump CACHE_VERSION to force clients to drop stale assets on next load.
const CACHE_VERSION = "v1";
const ASSET_CACHE = `sv-assets-${CACHE_VERSION}`;

// Precache the app shell entry points so the icon-install criteria is satisfied
// and the user gets *something* offline.
const APP_SHELL = ["/", "/login", "/home", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ASSET_CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== ASSET_CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML / navigation: network-first so SSR content stays fresh, fallback to cache.
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(ASSET_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached ?? caches.match("/home") ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets (JS/CSS/images): cache-first, then network, then store.
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        if (fresh.ok && fresh.type === "basic") {
          const cache = await caches.open(ASSET_CACHE);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch {
        return Response.error();
      }
    })(),
  );
});
