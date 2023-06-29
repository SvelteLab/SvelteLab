import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());
		console.log(data);

		try {
			await locals.pocketbase.collection('users').create(data);
			await locals.pocketbase
				.collection('users')
				.authWithPassword(data.email.toString(), data.password.toString());
		} catch (error) {
			console.log(error);
			return fail(400, { error: JSON.stringify(error) });
		}

		throw redirect(303, '/');
	},
} satisfies Actions;
