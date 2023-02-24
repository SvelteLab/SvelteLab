<script lang="ts">
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import Console from '$lib/components/Console.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { webcontainer, logs } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	onMount(async () => {
		await webcontainer.install_dependencies();
		webcontainer.run_dev_server();
	});
</script>

<Splitpanes horizontal>
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
	<Pane><Console /></Pane>
</Splitpanes>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
