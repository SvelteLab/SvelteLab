<script>
	import '../../styles/global.css';
	import Error from '~icons/akar-icons/chat-error';
</script>

<div class="loader">
	<Error />
	<span> No page found.</span>
	<span><small> Try running a dev script... </small></span>
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
