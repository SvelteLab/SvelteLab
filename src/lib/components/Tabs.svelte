<script context="module" lang="ts">
	import { get_icon } from '$lib/file_icons';
	import { writable } from 'svelte/store';

	const open_paths = writable(new Set<string>());

	const { subscribe: subscribe_current_file, set: set_current_file } = writable('');
	export const current_file = { subscribe: subscribe_current_file };

	export function open_file(path: string) {
		set_current_file(path);
		open_paths.update(($tabs) => $tabs.add(path));
	}
</script>

<script>
	import Close from '~icons/material-symbols/close-rounded';
</script>

<section>
	{#each [...$open_paths] as path}
		{@const file_name = path.split('/').at(-1)}
		<article aria-selected={path === $current_file}>
			<button on:click={() => set_current_file(path)}>
				<svelte:component this={get_icon(file_name || '')} />
				{file_name}
			</button>
			<button
				on:click={() => {
					//
				}}
			>
				<Close />
			</button>
		</article>
	{/each}
</section>

<style>
	section {
		display: flex;
		max-width: 100%;
		overflow-x: auto;
	}
	article {
		padding: 0.5em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
	}
	button {
		display: flex;
		align-items: center;
		gap: 0.5em;
		width: max-content;
	}
	article[aria-selected='true']::after {
		content: '';
		position: absolute;
		background-color: var(--sk-theme-1);
		right: 1px;
		left: 1px;
		bottom: 0;
		top: calc(100% - 3px);
	}
</style>
