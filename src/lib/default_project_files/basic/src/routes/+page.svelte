<script>
	import Counter from '$lib/Counter.svelte';

	let { data } = $props();
</script>

<h1>
	Hello {data.name}!
</h1>

<Counter />

<p>
	Learn about setting up a new default template like Typescript or Tailwind at
	<a href="https://docs.sveltelab.dev/templates" target="_blank"> docs.sveltelab.dev/templates </a>
</p>
