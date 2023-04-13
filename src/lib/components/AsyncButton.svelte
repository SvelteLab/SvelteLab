<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Pending from '~icons/eos-icons/loading';

	export let click: (
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) => void;
	// to set the loading state from outside
	export let loading = false;
	// to set the loading state from inside
	let is_loading = false;

	export let badged = false;

	type $$Props = HTMLButtonAttributes & {
		click: (
			event: MouseEvent & {
				currentTarget: EventTarget & HTMLButtonElement;
			}
		) => void;
		loading?: boolean;
		badged?: boolean;
	};
</script>

<button
	class:badged
	on:click={async (e) => {
		is_loading = true;
		await click(e);
		is_loading = false;
	}}
	{...$$props}
>
	{#if loading || is_loading}
		<Pending />
	{:else}
		<slot />
	{/if}
</button>

<style>
	button {
		gap: 1rem;
		display: flex;
		align-items: center;
		position: relative;
		padding: 0.5rem;
		color: var(--sk-text-1);
		position: relative;
		flex-shrink: 0;
	}

	button :global(svg) {
		font-size: 1.25em;
	}

	.badged::after {
		content: '';
		position: absolute;
		right: 0;
		height: 0.75rem;
		aspect-ratio: 1;
		top: 0;
		background-color: var(--sk-theme-1);
		border-radius: 50%;
	}
</style>
