<script lang="ts">
	import { clickOutside } from 'as-comps';
	import MoreVert from '~icons/material-symbols/more-vert';

	export let open = false;
	export let indicator = false;
</script>

<div class:indicator use:clickOutside={{ enabled: open, func: () => (open = false) }}>
	<button title="Open Menu" on:click={() => (open = !open)}>
		<slot name="trigger">
			<MoreVert />
		</slot>
	</button>
	<div aria-hidden={!open} class:open class="wrap">
		<slot />
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
	.wrap {
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
	button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border: 0;
		position: relative;
		justify-content: space-between;
		font-weight: 400 !important;
		gap: 1.5rem;
	}
</style>
