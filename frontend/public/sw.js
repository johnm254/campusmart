const CACHE_NAME = 'campusmart-v5';

// Network-first strategy: always try live server, fallback to cache if offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET and API requests (always live for data)
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // API calls: always go to network — never serve from cache
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // For assets/pages: network first, fall back to cache
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Cache fresh copy of static assets
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return networkResponse;
            })
            .catch(() => {
                // If offline, serve from cache
                return caches.match(event.request);
            })
    );
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
});
