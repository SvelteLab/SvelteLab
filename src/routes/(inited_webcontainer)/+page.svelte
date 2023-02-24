<script lang="ts">
	import Console from '$lib/components/Console.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';

	onMount(async () => {
		await webcontainer.install_dependencies();
		webcontainer.run_dev_server();
	});

	function handle_pane() {
		update_height();
	}

	let update_height: () => void;
</script>

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
	<Pane><Console bind:update_height /></Pane>
</Splitpanes>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
