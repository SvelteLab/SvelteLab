<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { save_repl } from '$lib/api/client/repls';
	import { repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { error } from '$lib/toast';
	import { webcontainer } from '$lib/webcontainer';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Booting from '~icons/line-md/loading-alt-loop';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);

	onMount(() => {
		// for debugging
		(window as any).wc = webcontainer;
	});

	beforeNavigate(() => {
		$webcontainer.running_process?.kill?.();
	});

	async function handleKeydown(e: KeyboardEvent) {
		if (!(e.code === 'KeyS' && e.ctrlKey)) return;
		e.preventDefault();
		if (data.user) {
			await save_repl();
			return;
		}
		error('It seems you are trying to save. Login to save your project.');
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<slot />

{#await webcontainer.init(data.repl).then(() => webcontainer.mount_files(data.repl))}
	<div class="loader">
		<Booting />
		<span> Booting up webcontainer... </span>
	</div>
{/await}

<SvelteToast
	options={{
		theme: {
			'--toastBarBackground': 'var(--sk-theme-1)'
		}
	}}
/>

<style>
	div {
		position: fixed;
		inset: 0;
		backdrop-filter: blur(4px);
		z-index: 9999;
	}
	:global(:root) {
		--toastContainerBottom: 1.5rem;
		--toastContainerTop: auto;
		--toastMsgPadding: 1.5rem;
		--toastWidth: 20rem;
		--toastBackground: var(--sk-back-2);
		--toastColor: var(--sk-text-1);
	}
</style>
