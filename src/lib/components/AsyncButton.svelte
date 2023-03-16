<script lang="ts">
	import Pending from '~icons/eos-icons/loading';
	import type { HTMLButtonAttributes } from 'svelte/elements';

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
	class={badged ? 'badged' : undefined}
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
		font-size: 1.25em;
		display: grid;
		place-items: center;
		position: relative;
		padding-block: 0.25rem;
		position: relative;
	}
	.badged::after {
		content: '';
		position: absolute;
		inset: 0;
		top: auto;
		height: 0.25rem;
		background-color: var(--sk-theme-1);
	}
</style>
