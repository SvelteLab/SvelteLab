<script lang="ts">
	import FileActions from '$lib/components/FileActions.svelte';
	import Iframe from '$lib/components/Iframe.svelte';
	import { is_intro_open } from '$lib/stores/intro_store';
	import { layout_store } from '$lib/stores/layout_store';
	import type { ComponentType, SvelteComponentTyped } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Intro from '../Intro.svelte';
	import Header from './Header.svelte';

	export let Console: ComponentType<SvelteComponentTyped>;
	export let Editor: ComponentType<SvelteComponentTyped>;

	function handle_pane() {
		if (update_height) update_height();
	}

	$: {
		$layout_store.terminal;
		handle_pane();
	}

	let update_height: () => void;

	const minSize = 5;
</script>

<div class="grid">
	<Header />
	<main id="main">
		<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
			<Pane {minSize}>
				<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
					<Pane bind:size={$layout_store.file_tree}><FileActions {minSize} /></Pane>
					<Pane {minSize}>
						<Splitpanes horizontal on:ready={handle_pane} on:resized={handle_pane}>
							<Pane {minSize} class="editor-pane">
								<svelte:component this={Editor} />
							</Pane>
							<Pane bind:size={$layout_store.terminal}>
								<svelte:component this={Console} bind:update_height />
							</Pane>
						</Splitpanes>
					</Pane>
				</Splitpanes>
			</Pane>
			<Pane size={42} {minSize}>
				<Splitpanes horizontal>
					<Pane {minSize}>
						<Iframe />
					</Pane>
					{#if $is_intro_open}
						<Pane {minSize}>
							<Intro />
						</Pane>
					{/if}
				</Splitpanes>
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
		grid-template-rows: min-content 1fr min-content;
	}
</style>
