import { replSchema } from '$lib/schemas';
import { json, error } from '@sveltejs/kit';
import type PoketBase from 'pocketbase';

async function get_repl_from_id(id: string, pocketbase: PoketBase) {
	const record = await pocketbase.collection('repls').getOne(id);
	return replSchema.parse(record);
}

export async function GET({ params, locals }) {
	const { repl } = params;
	try {
		const { user, expand, ...record } = await get_repl_from_id(repl, locals.pocketbase);
		return json(record);
	} catch (e) {
		throw error(404);
	}
}
