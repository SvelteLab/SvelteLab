import { default_project_files } from '$lib/default_project_files';
import { replSchema } from '$lib/schemas';
import { redirect } from '@sveltejs/kit';
import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';
import type PoketBase from 'pocketbase';
import type { LayoutServerLoad } from './$types';
import { PUBLIC_TEMPLATE_COOKIE_NAME } from '$env/static/public';
import { GITHUB_TOKEN } from '$env/static/private';

export const ssr = false;

async function get_repl_from_id(id: string, pocketbase: PoketBase) {
	const record = await pocketbase.collection('repls').getOne(id);
	return replSchema.parse(record);
}

async function fetch_github_repo(base_url: string, is_dir = true) {
	const res = await fetch(base_url, {
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
		},
	});
	if (res.headers.get('x-ratelimit-remaining') === '0') {
		throw new Error('Rate limit reached, try again in a while');
	}
	const contents = await res.json();
	if (!is_dir) {
		return contents.content;
	}
	const retval: FileSystemTree = {} as FileSystemTree;
	for (const files of contents) {
		if (files.type === 'dir') {
			retval[files.name] = {
				directory: await fetch_github_repo(files.url),
			};
		} else if (files.type === 'file') {
			retval[files.name] = {
				file: {
					contents: atob(await fetch_github_repo(files.url, false)),
				},
			};
		}
	}
	return retval;
}

export const load: LayoutServerLoad = async ({
	params,
	locals,
	url: { searchParams },
	cookies,
}) => {
	const { repl } = params;
	const provider = searchParams.get('provider');
	const owner = searchParams.get('owner');
	const repo = searchParams.get('repo');
	const branch = searchParams.get('branch');
	const path = searchParams.get('path');

	// if there's an owner and a repo and there isn't a repl id we
	// are trying to load files from github
	if (owner && repo && !repl && provider === 'github') {
		const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}${
			branch ? `?ref=${branch}` : ''
		}`;
		const github_repo = fetch_github_repo(url);
		return {
			repl_name: repo,
			promises: {
				github_repo,
			},
		};
	}

	// if there's a ?login query param we are back from the login and we can try load files
	// from the local storage so don't bother getting them from pocketbase
	const from_login = searchParams.get('login') !== null;
	const saved_default_template = cookies.get(PUBLIC_TEMPLATE_COOKIE_NAME) ?? 'basic';
	const template = searchParams.get('t') ?? saved_default_template;
	const default_files =
		default_project_files[template] ?? default_project_files[saved_default_template];
	let files: FileSystemTree = (default_files as DirectoryNode).directory;
	let name = 'Hello World';

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
