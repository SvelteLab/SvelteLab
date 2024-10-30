<script>
	import Counter from '$lib/Counter.svelte';

	let { data } = $props();
</script>

<h1>
	Hello {data.name}!
</h1>

<Counter />

<style lang="postcss">
	h1 {
		color: var(--indigo-8);
	}
</style>
