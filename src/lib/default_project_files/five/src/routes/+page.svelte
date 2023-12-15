<script lang="ts">
	import Counter from '$lib/Counter.svelte';

	export let data;
</script>

<h1>Hello {data.name}!</h1>

<Counter count={5}/>

<small>(psst: check the lib/counter.svelte code!)</small>