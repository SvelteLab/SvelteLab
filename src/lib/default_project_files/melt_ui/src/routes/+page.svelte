<script>
	import { Collapsible } from '$lib/index.js';

	let { data } = $props();
</script>

<h1>
	Hello {data.name}!
</h1>

<Collapsible />

<p>Head over to the <code>src/lib</code> folder to start crafting!</p>
