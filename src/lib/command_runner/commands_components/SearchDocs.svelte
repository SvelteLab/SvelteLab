<script lang="ts">
	import type { Tree } from '$lib/workers/search';
	import { search_docs_worker } from '$lib/workers/search-docs';
	import { onMount } from 'svelte';
	import SearchResults from './SearchResults.svelte';

	let docs_query = '';
	let docs_search_results = [] as Tree[];
	let docs_search_ready = false;

	let search_input: HTMLInputElement;

	$: search_docs(docs_query);

	function search_docs(docs_query: string) {
		search_docs_worker.postMessage({ type: 'query', payload: docs_query });
	}

	onMount(async () => {
		search_docs_worker.postMessage({ type: 'init' });
		search_docs_worker.addEventListener('message', ({ data }) => {
			if (data.type === 'results') {
				docs_search_results = data.payload.results;
			} else if (data.type === 'ready') {
				docs_search_ready = true;
			}
		});
		setTimeout(() => {
			search_input.focus();
		}, 100);
	});
</script>

<section class="search">
	<!-- svelte-ignore a11y-autofocus -->
	<input
		bind:this={search_input}
		class="action-field"
		placeholder="🔎 search sveltekit documentation..."
		disabled={!docs_search_ready}
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
