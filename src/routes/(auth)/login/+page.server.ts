import { fail, redirect, type Actions } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { ZodError, z } from 'zod';

const login_schema = z.object({
	email: z.string(),
	password: z.string(),
});

export const actions = {
	default: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		try {
			login_schema.parse(data);
			await locals.pocketbase
				.collection('users')
				.authWithPassword(data.email.toString(), data.password.toString());
		} catch (error) {
			if (error instanceof ZodError) {
				return fail(400, {
					error: error.issues
						.map((i) => i.message.replace('String', i.path.at(-1) + '' || 'String'))
						.join('. '),
				});
			}
			if (error instanceof ClientResponseError) {
				return fail(400, { error: 'Did you use the correct email and password?.' });
			}
			return fail(400, { error: 'Something unexpected happen. Sorry :/' });
		}

		throw redirect(303, '/');
	},
} satisfies Actions;
