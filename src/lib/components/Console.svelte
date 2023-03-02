<script lang="ts">
	import { UNICODE_CONSOLE_CONTROLS } from '$lib/utils/regex';
	import { is_html_element } from '$lib/utils/runtime-assertions';
	import { logs } from '$lib/webcontainer';
	import Convert from 'ansi-to-html';
	import DOMPurify from 'dompurify';
	import { onMount } from 'svelte';
	import VirtualList from 'svelte-tiny-virtual-list';

	let convert = new Convert({
		fg: 'var(--sk-code-base)'
	});

	const VOID_LINES = 3;
	let ul: HTMLUListElement;
	let virtual_list: VirtualList;
	let height = 300;

	$: filteredLogs = $logs.filter((log) => !UNICODE_CONSOLE_CONTROLS.test(log) && log.trim());

	export const update_height = () => {
		height = ul ? +getComputedStyle(ul).height.replace('px', '') : 0;
	};

	const heights_map = new Map<number, number>();

	function children_height(node: Node, index: number) {
		if (!is_html_element(node)) return;
		const maybe_span = node.firstElementChild;
		if (maybe_span) {
			const actualHeight = maybe_span.getBoundingClientRect().height;
			heights_map.set(index, actualHeight);
			if (actualHeight > 25) {
				virtual_list?.recomputeSizes?.(0);
			}
		}
	}

	const cached_html = new Map<string, string>();

	function get_html(log: string) {
		if (cached_html.has(log)) return cached_html.get(log)!;
		const html = DOMPurify.sanitize(convert.toHtml(log));
		cached_html.set(log, html);
		return html;
	}

	onMount(async () => {
		setTimeout(() => {
			update_height();
		}, 200); // wait for toggle animation
	});
</script>

<ul bind:this={ul}>
	<VirtualList
		bind:this={virtual_list}
		itemSize={(index) => heights_map.get(index) ?? 25}
		width="100%"
		{height}
		itemCount={filteredLogs.length + VOID_LINES}
		scrollDirection="vertical"
		scrollToAlignment="end"
		scrollToIndex={filteredLogs.length + VOID_LINES - 1}
	>
		<li use:children_height={index} slot="item" let:index let:style {style}>
			{#if filteredLogs[index]}
				{@html get_html(filteredLogs[index])}
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
		background-color: var(--sk-back-1);
		color: var(--sk-code-base);
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
