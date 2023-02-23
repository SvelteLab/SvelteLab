<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
</script>

<textarea
	value={$webcontainer.current_file}
	on:input={(e) => {
		webcontainer.update_file($webcontainer.current_path, e.currentTarget.value);
	}}
/>
<iframe title="content" />
