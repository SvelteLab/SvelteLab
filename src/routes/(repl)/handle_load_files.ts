import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
import { webcontainer } from '$lib/webcontainer';
import { decompressFromEncodedURIComponent } from 'lz-string';
import type { LayoutData } from './$types';
import { parse } from '$lib/components/parsers';
import { error } from '$lib/toast';

export async function handle_load_files(
	data: LayoutData,
	set_loading_github_repo: (value: boolean) => void
) {
	const stored_project = window.localStorage.getItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
	const hash = window.location.hash.substring(1);

	/**
	 * The priority is
	 * - Github project
	 * - Project stored in local storage
	 * - Project in the hash
	 */

	// if there's a data.promises.github_repo this means we
	// are loading a github repo as project
	if (data.promises?.github_repo) {
		set_loading_github_repo(true);
		webcontainer.set_file_system(
			await data.promises.github_repo
				.then((github_content) => {
					set_loading_github_repo(false);
					return github_content;
				})
				.catch(() => {
					error('There was a problem during the cloning of you repo, try again');
				})
		);
	} else if (stored_project !== null) {
		// if there's a stored_project we parse if and than delete it
		try {
			const project = parse(stored_project);
			await webcontainer.set_file_system(project);
		} catch (e) {
			/* empty */
		}
		window.localStorage.removeItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
	} else if (hash) {
		// finally if there's an hash we parse it
		const url_search_params = new URLSearchParams(hash);
		const code = url_search_params.get('code');
		if (code) {
			const project = decompressFromEncodedURIComponent(code);
			try {
				const to_mount = parse(project);
				await webcontainer.set_file_system(to_mount);
			} catch (e) {
				/* empty */
			}
		}
	}
}
