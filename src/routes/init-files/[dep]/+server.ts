import { json, type Config } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const file = import.meta.glob('../deps/*', { as: 'raw' });
	const content = await file['../deps/' + params.dep + '.json']();
	return json(JSON.parse(content), {
		headers: {
			'Cache-Control': 'public, max-age=604800, immutable'
		}
	});
};

export const config: Config = {
	runtime: 'edge'
};
