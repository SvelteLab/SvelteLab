<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import CommandRunner from '$lib/command_runner/CommandRunner.svelte';
	import { commands } from '$lib/command_runner/commands';
	import Credits from '$lib/components/Credits.svelte';
	import { is_repl_to_save, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { webcontainer } from '$lib/webcontainer';
	import SvelteCompiler from '$lib/workers/svelte-compiler?worker';
	import { decompressFromEncodedURIComponent } from 'lz-string';
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);
	$: webcontainer.set_file_system(data.repl!);

	let fix_for_double_after = false;

	const onbeforeunload_handler = (e: BeforeUnloadEvent) =>
		'You will lose your progress are you sure you want to close?';

	function handle_unload(is_repl_to_save: boolean) {
		if (!browser || dev) return;
		if (is_repl_to_save) {
			window.onbeforeunload = onbeforeunload_handler;
		} else {
			window.onbeforeunload = null;
		}
	}

	$: handle_unload($is_repl_to_save);

	const svelte_compiler = new SvelteCompiler();
	svelte_compiler.postMessage({ type: 'init' });
	setContext('svelte-compiler', svelte_compiler);

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
