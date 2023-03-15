<script>
	import { get_icon } from '$lib/file_icons';
	import { close_all_tabs, close_file, current_tab, open_file, tabs } from '$lib/tabs';
	import { onMount } from 'svelte';
	import Close from '~icons/material-symbols/close-rounded';

	onMount(() => () => {
		//close the tabs when we unmount the component
		close_all_tabs();
	});
</script>

<section>
	{#each [...$tabs] as path}
		{@const file_name = path.split('/').at(-1)}
		<article aria-selected={path === $current_tab}>
			<button
				on:click={() => {
					open_file(path);
				}}
				on:auxclick={() => {
					close_file(path);
				}}
			>
				<svelte:component this={get_icon(file_name || '')} />
				{file_name}
			</button>
			<button
				on:click={() => {
					close_file(path);
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
		background-color: var(--sk-back-1);
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
