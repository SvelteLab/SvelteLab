<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import '../../../styles/global.css';
	import Booting from '~icons/line-md/loading-alt-loop';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		//this is to interact with the filesistem
		//from the console...we can remove it later
		(window as any).wc = webcontainer;
	});
</script>

{#await webcontainer.init(data.repl)}
	<div class="loader">
		<Booting />
		<span> Booting up webcontainer... </span>
	</div>
{:then}
	<slot />
{/await}
