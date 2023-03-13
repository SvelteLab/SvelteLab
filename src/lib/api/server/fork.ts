import { fail, redirect, type Action } from '@sveltejs/kit';

/**
 * The common action to fork a repl. It's called from the header and
 * from the profile
 */
export const fork: Action = async ({ request, fetch }) => {
	const form_data = await request.formData();
	const id = form_data.get('id');
	const res = await fetch(`/fork/${id}`, {
		method: 'POST'
	});
	if (res.ok) {
		const created = await res.json();
		throw redirect(301, `/${created.id}`);
	}
	return fail(500);
};
