import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async ({ url }) => {
	const new_url = new URL('https://deno.land/x/sveltelab');
	new_url.pathname += url.pathname.substring(1).replace('cli', '');
	return new Response(null, {
		status: 301,
		headers: {
			location: new_url.toString(),
		},
	});
};
