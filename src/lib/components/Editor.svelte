<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';

	onMount(() => {
		// hack to show LS file
		webcontainer.open_file('/src/routes/+page.svelte');
	});
</script>

<textarea
	value={$webcontainer.current_file}
	on:input={(e) => {
		webcontainer.update_file($webcontainer.current_path, e.currentTarget.value);
	}}
/>

<style>
	textarea {
		width: 100%;
		height: 100%;
		background-color: var(--sk-back-1);
		color: var(--sk-code-base);
		border: none;
		resize: none;
		padding: 0.75em;
	}
</style>
