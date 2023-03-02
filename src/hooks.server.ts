import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'Cross-Origin-Embedder-Policy': 'require-corp',
		'Cross-Origin-Opener-Policy': 'same-origin'
	});
	return resolve(event, {
		transformPageChunk(input) {
			const theme = event.cookies.get('svelteblitz-theme') ?? '';
			return input.html.replace('%theme%', theme);
		}
	});
};
