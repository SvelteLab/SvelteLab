<script lang="ts">
	import Console from '$lib/components/Console.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import FileActions from '$lib/components/FileActions.svelte';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Header from './Header.svelte';
	import { layout_store } from './layout_store';

	onMount(async () => {
		await webcontainer.install_dependencies();
		webcontainer.run_dev_server();
	});

	function handle_pane() {
		if (update_height) update_height();
	}

	let update_height: () => void;
</script>

<div class="grid">
	<Header />
	<Splitpanes class="main-pane" on:ready={handle_pane} on:resized={handle_pane}>
		{#if $layout_store.file_tree}
			<Pane size={20} minSize={5}><FileActions /></Pane>
		{/if}
		<Pane>
			<Splitpanes horizontal on:ready={handle_pane} on:resized={handle_pane}>
				<Pane>
					<Splitpanes>
						<Pane>
							<Editor />
						</Pane>
						<Pane>
							{#key $webcontainer.iframe_url}
								<iframe title="content" src={$webcontainer.iframe_url} />
							{/key}
						</Pane>
					</Splitpanes>
				</Pane>
				{#if $layout_store.terminal}
					<Pane><Console bind:update_height /></Pane>
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
