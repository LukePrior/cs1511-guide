// Establish cache
const cacheName = 'main_cache';

// Assets to precache but reload
const precachedAssets = [
    '/static/css/main.css',
    '/static/js/index.js',
    '/manifest.json',
    '/static/img/favicon.ico',
    '/static/img/android-chrome-192x192.png',
    '/static/img/android-chrome-512x512.png',
    '/static/img/apple-touch-icon.png',
];

// Assets to permenantly precache
const permenantCachedAssets = [
    'https://registry.wapm.io/graphql',
    'https://registry-cdn.wapm.io/packages/taybenlor/runno-clang/runno-clang-0.1.2.tar.gz'
];

const graphQL = "https://registry.wapm.io/graphql";
const graphQLResult = {"data":{"command":{"command":"runno-clang","module":{"name":"clang","abi":"wasi","source":"clang.wasm"},"packageVersion":{"version":"0.1.2","package":{"name":"taybenlor/runno-clang","displayName":"taybenlor/runno-clang"},"filesystem":[{"wasm":"/sys","host":"sysroot"}],"distribution":{"downloadUrl":"https://registry-cdn.wapm.io/packages/taybenlor/runno-clang/runno-clang-0.1.2.tar.gz"},"modules":[{"name":"clang","publicUrl":"https://registry-cdn.wapm.io/contents/taybenlor/runno-clang/0.1.2/clang.wasm","abi":"wasi"},{"name":"wasm-ld","publicUrl":"https://registry-cdn.wapm.io/contents/taybenlor/runno-clang/0.1.2/wasm-ld.wasm","abi":"wasi"}],"commands":[{"command":"runno-clang","module":{"name":"clang","abi":"wasi","source":"clang.wasm"}},{"command":"runno-wasm-ld","module":{"name":"wasm-ld","abi":"wasi","source":"wasm-ld.wasm"}}]}}}}

// Precache assets on install
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => {
        //const cacheList = precachedAssets.concat(permenantCachedAssets);
        //console.log(cacheList);
        fillServiceWorkerCache();
    }));
  });

const fillServiceWorkerCache = function () {
    return caches.open(cacheName).then(function (cache) {
        return Promise.all(
            precachedAssets.map(function (url) {
                return cache.add(url)
            })
        );
    });
};
  

self.addEventListener('fetch', function (event) {
    const url = new URL(event.request.url);
    const isPrecachedRequest = precachedAssets.includes(url.pathname);
    //const isPermenantPrecachedRequest = permenantCachedAssets.includes(url.pathname);
    // ToDo refesh isPrecachedRequest
    if (isPrecachedRequest) {
        event.respondWith(caches.open(cacheName).then((cache) => {
            console.log("Serve: " + event.request.url);
            return cache.match(event.request.url);
        }));
    } else if (event.request.url == graphQL) {
        console.log("GraphQL: " + event.request.url);
        return graphQLResult;
    } else {
        console.log("Fallback: " + event.request.url);
    }
});