<script lang="ts">
	import FileActions from '$lib/components/FileActions.svelte';
	import Iframe from '$lib/components/Iframe.svelte';
	import { Dialog } from 'as-comps';
	import { SvelteComponentTyped, tick, type ComponentType } from 'svelte';
	import { fly } from 'svelte/transition';
	import Header from './Header.svelte';
	import MobileFooter from './MobileFooter.svelte';

	export let Console: ComponentType<SvelteComponentTyped>;
	export let Editor: ComponentType<SvelteComponentTyped>;

	let showing: 'code' | 'iframe' | 'terminal' = 'code';
	let showing_files = false;

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
		<Dialog
			bind:isOpen={showing_files}
			noCloseButton
			includedTrigger={false}
			dialogIn={fly}
			dialogOut={fly}
			dialogInOptions={{ x: -500 }}
			dialogOutOptions={{ x: -500 }}
			autofocus={false}
			--as-dialog-padding="0"
			--as-dialog-top="calc(50% + 3.8rem)"
			--as-dialog-left="0"
			--as-dialog-right="auto"
			--as-dialog-transform="translateY(-50%)"
			--as-dialog-border-radius="0"
			--as-dialog-width="calc(100% - 4em)"
			--as-dialog-max-width="800px"
			--as-dialog-height="100%"
			--as-dialog-max-height="calc(100% - 2em)"
		>
			<FileActions />
		</Dialog>
		<div class="editor" class:hidden={showing !== 'code'}>
			<svelte:component this={Editor} />
		</div>
		<div class:hidden={showing !== 'iframe'}>
			<Iframe />
		</div>
		<div class:hidden={showing !== 'terminal'}>
			<svelte:component this={Console} bind:update_height />
		</div>
	</main>
	<MobileFooter bind:showing bind:showing_files />
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
		max-width: 100vw;
	}
	.editor {
		display: grid;
		grid-template-rows: min-content 1fr;
		position: relative;
	}
	.hidden {
		display: none;
	}
</style>
