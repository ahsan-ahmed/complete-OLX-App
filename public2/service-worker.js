var cacheName = 'olx-app';
var dataCacheName = 'olx-app-v1';
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/scripts/bootstrap.min.js',
    '/styles/olxApp.css',
    '/styles/bootstrap.min.css',
    '/styles/saveAds.css',
    '/templates/saveAds.html',
    '/assets/account-image.jpg',
    '/assets/back3.jpeg',
    '/assets/back-login.jpeg',
    '/assets/bikeImgs.jpg',
    '/assets/bookImgs.png',
    '/assets/carImgs.jpg',
    '/assets/fashionImgs.jpg',
    '/assets/jobImgs.png',
    '/assets/mobileImgs.jpg',
    '/assets/petImgs.jpg',
    '/assets/propertiesImgs.gif',
    '/assets/search_folder.png',
    '/assets/tvImgs.jpg',
    '/assets/olx-image.png',
    '/assets/olx-1.jpg'
    ];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });

 self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  });
