import { DENO_LAND_CLI } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const new_url = new URL(DENO_LAND_CLI);
	return new Response(null, {
		status: 301,
		headers: {
			location: new_url.toString(),
		},
	});
};
