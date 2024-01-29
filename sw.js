const cacheVersion = 2;

const activeCaches = {
  PWA: `PWA-v${cacheVersion}`,
  dynamic: `dynamic-v${cacheVersion}`,
};

self.addEventListener("install" , () => {
    console.log("service worker installed")
    self.skipWaiting()
    
        caches.open(activeCaches["PWA"]).then((cache) => {
        console.log('caches done success')
        cache.addAll(['/','./js/app.js' , './css/style.css'])
    });
});


self.addEventListener("activate" , (event) =>{
    console.log("service worker Activated")

    const activeCacheNames = Object.values(activeCaches);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.forEach((cacheName) => {
          if (!activeCacheNames.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch" , (event) => {
    console.log(event.request)
    event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) {
            return response;
          } else {
            return fetch(event.request).then((serverResponse) => {
                caches.open([activeCaches["dynamic"]]).then((cache) => {
                cache.put(event.request, serverResponse.clone());
                  return serverResponse;
                });
              });
          }
        })
      );
});