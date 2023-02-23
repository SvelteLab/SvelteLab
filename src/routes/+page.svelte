<script lang="ts">
	import { webcontainer, logs } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	onMount(async () => {
		debugger;
		// await webcontainer.install_dependencies();
		// webcontainer.run_dev_server();
	});
</script>

test

<!-- <textarea
	value={$webcontainer.current_file}
	on:input={(e) => {
		webcontainer.update_file($webcontainer.current_path, e.currentTarget.value);
	}}
/>
<iframe title="content" src={$webcontainer.iframe_url} />
{#each $logs as log}
	<div>{log}</div>
{/each} -->
