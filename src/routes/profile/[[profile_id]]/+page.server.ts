import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fork } from '$lib/api/server/fork';

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

export const actions = {
	async delete({ locals, request }) {
		const form_data = await request.formData();
		const id = form_data.get('id');
		try {
			locals.pocketbase.collection('repls').delete(id?.toString() ?? '');
		} catch (e) {
			return fail(500);
		}
		return { success: true };
	},
	fork
} satisfies Actions;
