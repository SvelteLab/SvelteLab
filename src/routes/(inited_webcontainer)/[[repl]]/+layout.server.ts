import { redirect } from '@sveltejs/kit';
import type { FileSystemTree } from '@webcontainer/api';
import type PoketBase from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const ssr = false;

async function get_repl_from_id(id: string, poket_base: PoketBase) {
	const replRecord = await poket_base.collection('repls').getOne(id);
	// TODO zod validate
	return replRecord;
}

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { repl } = params;
	let repl_files: FileSystemTree | undefined;
	let repl_name = 'Hello world';
	if (repl) {
		try {
			const repl_stored = await get_repl_from_id(repl, locals.poket_base);
			repl_files = repl_stored.files;
			repl_name = repl_stored.name;
		} catch (e) {
			/* empty */
		}
	}
	if (repl && !repl_files) {
		throw redirect(300, '/');
	}
	return {
		repl: repl_files,
		id: repl,
		repl_name
	};
};
