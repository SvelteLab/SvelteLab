<script>
	import '@fontsource/mountains-of-christmas';
</script>

<slot />

<style>
	:global(body) {
		background-color: #222;
		color: #eee;
		font-family: 'Mountains of Christmas', sans-serif;
	}
	@media (prefers-color-scheme: light) {
		:global(body) {
			background-color: #eee;
			color: #222;
		}
	}
	:global(a) {
		color: inherit;
	}
</style>
