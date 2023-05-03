<script lang="ts">
	export let open: boolean;
</script>

<div>
	<slot />
	<div class:open id="wrap">
		<slot name="menu" />
	</div>
</div>

<style>
	div {
		position: relative;
	}
	#wrap {
		position: absolute;
		top: 50%;
		right: 50%;
		display: grid;
		grid-template-rows: minmax(0, var(--open, 0fr));
		overflow: hidden;
		transition: grid-template-rows 250ms;
		border-top-right-radius: 0;
		min-width: 10rem;
		border: 1px solid transparent;
		z-index: 999;
		box-shadow: 0 0 1rem 0 rgb(0 0 0 / 0.2);
		pointer-events: none;
	}
	.open {
		--open: 1fr;
		pointer-events: auto !important;
	}
</style>
