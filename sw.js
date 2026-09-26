// Uygulama dosyalarını telefonda saklar; internet yokken de açılır.
// index.html'i değiştirdiğinizde aşağıdaki sürüm numarasını 1 artırın (v2, v3...).
const CACHE = 'converter-neo-v3';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Kur servisleri her zaman internetten gelsin (önbelleğe alınmaz)
  if (url.origin !== self.location.origin) return;

  // Uygulama dosyaları: önce internet, olmazsa önbellek
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
