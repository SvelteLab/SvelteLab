import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { id, files, name } = await request.json();
	const replCollection = locals.poket_base.collection('repls');
	let created;
	try {
		if (id) {
			await replCollection.update(id.toString(), {
				files,
				name
			});
		} else {
			created = await replCollection.create({
				files,
				user: locals.user?.id,
				name
			});
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
