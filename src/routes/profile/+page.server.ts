import { replSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';
import type { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(301, '/');
	}
	const replsCollection = await await locals.poket_base.collection('repls').getFullList();
	const repls: z.infer<typeof replSchema>[] = [];
	for (const repl of replsCollection) {
		try {
			repls.push(replSchema.parse(repl));
		} catch (e) {
			/* no need to throw we just exclude the repl if it's damaged */
		}
	}
	return {
		repls
	};
};
