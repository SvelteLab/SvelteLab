<script lang="ts">
	import { logs } from '$lib/webcontainer';
	import Convert from 'ansi-to-html';
	const convert = new Convert();
</script>

<ul>
	{#each $logs as log}
		<li>{@html convert.toHtml(log)}</li>
	{/each}
</ul>

<style>
	ul {
		background-color: #222;
		color: #eee;
		margin: 0;
		padding: 0;
		font-family: monospace;
		list-style: none;
		scroll-snap-type: y mandatory;
		overflow: auto;
		height: 100%;
	}
	ul:hover {
		scroll-snap-type: none;
	}
	li {
		padding: 0.3rem 1rem;
	}
	li:last-child {
		scroll-snap-align: end;
		scroll-snap-stop: always;
	}
</style>
