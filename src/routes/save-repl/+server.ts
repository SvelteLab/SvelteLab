import { replSchema } from '$lib/schemas';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { id, files, name, is_forking } = await request.json();
	let to_save;
	try {
		to_save = replSchema.parse({ id, files, name, user: locals.user?.id });
	} catch (e) {
		return new Response('Parsing error', {
			status: 500,
		});
	}
	const repl_collection = locals.pocketbase.collection('repls');
	let created;
	try {
		if (to_save.id && !is_forking) {
			// id or user should not be updated
			await repl_collection.update(id.toString(), {
				files: to_save.files,
				name: to_save.name,
			});
		} else {
			// delete to_save.id just to be sure
			delete to_save.id;
			created = await repl_collection.create(to_save);
		}
	} catch (e) {
		console.log(e);
		return new Response((e as Error).message, {
			status: 500,
		});
	}
	return json({
		id: created?.id,
	});
};
