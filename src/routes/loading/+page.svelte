<script>
	import '@sveltejs/site-kit/styles/index.css';
	import InstallDeps from '~icons/line-md/downloading-loop';
</script>

<div class="loader">
	<InstallDeps />
	<span> Installing dependencies... </span>
</div>

<style>
	:global(body) {
		padding: 0.75em;
	}
</style>
