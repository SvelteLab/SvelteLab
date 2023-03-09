<script lang="ts">
	import FileActions from '$lib/components/FileActions.svelte';
	import Iframe from '$lib/components/Iframe.svelte';
	import PlaceholderComponent from '$lib/components/PlaceholderComponent.svelte';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { layout_store } from '$lib/stores/layout_store';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Header from './Header.svelte';
	import type { ComponentType, SvelteComponentTyped } from 'svelte';

	let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;
	let Editor: ComponentType<SvelteComponentTyped> = VoidEditor;

	onMount(async () => {
		const destroy = webcontainer.on_init(async () => {
			await webcontainer.install_dependencies();
			webcontainer.run_dev_server();
		});
		Console = (await import('$lib/components/Console.svelte')).default;
		Editor = (await import('$lib/components/Editor.svelte')).default;
		return destroy;
	});

	function handle_pane() {
		if (update_height) update_height();
	}

	let update_height: () => void;

	const minSize = 5;
</script>

<div class="grid">
	<Header />
	<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
		<Pane>
			<Splitpanes on:ready={handle_pane} on:resized={handle_pane}>
				{#if $layout_store.file_tree}
					<Pane size={30} {minSize}><FileActions {minSize} /></Pane>
				{/if}
				<Pane>
					<Splitpanes horizontal on:ready={handle_pane} on:resized={handle_pane}>
						<Pane {minSize}>
							<svelte:component this={Editor} />
						</Pane>
						{#if $layout_store.terminal}
							<Pane size={30} {minSize}><svelte:component this={Console} bind:update_height /></Pane
							>
						{/if}
					</Splitpanes>
				</Pane>
			</Splitpanes>
		</Pane>
		<Pane size={42} {minSize}>
			<Iframe />
		</Pane>
	</Splitpanes>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto minmax(0, 1fr);
		height: 100%;
	}
</style>
