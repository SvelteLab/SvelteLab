<script>
	import Counter from '$lib/Counter.svelte';

	let { data } = $props();
</script>

<h1 class="text-3xl font-bold text-[#ff3e00]">
	Hello {data.name}!
</h1>

<Counter />
