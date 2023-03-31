<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import CommandRunner from '$lib/command_runner/CommandRunner.svelte';
	import { commands } from '$lib/command_runner/commands';
	import { repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { webcontainer } from '$lib/webcontainer';
	import { decompressFromEncodedURIComponent } from 'lz-string';
	import type { LayoutData } from './$types';
	import Credits from './Credits.svelte';

	export let data: LayoutData;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);
	$: webcontainer.set_file_system(data.repl!);

	let fix_for_double_after = false;

	afterNavigate(async () => {
		if (fix_for_double_after) return;
		fix_for_double_after = true;
		// try to get the project from local storage and then delete it
		const stored_project = window.localStorage.getItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
		if (stored_project !== null) {
			try {
				const project = JSON.parse(stored_project);
				await webcontainer.set_file_system(project);
			} catch (e) {
				/* empty */
			}
			window.localStorage.removeItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
		} else {
			// check if there's the hash
			const hash = window.location.hash.substring(1);
			if (hash) {
				const url_search_params = new URLSearchParams(hash);
				const code = url_search_params.get('code');
				if (code) {
					const project = decompressFromEncodedURIComponent(code);
					try {
						const to_mount = JSON.parse(project);
						await webcontainer.set_file_system(to_mount);
					} catch (e) {
						/* empty */
					}
				}
			}
		}

		webcontainer.init().then(() => webcontainer.mount_files());
		// for debugging
		(window as any).wc = webcontainer;
	});

	beforeNavigate(() => {
		fix_for_double_after = false;
		$webcontainer.running_process?.kill?.();
	});
</script>

<slot />

<CommandRunner commands={$commands} />
<Credits />
