import { redirect } from '@sveltejs/kit';
import type { FileSystemTree } from '@webcontainer/api';
import type PoketBase from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const ssr = false;

async function get_repl_from_id(id: string, poket_base: PoketBase) {
	const replRecord = await poket_base.collection('repls').getOne(id);
	// TODO zod validate
	return replRecord.files as FileSystemTree;
}

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { repl } = params;
	let repl_files: FileSystemTree | undefined;
	if (repl) {
		try {
			repl_files = await get_repl_from_id(repl, locals.poket_base);
		} catch (e) {
			/* empty */
		}
	}
	if (repl && !repl_files) {
		throw redirect(300, '/');
	}
	return {
		repl: repl_files,
		id: repl
	};
};
