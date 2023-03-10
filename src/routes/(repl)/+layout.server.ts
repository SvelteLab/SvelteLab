import { replSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';
import type { FileSystemTree } from '@webcontainer/api';
import type PoketBase from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const ssr = false;

async function get_repl_from_id(id: string, pocketbase: PoketBase) {
	const record = await pocketbase.collection('repls').getOne(id);
	return replSchema.parse(record);
}

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { repl } = params;
	let files: FileSystemTree | undefined;
	let name = 'Hello world';

	if (!repl) {
		return {
			repl: files,
			repl_name: name
		};
	}

	try {
		const record = await get_repl_from_id(repl, locals.pocketbase);
		files = record.files;
		name = record.name;
	} catch (e) {
		/* empty */
	}

	if (!files) {
		throw redirect(300, '/');
	}
	return {
		repl: files,
		id: repl,
		repl_name: name
	};
};
