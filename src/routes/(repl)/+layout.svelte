<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME } from '$env/static/public';
	import CommandRunner from '$lib/command_runner/CommandRunner.svelte';
	import { commands } from '$lib/command_runner/commands';
	import Credits from '$lib/components/Credits.svelte';
	import { is_repl_to_save, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { webcontainer } from '$lib/webcontainer';
	import { decompressFromEncodedURIComponent } from 'lz-string';
	import type { LayoutData } from './$types';
	import Dialog from '$lib/components/Dialog.svelte';
	import { parse } from '$lib/components/parsers';

	export let data: LayoutData;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);
	$: webcontainer.set_file_system(data.repl!);

	let fix_for_double_after = false;

	let url_to_navigate_to = null as null | string;

	let loading_github_repo = false;

	afterNavigate(async () => {
		if (fix_for_double_after) return;
		fix_for_double_after = true;
		// if there's a data.promises.github_repo this means we
		// are loading a github repo as project
		if (data.promises?.github_repo) {
			loading_github_repo = true;
			webcontainer.set_file_system(
				await data.promises.github_repo.then((github_content) => {
					loading_github_repo = false;
					return github_content;
				})
			);
		} else {
			// try to get the project from local storage and then delete it
			const stored_project = window.localStorage.getItem(PUBLIC_SAVE_IN_LOCAL_STORAGE_NAME);
			if (stored_project !== null) {
				try {
					const project = parse(stored_project);
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
							const to_mount = parse(project);
							await webcontainer.set_file_system(to_mount);
						} catch (e) {
							/* empty */
						}
					}
				}
			}
		}

		webcontainer.init().then(() => webcontainer.mount_files());
		// for debugging
		(window as any).wc = webcontainer;
	});

	beforeNavigate(({ cancel, type, to }) => {
		if ($is_repl_to_save && !url_to_navigate_to) {
			// if the repl is to save we call cancel
			cancel();
			// if the type is leave the browser will handle it, otherwise we
			// show custom UI to ask confirmation to the user.
			if (type !== 'leave') {
				url_to_navigate_to = to?.url.href ?? null;
			}
			return;
		}
		url_to_navigate_to = null;
		fix_for_double_after = false;
		$webcontainer.running_process?.kill?.();
	});
</script>

<slot />

<CommandRunner commands={$commands} />
<Credits />
<Dialog
	is_open={!!url_to_navigate_to}
	on:dismiss={() => {
		url_to_navigate_to = null;
	}}
>
	<svelte:fragment slot="dialog-title">Unsaved changes</svelte:fragment>
	Are you sure you want to navigate away? You'll lose your changes.
	<svelte:fragment slot="dialog-actions">
		<button
			style:margin-top="1rem"
			style:color="var(--sk-theme-1)"
			on:click={() => {
				url_to_navigate_to = null;
			}}>No</button
		>
		<a style:margin-top="1rem" style:color="var(--sk-text-1)" href={url_to_navigate_to}>Yes</a>
	</svelte:fragment>
</Dialog>
{#if loading_github_repo}
	<div class="overlay">We are loading your github repo...</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
		backdrop-filter: blur(10px);
	}
</style>
