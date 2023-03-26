<script lang="ts">
	import FileActions from '$lib/components/FileActions.svelte';
	import Iframe from '$lib/components/Iframe.svelte';
	import { layout_store } from '$lib/stores/layout_store';
	import type { ComponentType, SvelteComponentTyped } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Header from './Header.svelte';

	export let Console: ComponentType<SvelteComponentTyped>;
	export let Editor: ComponentType<SvelteComponentTyped>;

	function handle_pane() {
		if (update_height) update_height();
	}

	let update_height: () => void;

	const minSize = 5;
</script>

<div class="grid">
	<Header />
	<main id="main">
		<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
			<Pane>
				<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
					{#if $layout_store.file_tree}
						<Pane size={30} {minSize}><FileActions {minSize} /></Pane>
					{/if}
					<Pane>
						<Splitpanes horizontal on:ready={handle_pane} on:resized={handle_pane}>
							<Pane {minSize} class="editor-pane">
								<svelte:component this={Editor} />
							</Pane>
							{#if $layout_store.terminal}
								<Pane size={30} {minSize}>
									<svelte:component this={Console} bind:update_height />
								</Pane>
							{/if}
						</Splitpanes>
					</Pane>
				</Splitpanes>
			</Pane>
			<Pane size={42} {minSize}>
				<Iframe />
			</Pane>
		</Splitpanes>
	</main>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		height: 100%;
	}
	:global(.editor-pane) {
		position: relative;
		display: grid;
		grid-template-rows: min-content 1fr;
	}
</style>
