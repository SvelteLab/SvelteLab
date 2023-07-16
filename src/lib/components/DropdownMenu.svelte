<script lang="ts" context="module">
	export const DROPDOWN_CONTEXT = Symbol();
</script>

<script lang="ts">
	import { click_outside } from '$lib/click_outside';
	import { computePosition, shift } from '@floating-ui/dom';
	import { setContext } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import MoreVert from '~icons/material-symbols/more-vert';

	export let open = false;
	export let indicator = false;

	const menu_id = uuidv4();
	const trigger_id = uuidv4();

	function close_menu() {
		open = false;
	}

	setContext(DROPDOWN_CONTEXT, { close_menu });

	let button: HTMLButtonElement;
	let tooltip: HTMLDivElement;

	$: open &&
		computePosition(button, tooltip, {
			placement: 'bottom-start',
			middleware: [shift()],
		}).then(({ x, y }) => {
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`,
			});
		});
</script>

<button
	bind:this={button}
	class:indicator
	title="Open Menu"
	id={trigger_id}
	on:click={() => (open = !open)}
	aria-haspopup="true"
	aria-expanded={open}
	aria-controls={menu_id}
>
	<slot name="trigger">
		<MoreVert />
	</slot>
</button>
<section use:click_outside={{ enabled: open, func: close_menu }}>
	<div aria-hidden={!open} class:open class="wrap" bind:this={tooltip}>
		<ul id={menu_id} role="menu" aria-labelledby={trigger_id}>
			<slot />
		</ul>
	</div>
</section>

<style>
	section {
		display: contents;
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
		display: grid;
		width: max-content;
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

	button:hover {
		color: var(--sk-text-1);
	}

	ul {
		margin: 0;
	}
	ul > :last-child {
		border-bottom-left-radius: 0.5em;
		border-bottom-right-radius: 0.5em;
		overflow: hidden;
	}
	/* to avoid keyboard focus into the ul */
	.wrap:not(.open) > ul {
		display: none;
	}
</style>
