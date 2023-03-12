import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { profile_id } = params;
	if (!locals.user && !profile_id) {
		throw redirect(301, '/');
	}
	const user_id = profile_id ?? locals.user?.id;
	let profile;
	try {
		profile = await locals.pocketbase
			.collection('users')
			.getFirstListItem(`id = "${user_id}"`)
			.then((user) => structuredClone(user));
	} catch (e) {
		console.log(e);
		throw redirect(301, '/');
	}
	return {
		repls: locals.pocketbase
			.collection('repls')
			.getList(1, 50, {
				filter: `user.id = "${user_id}"`
			})
			.then((repls) => repls.items.map((repl) => structuredClone(repl))),
		profile
	};
};
