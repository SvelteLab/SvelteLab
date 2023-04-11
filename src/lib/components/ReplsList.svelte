<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { CategorizedRepl } from '$lib/schemas';
	import { layout_store } from '$lib/stores/layout_store';
	import { closed_categories_store } from '$lib/stores/closed_categories_store';
	import { flip } from 'svelte/animate';
	import Refresh from '~icons/material-symbols/refresh-rounded';
	import { showing_repls_list } from '$lib/stores/mobile_showing_store';

	let search = '';
	let width: number;

	let categorized_repls: Promise<CategorizedRepl[]>;
	$: ({ categorized_repls } = $page.data.promises ?? {});

	function handle_refresh() {
		invalidate('user:repls');
		// to trigger the loading state
		categorized_repls = new Promise<CategorizedRepl[]>(() => {});
	}

	function get_folders_obj(repls: CategorizedRepl[], search: string) {
		const retval = {} as Record<string, CategorizedRepl[]>;
		for (const repl of repls.filter((repl) =>
			repl.name.toLowerCase().includes(search.toLowerCase())
		)) {
			const key = repl.category;
			if (!retval[key]) {
				retval[key] = [];
			}
			retval[key].push(repl);
		}
		return retval;
	}
</script>

<svelte:window bind:innerWidth={width} />

<aside
	class:hidden={width < 500
		? !$showing_repls_list
		: !($layout_store.apps && $layout_store.apps > 0)}
>
	<input placeholder="🔍 search you repls..." bind:value={search} />
	<button class="refresh" title="Refresh" on:click={handle_refresh}><Refresh /> refresh</button>
	{#await categorized_repls}
		Loading...
	{:then repls}
		{@const folders_obj = get_folders_obj(repls, search)}
		{@const folders = Object.keys(folders_obj)}
		{#each folders as folder (folder)}
			<ul>
				<li>
					<strong>
						<button
							on:click={() => {
								closed_categories_store.toggle(folder);
							}}>{folder || 'Uncategorized'}</button
						>
					</strong>
				</li>
				<ul hidden={$closed_categories_store.includes(folder)}>
					{#each folders_obj[folder] as repl (repl.id)}
						<li title="Open {repl.name}" animate:flip>
							<a
								on:click={() => {
									$showing_repls_list = false;
								}}
								href="/{repl.id}">{repl.name}</a
							>
						</li>
					{/each}
				</ul>
			</ul>
		{/each}
	{:catch}
		Something went wrong
	{/await}
</aside>

<style>
	aside {
		width: 100%;
		height: 100%;
		background-color: var(--sk-back-1);
		display: grid;
		gap: 1rem;
		align-content: start;
	}
	.hidden {
		display: none;
	}
	strong {
		font-size: 2rem;
	}
	ul {
		margin: 0;
		padding: 0 1rem;
	}
	input {
		border: none;
		color: var(--sk-text-2);
		font: inherit;
		background-color: var(--sk-back-2);
		width: 100%;
	}
	.refresh {
		display: flex;
		justify-content: center;
		width: 100%;
	}
</style>
