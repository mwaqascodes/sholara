// PakEducate Service Worker v1.0
const CACHE_NAME = 'pakeducate-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if some assets can't be cached
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Supabase API calls (always need fresh data)
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for HTML/JS/CSS
        if (response.ok && (
          event.request.url.endsWith('.js') ||
          event.request.url.endsWith('.css') ||
          event.request.url.endsWith('.html') ||
          event.request.url.endsWith('/')
        )) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed: try cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// Push notifications (future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New notification from PakEducate',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.tag || 'pakeducate',
    requireInteraction: false,
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'PakEducate', options)
  );
});
