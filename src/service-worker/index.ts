/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

const sw = self as unknown as ServiceWorkerGlobalScope;
const precache_list = [...immutable, ...assets, ...prerendered].map(({ path }) => ({
	url: path,
	revision: version,
}));

cleanupOutdatedCaches();
precacheAndRoute(precache_list);

sw.addEventListener('activate', () => {
	sw.skipWaiting();
});
