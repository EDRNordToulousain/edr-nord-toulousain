/* Network-only by design: no CacheStorage, IndexedDB, background sync or form
   persistence. No API response, HTML page or personal information is cached. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate' || url.origin !== self.location.origin || !(url.pathname === '/benevoles' || url.pathname.startsWith('/benevoles/'))) return;
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Bénévoles EDR — Hors connexion</title><body><h1>Vous êtes hors connexion</h1><p>Reconnectez-vous pour consulter les missions et vous inscrire.</p><a href="/benevoles">Réessayer</a></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })));
});
