<script lang="ts">
	import type { Tree } from '$lib/workers/search';
	import { get_search_docs } from '$lib/workers/search-docs';
	import { onMount } from 'svelte';
	import SearchResults from './SearchResults.svelte';

	let docs_query = '';
	let docs_search_results = [] as Tree[];

	let search_input: HTMLInputElement;

	let search_docs: Awaited<ReturnType<typeof get_search_docs>>;

	onMount(async () => {
		search_docs = await get_search_docs();
		setTimeout(() => {
			search_input.focus();
		}, 100);
	});

	async function do_the_search(docs_query: string) {
		docs_search_results = (await search_docs?.(docs_query)) ?? [];
	}

	$: do_the_search(docs_query);
</script>

<section class="search">
	<!-- svelte-ignore a11y-autofocus -->
	<input
		bind:this={search_input}
		class="action-field"
		placeholder="Search SvelteKit Documentation..."
		disabled={!search_docs}
		bind:value={docs_query}
		type="search"
	/>
	<aside>
		<SearchResults results={docs_search_results} query={docs_query} />
	</aside>
</section>

<style>
	.search {
		flex-grow: 1;
		position: relative;
		--max-width: 60rem;
		margin: 2rem;
	}

	input {
		margin-bottom: 1rem;
	}

	aside {
		margin: 0;
		height: 30vh;
		overflow-y: auto;
		width: 100%;
		z-index: 100;
		position: relative;
	}
</style>
