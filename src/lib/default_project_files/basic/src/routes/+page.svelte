<script>
	import Counter from '$lib/Counter.svelte';

	export let data;
</script>

<h1>
	Hello {data.name}!
</h1>

<Counter />

<p>
	Learn more about templates at
	<a href="https://docs.sveltelab.dev/templates" target="_blank"> docs.sveltelab.dev/templates </a>
</p>
