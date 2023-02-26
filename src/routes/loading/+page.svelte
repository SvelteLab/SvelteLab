<script>
	import '../../styles/global.css';
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

	/* todo: undupe these styles */
	.loader {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 3em;
	}
	.loader span {
		font-size: 1em;
	}
</style>
