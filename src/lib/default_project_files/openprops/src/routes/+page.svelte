<script>
	import Counter from '$lib/Counter.svelte';

	export let data;
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
