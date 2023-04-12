/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

const sw = self as unknown as ServiceWorkerGlobalScope;
const precache_list = [...build, ...files, ...prerendered].map((s) => ({
	url: s,
	revision: version,
}));

cleanupOutdatedCaches();
precacheAndRoute(precache_list);

sw.addEventListener('activate', () => {
	sw.skipWaiting();
});
