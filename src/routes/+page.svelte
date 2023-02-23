<script lang="ts">
	import { webcontainer, logs } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	onMount(async () => {
		await webcontainer.install_dependencies();
		webcontainer.run_dev_server();
	});
</script>

<textarea
	value={$webcontainer.current_file}
	on:input={(e) => {
		webcontainer.update_file($webcontainer.current_path, e.currentTarget.value);
	}}
/>
{#key $webcontainer.iframe_url}
	<iframe title="content" src={$webcontainer.iframe_url} />
{/key}
<div style="max-height: 10rem; overflow-y: auto;">
	{#each $logs as log}
		<div>{log}</div>
	{/each}
</div>
