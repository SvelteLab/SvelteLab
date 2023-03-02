<script lang="ts">
	import { fitAddon, terminal } from '$lib/terminal';
	import { onMount } from 'svelte';

	let div: HTMLDivElement;

	onMount(() => {
		terminal.open(div);
		setTimeout(() => {
			update_height();
		}, 300);
	});

	export const update_height = () => {
		fitAddon.fit();
	};
</script>

<div bind:this={div} />

<style>
	div {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	div :global(.xterm) {
		height: 100%;
	}
</style>
