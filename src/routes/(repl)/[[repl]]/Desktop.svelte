<script lang="ts">
	import FileActions from '$lib/components/FileActions.svelte';
	import Iframe from '$lib/components/Iframe.svelte';
	import { is_intro_open } from '$lib/stores/intro_store';
	import { layout_store } from '$lib/stores/layout_store';
	import type { ComponentType, SvelteComponentTyped } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Intro from '../Intro.svelte';
	import Header from './Header.svelte';

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export let Console: ComponentType<SvelteComponentTyped>;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export let Editor: ComponentType<SvelteComponentTyped>;

	function handle_pane() {
		if (update_height) update_height();
	}

	$: {
		$layout_store.terminal;
		handle_pane();
	}

	let update_height: () => void;

	const min_size = 5;
</script>

<div class="grid">
	<Header />
	<main id="main">
		<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
			<Pane minSize={min_size}>
				<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
					<Pane bind:size={$layout_store.file_tree}><FileActions {min_size} /></Pane>
					<Pane minSize={min_size}>
						<Splitpanes horizontal on:ready={handle_pane} on:resized={handle_pane}>
							<Pane minSize={min_size} class="editor-pane">
								<svelte:component this={Editor} />
							</Pane>
							<Pane bind:size={$layout_store.terminal}>
								<svelte:component this={Console} bind:update_height />
							</Pane>
						</Splitpanes>
					</Pane>
				</Splitpanes>
			</Pane>
			<Pane size={42} minSize={min_size}>
				<Splitpanes horizontal>
					<Pane minSize={min_size}>
						<Iframe />
					</Pane>
					{#if $is_intro_open}
						<Pane minSize={min_size}>
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
