<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import Booting from '~icons/line-md/loading-alt-loop';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		//this is to interact with the filesistem
		//from the console...we can remove it later
		(window as any).wc = webcontainer;
	});
</script>

<slot />
{#await webcontainer.init(data.repl)}
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
		backdrop-filter: blur(10px);
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
