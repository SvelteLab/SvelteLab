import { dev } from '$app/environment';
import { POCKETBASE_URL } from '$env/static/private';
import { PUBLIC_THEME_COOKIE_NAME } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import PocketBase from 'pocketbase';

const handle_headers: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'Cross-Origin-Embedder-Policy': 'require-corp',
		'Cross-Origin-Opener-Policy': 'same-origin'
	});
	return resolve(event, {
		transformPageChunk(input) {
			const theme = event.cookies.get(PUBLIC_THEME_COOKIE_NAME) ?? '';
			return input.html.replace('%theme%', theme);
		}
	});
};

const handle_poketbase: Handle = async ({ event, resolve }) => {
	event.locals.pocketbase = new PocketBase(POCKETBASE_URL);
	event.locals.pocketbase.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		// get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
		event.locals.pocketbase.authStore.isValid &&
			(await event.locals.pocketbase.collection('users').authRefresh());
		event.locals.user = structuredClone(event.locals.pocketbase.authStore.model);
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pocketbase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);
	response.headers.append(
		'set-cookie',
		event.locals.pocketbase.authStore.exportToCookie({ secure: !dev })
	);

	return response;
};

export const handle = sequence(handle_headers, handle_poketbase);
