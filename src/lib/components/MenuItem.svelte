<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import { DROPDOWN_CONTEXT } from './DropdownMenu.svelte';

	export let href: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	const { close_menu } = getContext<{ close_menu: () => {} }>(DROPDOWN_CONTEXT);
</script>

<li role="menuitem">
	<svelte:element
		this={href ? 'a' : 'button'}
		{href}
		class="item"
		on:click={(e) => {
			close_menu();
			dispatch('click', e);
		}}
	>
		<slot />
	</svelte:element>
</li>

<style>
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
