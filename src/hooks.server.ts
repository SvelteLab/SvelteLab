import { THEME_COOKIE } from '$lib/cookie';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'Cross-Origin-Embedder-Policy': 'require-corp',
		'Cross-Origin-Opener-Policy': 'same-origin'
	});
	return resolve(event, {
		transformPageChunk(input) {
			const theme = event.cookies.get(THEME_COOKIE) ?? '';
			return input.html.replace('%theme%', theme);
		}
	});
};
