const CACHE_NAME = 'aquaguard-school-v3'; // Cambié la versión para forzar una actualización de caché
const urlsToCache = [
  '/AquaGuard/', // Ruta raíz de la aplicación en GitHub Pages
  '/AquaGuard/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  '/AquaGuard/service-worker.js', // El service worker se cachea a sí mismo
  '/AquaGuard/icons/icon-192x192.png',
  '/AquaGuard/icons/icon-512x512.png'
  // ¡IMPORTANTE! Si tienes otros archivos CSS o JavaScript personalizados,
  // DEBES añadir sus rutas con el prefijo /AquaGuard/
  // Ejemplo: '/AquaGuard/tu_archivo_estilos.css',
  // Ejemplo: '/AquaGuard/tu_archivo_script.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
