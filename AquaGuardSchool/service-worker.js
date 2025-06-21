const CACHE_NAME = 'aquaguard-school-v1';
const urlsToCache = [
  './', // La página principal de tu aplicación
  './index.html', // Tu archivo HTML principal
  'https://cdn.tailwindcss.com', // El archivo CSS de Tailwind (se carga desde internet)
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', // La fuente Inter de Google Fonts (se carga desde internet)
  './service-worker.js', // El propio service worker (se cachea a sí mismo)
  './icons/icon-192x192.png', // Tu icono pequeño
  './icons/icon-512x512.png' // Tu icono grande
  // ¡IMPORTANTE! Si tu aplicación tiene otros archivos CSS o JavaScript que hayas creado (por ejemplo, 'style.css'
  // o un archivo JavaScript llamado 'script.js'), DEBES añadirlos a esta lista para que se cacheen y la
  // aplicación funcione offline correctamente. Por ejemplo:
  // './style.css',
  // './script.js',
];

self.addEventListener('install', event => {
  // Este evento ocurre cuando el service worker se instala. Aquí cacheamos todos los archivos necesarios.
  event.waitUntil(
    caches.open(CACHE_NAME) // Abre la caché con el nombre que definimos
      .then(cache => {
        console.log('Service Worker: Cache abierta');
        return cache.addAll(urlsToCache); // Añade todos los archivos a la caché
      })
  );
});

self.addEventListener('fetch', event => {
  // Este evento ocurre cada vez que la aplicación intenta cargar un recurso (ej. una imagen, un archivo CSS).
  event.respondWith(
    caches.match(event.request) // Intenta encontrar el recurso en la caché
      .then(response => {
        // Si el recurso está en caché, lo devuelve inmediatamente
        if (response) {
          return response;
        }
        // Si no está en caché, lo busca en la red (internet)
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  // Este evento ocurre cuando el service worker se activa. Limpiamos cachés antiguas aquí.
  const cacheWhitelist = [CACHE_NAME]; // Lista de cachés que queremos mantener
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre de la caché no está en nuestra lista blanca, la elimina
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});