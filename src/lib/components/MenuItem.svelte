<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { DROPDOWN_CONTEXT } from './DropdownMenu.svelte';

	interface $$Props extends HTMLButtonAttributes {
		href?: string;
	}
	export let href: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	const { close_menu } = getContext<{ close_menu: () => void }>(DROPDOWN_CONTEXT);

	function handle_click(e: MouseEvent) {
		close_menu();
		dispatch('click', e);
	}
</script>

<li role="menuitem" class="menuitem">
	<svelte:element
		this={href ? 'a' : 'button'}
		{href}
		class="item"
		{...$$restProps}
		on:click={handle_click}
	>
		<slot />
	</svelte:element>
</li>

<style>
	.menuitem {
		list-style: none;
	}
	.item {
		display: flex;
		align-items: center;
		white-space: nowrap;
		font-weight: 400 !important;
		width: 100%;
		padding: 0.5rem 1rem;
		gap: 1rem;
		background-color: var(--sk-back-2);
		color: var(--sk-text-1);
		outline-offset: -0.25rem;
	}

	.item:hover {
		background-color: var(--sk-back-3);
	}

	.item:active {
		color: var(--sk-theme-1);
	}
</style>
