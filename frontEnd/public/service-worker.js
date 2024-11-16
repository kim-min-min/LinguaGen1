const CACHE_NAME = 'linguagen-cache-v1';
const DYNAMIC_CACHE = 'linguagen-dynamic-v1';

// 항상 네트워크 우선으로 가져올 리소스들
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/graphql'
];

// 캐시 우선으로 가져올 정적 리소스들
const CACHE_FIRST_ROUTES = [
  '/static/',
  '/assets/',
  '/images/',
  '.png',
  '.jpg',
  '.svg',
  '.css',
  '.js'
];

self.addEventListener('fetch', (event) => {
  // chrome-extension 요청은 무시
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // API 요청은 네트워크 우선 전략 사용
  if (NETWORK_FIRST_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 응답 복제 후 캐시 저장
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 네트워크 실패시 캐시된 응답 반환
          return caches.match(event.request);
        })
    );
    return;
  }

  // 정적 리소스는 캐시 우선 전략 사용
  if (CACHE_FIRST_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request)
            .then(fetchResponse => {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return fetchResponse;
            });
        })
    );
    return;
  }

  // 그 외의 요청은 네트워크 우선, 실패시 캐시
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 새로운 서비스 워커 활성화시 이전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 이전 캐시 삭제
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      // 새로운 서비스 워커가 즉시 페이지 제어하도록 설정
      clients.claim()
    ])
  );
});

// 개발 모드에서는 캐시를 비활성화하는 옵션
if (process.env.NODE_ENV === 'development') {
  self.addEventListener('install', () => {
    self.skipWaiting();
  });
}
