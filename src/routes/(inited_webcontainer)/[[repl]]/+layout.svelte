<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import Booting from '~icons/line-md/loading-alt-loop';
	import type { LayoutData } from './$types';
	import { beforeNavigate } from '$app/navigation';
	import { save_repl } from '$lib/api/client/repls';
	import { repl_id, repl_name } from '$lib/stores/repl_id_store';
	import { error } from '$lib/toast';

	export let data: LayoutData;

	// keep the repl stores up to date in case data changes
	$: repl_id.set(data.id);
	$: repl_name.set(data.repl_name);

	onMount(() => {
		//this is to interact with the filesistem
		//from the console...we can remove it later
		(window as any).wc = webcontainer;
	});

	beforeNavigate(() => {
		$webcontainer.running_process?.kill?.();
	});
</script>

<svelte:window
	on:keydown={async (e) => {
		if (e.code === 'KeyS' && e.ctrlKey) {
			e.preventDefault();
			if (data.user) {
				await save_repl();
			} else {
				error('It seems you are trying to save. Login to save your project.');
			}
		}
	}}
/>
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
