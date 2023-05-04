<script lang="ts" context="module">
	export const DROPDOWN_CONTEXT = Symbol();
</script>

<script lang="ts">
	import { clickOutside } from 'as-comps';
	import { setContext } from 'svelte';
	import MoreVert from '~icons/material-symbols/more-vert';

	export let open = false;
	export let indicator = false;

	function close_menu() {
		open = false;
	}

	setContext(DROPDOWN_CONTEXT, { close_menu });
</script>

<section class:indicator use:clickOutside={{ enabled: open, func: close_menu }}>
	<button title="Open Menu" on:click={() => (open = !open)}>
		<slot name="trigger">
			<MoreVert />
		</slot>
	</button>
	<div aria-hidden={!open} class:open class="wrap">
		<ul>
			<slot />
		</ul>
	</div>
</section>

<style>
	section {
		display: flex;
		align-items: center;
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
		top: 100%;
		right: 0%;
		display: grid;
		grid-template-rows: minmax(0, var(--open, 0fr));
		overflow: hidden;
		transition: grid-template-rows 250ms;
		border-top-right-radius: 0;
		min-width: 10rem;
		border: 1px solid transparent;
		z-index: 999;
		pointer-events: none;
		border-bottom-left-radius: 0.5em;
		border-bottom-right-radius: 0.5em;
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

	ul {
		margin: 0;
	}
	ul > :last-child {
		border-bottom-left-radius: 0.5em;
		border-bottom-right-radius: 0.5em;
		overflow: hidden;
	}
</style>
