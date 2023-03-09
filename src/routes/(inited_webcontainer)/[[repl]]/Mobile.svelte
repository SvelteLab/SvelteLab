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
		<div hidden={showing !== 'code' && showing !== 'files'}>
			<Dialog
				isOpen={showing === 'files'}
				on:dismiss={() => (showing = 'code')}
				noCloseButton
				includedTrigger={false}
				dialogIn={fly}
				dialogOut={fly}
				dialogInOptions={{ x: -500 }}
				dialogOutOptions={{ x: -500 }}
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
		max-width: 100vw;
	}
</style>
