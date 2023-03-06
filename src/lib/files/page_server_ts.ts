export const page_server_ts = `import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		test_data: ["cool"]
	};
}) satisfies PageServerLoad;`;