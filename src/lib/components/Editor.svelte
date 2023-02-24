<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
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
		background-color: #111;
		color: #eee;
		resize: none;
	}
</style>
