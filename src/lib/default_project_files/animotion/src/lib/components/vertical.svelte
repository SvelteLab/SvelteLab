<script>
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<section>
	{@render children?.()}
</section>
