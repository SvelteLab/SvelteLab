import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(301, '/');
	}
	const repls = await (
		await locals.poket_base.collection('repls').getFullList()
	).map((repl) => structuredClone(repl));
	return {
		repls
	};
};
