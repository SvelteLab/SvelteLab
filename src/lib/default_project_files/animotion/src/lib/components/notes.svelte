<script>
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<aside class="notes">
	{@render children?.()}
</aside>
