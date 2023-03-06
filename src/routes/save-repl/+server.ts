import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { id, files } = await request.json();
	const replCollection = locals.poket_base.collection('repls');
	let created;
	try {
		if (id) {
			await replCollection.update(id.toString(), {
				files
			});
		} else {
			created = await replCollection.create({
				files,
				user: locals.user?.id
			});
		}
	} catch (e) {
		return new Response((e as Error).message, {
			status: 500
		});
	}
	return json({
		id: created?.id
	});
};
