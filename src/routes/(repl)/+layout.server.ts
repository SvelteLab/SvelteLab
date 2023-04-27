import { default_project_files } from '$lib/default_project_files';
import { replSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';
import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';
import type PoketBase from 'pocketbase';
import type { LayoutServerLoad } from './$types';
import { PUBLIC_TEMPLATE_COOKIE_NAME } from '$env/static/public';

export const ssr = false;

async function get_repl_from_id(id: string, pocketbase: PoketBase) {
	const record = await pocketbase.collection('repls').getOne(id);
	return replSchema.parse(record);
}

export const load: LayoutServerLoad = async ({ params, locals, url, cookies }) => {
	const { repl } = params;
	// if there's a ?login query param we are back from the login and we can try load files
	// from the local storage so don't bother getting them from pocketbase
	const from_login = url.searchParams.get('login') !== null;
	const saved_default_template = cookies.get(PUBLIC_TEMPLATE_COOKIE_NAME) ?? 'basic';
	const template = url.searchParams.get('t') ?? saved_default_template;
	const default_files =
		default_project_files[template] ?? default_project_files[saved_default_template];
	let files: FileSystemTree = (default_files as DirectoryNode).directory;
	let name = 'Hello world';

	if (!repl || from_login) {
		return {
			repl: files,
			repl_name: name,
		};
	}
	let owner_id;
	try {
		const record = await get_repl_from_id(repl, locals.pocketbase);
		// i don't like this but the required parsing introduces a lot of types
		// shit and i feel like it would be a pain to mantain...we have to
		// leave a bit of typesafety here for a safe management
		files = record.files as FileSystemTree;
		name = record.name;
		owner_id = record.user;
	} catch (e) {
		/* empty */
	}

	if (!files) {
		throw redirect(300, '/');
	}
	return {
		// we can use normal JSON.stringify here because it comes
		// from pocketbase and it's already stringified on save
		repl: JSON.stringify(files),
		id: repl,
		repl_name: name,
		owner_id,
	};
};
