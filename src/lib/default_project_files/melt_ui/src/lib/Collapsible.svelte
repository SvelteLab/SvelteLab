<script>
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		forceVisible: true
	});
</script>

<div use:melt={$root} class="root">
	<button use:melt={$trigger}>
		<span aria-hidden="true" class="arrow">⤵︎</span>
		{$open ? 'Close' : 'Open'}</button
	>
	{#if $open}
		<div use:melt={$content} transition:slide>
			Check out the docs at <a href="https://www.melt-ui.com/">melt-ui.com</a>!
		</div>
	{/if}
</div>

<style>
	.arrow {
		display: inline-block;
	}
	button[data-state='open'] .arrow {
		rotate: -180deg;
	}
</style>
