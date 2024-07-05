<script lang="ts">
	import { layout_store } from '$lib/stores/layout_store';
	import { fit_addon, terminal } from '$lib/terminal';
	import { onMount } from 'svelte';

	let div: HTMLDivElement;

	onMount(() => {
		terminal.open(div);
		setTimeout(() => {
			update_height();
		}, 300);
	});

	export const update_height = () => {
		fit_addon.fit();
	};

	$: {
		$layout_store.terminal;
		setTimeout(() => {
			update_height();
		}, 300);
	}
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
