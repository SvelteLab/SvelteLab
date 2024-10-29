<script>
	import { Counter } from '$lib';

	let { data } = $props();
</script>

<h1>
	Hello {data.name}!
</h1>

<Counter />

<p>Head over to the <code>src/lib</code> folder to start crafting!</p>
