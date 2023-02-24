<script lang="ts">
	import { UNICODE_CONSOLE_CONTROLS } from '$lib/utils/regex';
	import { logs } from '$lib/webcontainer';
	import Convert from 'ansi-to-html';
	import DOMPurify from 'dompurify';
	import { tick } from 'svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import { onMount } from 'svelte';

	const convert = new Convert();
	const VOID_LINES = 3;
	let ul: HTMLUListElement;
	let height = 300;

	$: filteredLogs = $logs.filter((log) => !UNICODE_CONSOLE_CONTROLS.test(log) && log.trim());

	export const update_height = () => {
		height = ul ? +getComputedStyle(ul).height.replace('px', '') : 0;
	};

	onMount(async () => {
		await tick();
		update_height();
	});
</script>

<ul bind:this={ul}>
	<VirtualList
		itemSize={25}
		width="100%"
		{height}
		itemCount={filteredLogs.length + VOID_LINES}
		scrollDirection="vertical"
		scrollToAlignment="end"
		scrollToIndex={filteredLogs.length + VOID_LINES - 1}
	>
		<li slot="item" let:index let:style {style}>
			{#if filteredLogs[index]}
				{@html DOMPurify.sanitize(convert.toHtml(filteredLogs[index]))}
			{:else}
				&nbsp;
			{/if}
		</li>
	</VirtualList>
</ul>

<style>
	ul {
		grid-column: 1/-1;
		overflow: hidden;
		width: 100%;
		height: 100%;
		background-color: #222;
		color: #eee;
		margin: 0;
		font-family: monospace;
		list-style: none;
		overflow: hidden;
		height: 100%;
	}
	li {
		padding: 0.3rem 1rem;
	}
</style>
