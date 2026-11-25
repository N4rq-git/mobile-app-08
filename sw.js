const CACHE_NAME = "level-cache-v1";

const FILE_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js"
]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILE_TO_CACHE);
        })
    )
});

self.addEventListener("fetfch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request)
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) =>
                        name.startsWith("level-cache-") &&
                    name !==CACHE_NAME
                )
                .map((name) => caches.delete(name))
            );
        })
    );
});