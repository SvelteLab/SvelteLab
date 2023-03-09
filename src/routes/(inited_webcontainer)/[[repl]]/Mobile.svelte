<script lang="ts">
	import Console from '$lib/components/Console.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import FileActions from '$lib/components/FileActions.svelte';
	import Iframe from '$lib/components/Iframe.svelte';
	import { tick } from 'svelte';
	import Header from './Header.svelte';
	import MobileFooter from './MobileFooter.svelte';
	export let showing: 'files' | 'code' | 'iframe' | 'terminal' = 'code';

	let update_height: () => void;

	$: handle_showing_change(showing);

	async function handle_showing_change(_: typeof showing) {
		await tick();
		if (update_height) update_height();
	}
</script>

<div class="container">
	<Header mobile />
	<main>
		<div hidden={showing !== 'files'}>
			<FileActions />
		</div>
		<div hidden={showing !== 'code'}>
			<Editor />
		</div>
		<div hidden={showing !== 'iframe'}>
			<Iframe />
		</div>
		<div hidden={showing !== 'terminal'}>
			<Console bind:update_height />
		</div>
	</main>
	<MobileFooter bind:showing />
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		height: 100%;
	}

	main,
	div {
		width: 100%;
		height: 100%;
	}
</style>
