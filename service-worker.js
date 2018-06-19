var cacheName = 'curso_pwa-v1.0.0';
var cacheFiles = [
	'./',
	'assets/css/colors.css',
	'assets/css/main.css',
	'assets/scripts/object.observe.polyfill.js',
	'assets/scripts/array.observe.polyfill.js',
	'assets/scripts/main.js'
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWork] Opened Cache');
			return cache.addAll(cacheFiles);
		})
	)
});

self.addEventListener('activate', function(event) {
	console.log('[ServiceWork] Activated');
	
	event.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[ServiceWork], Removing olf cache');
					return caches.delete(key);
				}
			}));
		})
	)
});

self.addEventListener('fetch', function(event) {
	console.log('[ServiceWork] Fetch', event.request.url);
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				return response;
			}

			var fetchRequest = event.request.clone();
			return fetch(fetchRequest).then(function(response) {
				if(!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}

				var responseToCache = response.clone();
				caches.open(cacheName).then(function(cache) {
					cache.put(event.request, responseToCache);
				});

				return response;
			});
		})
	)
});