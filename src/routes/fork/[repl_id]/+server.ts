import type { RequestHandler } from './$types';
import type { Record } from 'pocketbase';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, params: { repl_id } }) => {
	const repls = locals.pocketbase.collection('repls');
	try {
		const existing_repl = (await repls
			.getFirstListItem(`id = "${repl_id}"`)
			.then(structuredClone)) as Partial<Record>;
		delete existing_repl.id;
		existing_repl.user = locals.user?.id;
		const created = await repls.create(existing_repl);
		return json({ id: created.id });
	} catch (e) {
		console.log(e);
		return new Response(null, { status: 404 });
	}
};
