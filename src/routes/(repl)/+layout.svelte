<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { save_repl } from '$lib/api/client/repls';
	import { first_time } from '$lib/first_load';
	import { repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { tips_store } from '$lib/stores/tips_store';
	import { error } from '$lib/toast';
	import { webcontainer } from '$lib/webcontainer';
	import { Dialog } from 'as-comps';
	import { onMount } from 'svelte';
	import ConfigFiles from '~icons/material-symbols/display-settings-outline-rounded';
	import Tip from '~icons/material-symbols/tips-and-updates';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let isTipOpen = true;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);
	$: webcontainer.set_file_system(data.repl!);

	let fix_for_double_after = false;

	afterNavigate(() => {
		if (fix_for_double_after) return;
		console.log('booting');
		fix_for_double_after = true;
		// for debugging
		(window as any).wc = webcontainer;
		webcontainer.init().then(() => webcontainer.mount_files());
	});

	beforeNavigate(() => {
		console.log('killing?');
		fix_for_double_after = false;
		$webcontainer.running_process?.kill?.();
	});

	async function handleKeydown(e: KeyboardEvent) {
		if (!(e.code === 'KeyS' && e.ctrlKey)) return;
		e.preventDefault();
		if (data.user) {
			if (!data.owner_id || data.user.id === data.owner_id) {
				await save_repl();
				return;
			}
			error('You are trying to save a REPL not owned by you. You might want to fork it first.');
			return;
		}
		error('It seems you are trying to save. Login to save your project.');
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<slot />

<Dialog
	--as-dialog-container-z-index="9999"
	--as-dialog-width="max(50vw, 35rem)"
	--as-dialog--actions-justify-content="flex-end"
	--as-dialog--actions--child-button-flex-grow="0"
	--as-dialog-border-radius=".25rem"
	--as-dialog-background="var(--sk-back-2)"
	--as-dialog-padding="3rem"
	noCloseButton
	autofocus={false}
	isOpen={isTipOpen && $tips_store.no_config && first_time}
	includedTrigger={false}
>
	<h1><Tip />[TIP] No config to the extreme</h1>
	<p>
		By default we don't show the usual config files associated with a Sveltekit project to keep
		things clean and easy in the file tree. If you need to do modifications to any of this config
		files you can tap on the little <ConfigFiles /> button at the root of the file tree.
	</p>
	<svelte:fragment slot="dialog-actions">
		<button on:click={() => ($tips_store.no_config = false)}>Don't show me this again</button>
		<button class="primary" on:click={() => (isTipOpen = false)}>Got it</button>
	</svelte:fragment>
</Dialog>

<style>
	h1 {
		font-size: 2rem;
		display: flex;
		gap: 1rem;
		color: var(--sk-theme-1);
		font-weight: bold;
	}
	.primary {
		color: var(--sk-theme-1);
	}
</style>
