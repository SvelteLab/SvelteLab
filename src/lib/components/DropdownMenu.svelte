<script lang="ts">
	import { clickOutside } from 'as-comps';

	export let open: boolean;
	export let indicator = false;
</script>

<div class:indicator use:clickOutside={{ enabled: open, func: () => (open = false) }}>
	<slot />
	<div aria-hidden={!open} class:open id="wrap">
		<slot name="menu" />
	</div>
</div>

<style>
	div {
		position: relative;
	}
	.indicator::after {
		content: '▾';
		position: absolute;
		bottom: -0.5rem;
		right: -0.5rem;
		font-family: monospace;
		font-size: 1rem;
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
		pointer-events: none;
	}
	.open {
		--open: 1fr;
		pointer-events: auto !important;
		box-shadow: 0 0 1rem 0 rgb(0 0 0 / 0.2);
	}
</style>
