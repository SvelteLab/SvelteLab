<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import CommandRunner from '$lib/command_runner/CommandRunner.svelte';
	import { commands } from '$lib/command_runner/commands';
	import Credits from '$lib/components/Credits.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { is_repl_to_save, repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { webcontainer } from '$lib/webcontainer';
	import type { LayoutData } from './$types';
	import GithubLoading from './GithubLoading.svelte';
	import { handle_load_files } from './handle_load_files';

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
		await handle_load_files(data, (value) => {
			loading_github_repo = value;
		});
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
	<GithubLoading />
{/if}
