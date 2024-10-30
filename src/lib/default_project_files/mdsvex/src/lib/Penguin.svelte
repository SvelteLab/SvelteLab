<script>
	
	
	/** @type {{walk?: boolean}} */
	let { walk = false } = $props();
</script>

<img
	alt="a penguing walking"
	src="https://mdsvex.pngwn.io/penguin{walk ? '' : '_static'}.gif"
	crossOrigin="Anonymous"
/>
