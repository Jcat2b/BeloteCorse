// Worker pour la communication avec le worker Cloudflare
const WORKER_URL = 'https://damp-forest-0b2b.jerem-catta.workers.dev';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(WORKER_URL)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response;
        })
        .catch(error => {
          console.error('Fetch error:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch from worker' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data.type === 'PING') {
    // Vérifie la connexion avec le worker Cloudflare
    fetch(`${WORKER_URL}/ping`)
      .then(response => response.json())
      .then(data => {
        event.source.postMessage({
          type: 'PONG',
          data
        });
      })
      .catch(error => {
        event.source.postMessage({
          type: 'ERROR',
          error: error.message
        });
      });
  }
});