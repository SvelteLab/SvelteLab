<script lang="ts">
	import FileActions from '$lib/components/FileActions.svelte';
	import PlaceholderComponent from '$lib/components/PlaceholderComponent.svelte';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { layout_store } from '$lib/stores/layout_store';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Header from './Header.svelte';

	let Console: ConstructorOfATypedSvelteComponent = PlaceholderComponent;
	let Editor: ConstructorOfATypedSvelteComponent = VoidEditor;

	onMount(async () => {
		Console = (await import('$lib/components/Console.svelte')).default;
		Editor = (await import('$lib/components/Editor.svelte')).default;
		return webcontainer.on_init(async () => {
			await webcontainer.install_dependencies();
			webcontainer.run_dev_server();
		});
	});

	function handle_pane() {
		if (update_height) update_height();
	}

	let update_height: () => void;

	const minSize = 5;
</script>

<div class="grid">
	<Header />
	<Splitpanes class="main-pane" on:ready={handle_pane} on:resized={handle_pane}>
		{#if $layout_store.file_tree}
			<Pane size={20} {minSize}><FileActions {minSize} /></Pane>
		{/if}
		<Pane>
			<Splitpanes horizontal on:ready={handle_pane} on:resized={handle_pane}>
				<Pane {minSize}>
					<Splitpanes>
						<Pane {minSize}>
							<svelte:component this={Editor} />
						</Pane>
						<Pane {minSize}>
							{#key $webcontainer.iframe_url}
								<iframe title="content" src={$webcontainer.iframe_url} />
							{/key}
						</Pane>
					</Splitpanes>
				</Pane>
				{#if $layout_store.terminal}
					<Pane size={30} {minSize}>
						<svelte:component this={Console} bind:update_height />
					</Pane>
				{/if}
			</Splitpanes>
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
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
