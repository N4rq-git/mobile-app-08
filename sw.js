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

self.addEventListener("fetfh", (event) => {
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