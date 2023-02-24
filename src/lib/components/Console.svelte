<script lang="ts">
	import { logs } from '$lib/webcontainer';
	import { UNICODE_CONSOLE_CONTROLS } from '$lib/utils/regex';
	import VirtualList from 'svelte-tiny-virtual-list';
	import Convert from 'ansi-to-html';
	import DOMPurify from 'dompurify';
	const convert = new Convert();
	const VOID_LINES = 3;
	let ul: HTMLUListElement;
	$: height = ul ? +getComputedStyle(ul).height.replace('px', '') : 0;
	$: filteredLogs = $logs.filter((log) => !UNICODE_CONSOLE_CONTROLS.test(log) && log.trim());
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
