import type { RequestHandler } from './$types';
/**
 * With this proxy we can easily pass an url
 * and it will append the correct CORS header.
 *
 * We need this because to use webcontainer api we need to
 * have a Cross-Origin-Embedder-Policy, but than to embed
 * something we need to that request the header
 * Cross-Origin-Resource-Policy set to cross-origin.
 */
export const GET: RequestHandler = async ({ url, fetch }) => {
	const url_to_fetch = url.searchParams.get('url');
	if (!url_to_fetch) {
		return new Response(null, {
			status: 404
		});
	}
	const res = await fetch(url_to_fetch);
	const to_ret = new Response(res.body, {
		headers: res.headers,
		status: res.status,
		statusText: res.statusText
	});
	to_ret.headers.append('Cross-Origin-Resource-Policy', 'cross-origin');
	return to_ret;
};
