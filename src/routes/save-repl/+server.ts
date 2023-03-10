import { replSchema } from '$lib/schemas';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { id, files, name } = await request.json();
	let to_save;
	try {
		to_save = replSchema.parse({ id, files, name, user: locals.user?.id });
	} catch (e) {
		return new Response('Parsing error', {
			status: 500
		});
	}
	const replCollection = locals.pocketbase.collection('repls');
	let created;
	try {
		if (to_save.id) {
			// id or user should not be updated
			await replCollection.update(id.toString(), {
				files: to_save.files,
				name: to_save.name
			});
		} else {
			// delete to_save.id just to be sure
			delete to_save.id;
			created = await replCollection.create(to_save);
		}
	} catch (e) {
		console.log(e);
		return new Response((e as Error).message, {
			status: 500
		});
	}
	return json({
		id: created?.id
	});
};
