import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(301, '/');
	}
	return {
		repls: locals.pocketbase
			.collection('repls')
			.getFullList()
			.then((repls) => repls.map((repl) => structuredClone(repl)))
	};
};
