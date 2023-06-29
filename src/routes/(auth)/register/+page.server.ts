import { fail, redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const register_schema = z.object({
	email: z.string(),
	password: z.string(),
	passwordConfirm: z.string(),
	name: z.string().optional(),
});

export const actions = {
	default: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		try {
			register_schema.parse(data);
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
