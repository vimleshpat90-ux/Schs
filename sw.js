const CACHE_NAME = 'creator-studio-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// ऐप इंस्टॉल होते समय फाइलें कैश (Save) करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// पुराना कैश साफ़ करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// नेटवर्क से ताज़ा API डेटा लाना और ऑफलाइन होने पर कैश से पेज दिखाना
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('graph.facebook.com')) {
    return; // API कॉल्स को हमेशा लाइव इंटरनेट से ही लाएं
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
