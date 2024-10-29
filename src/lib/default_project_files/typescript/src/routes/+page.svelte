<script lang="ts">
	import Counter from '$lib/Counter.svelte';

	let { data } = $props();
</script>

<h1>Hello {data.name}!</h1>

<Counter />
