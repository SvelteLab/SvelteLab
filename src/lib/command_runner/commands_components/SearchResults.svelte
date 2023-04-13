<!-- 
Copyright (c) 2019-2021 [these people](https://github.com/sveltejs/sites/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 -->
<script lang="ts">
	import type { Tree } from '$lib/workers/search';
	import { createEventDispatcher } from 'svelte';

	export let results: Tree[];

	export let query: string;

	const dispatch = createEventDispatcher();

	function escape(text: string) {
		return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function excerpt(content: string, query: string) {
		const index = content.toLowerCase().indexOf(query.toLowerCase());
		if (index === -1) {
			return escape(content.slice(0, 100));
		}

		const prefix = index > 20 ? `…${content.slice(index - 15, index)}` : content.slice(0, index);
		const suffix = content.slice(
			index + query.length,
			index + query.length + (80 - (prefix.length + query.length))
		);

		return (
			escape(prefix) +
			`<mark>${escape(content.slice(index, index + query.length))}</mark>` +
			escape(suffix)
		);
	}
</script>

{#if query === ''}
	<section class="no-results">Type something to see results...</section>
{:else}
	<ul>
		{#each results as result (result.href)}
			<li>
				<a
					href="https://kit.svelte.dev{result.href}"
					target="_blank"
					rel="noopener noreferrer"
					on:click={() => dispatch('select')}
					data-has-node={result.node ? true : undefined}
				>
					<strong>{@html excerpt(result.breadcrumbs[result.breadcrumbs.length - 1], query)}</strong>

					{#if result.node?.content}
						<span>{@html excerpt(result.node.content, query)}</span>
					{/if}
				</a>

				{#if result.children.length > 0}
					<svelte:self results={result.children} {query} on:select />
				{/if}
			</li>
		{:else}
			<li class="no-results">This query didn't produced results...</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		position: relative;
		margin: 0;
		height: 100%;
	}

	ul :global(ul) {
		margin-left: 0.8em !important;
		padding-left: 0em;
		border-left: 1px solid var(--sk-back-5);
	}

	li {
		list-style: none;
		margin-bottom: 1em;
	}

	li:last-child {
		margin-bottom: 0;
	}

	ul ul li {
		margin: 0;
	}

	a {
		display: block;
		text-decoration: none;
		line-height: 1;
		padding: 1rem;
	}

	a:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	a:focus {
		background: var(--sk-theme-2);
		color: white;
		outline: none;
	}

	a strong,
	a span {
		display: block;
		white-space: nowrap;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	a strong {
		font-size: 1.6rem;
		color: var(--sk-text-2);
	}

	a span {
		font-size: 1.2rem;
		color: #737373;
		margin: 0.4rem 0 0 0;
	}

	a :global(mark) {
		--highlight-color: rgba(255, 255, 0, 0.2);
	}

	a span :global(mark) {
		background: none;
		color: var(--sk-text-1);
		background: var(--highlight-color);
		outline: 2px solid var(--highlight-color);
		border-top: 2px solid var(--highlight-color);
		/* mix-blend-mode: darken; */
	}

	a:focus span {
		color: rgba(255, 255, 255, 0.6);
	}

	a:focus strong {
		color: white;
	}

	a:focus span :global(mark),
	a:focus strong :global(mark) {
		--highlight-color: hsl(240, 8%, 54%);
		mix-blend-mode: lighten;
		color: white;
	}

	a strong :global(mark) {
		color: var(--sk-text-1);
		background: var(--highlight-color);
		outline: 2px solid var(--highlight-color);
		/* border-top: 2px solid var(--highlight-color); */
		border-radius: 1px;
	}

	.no-results {
		position: absolute;
		inset: 0;
		display: grid;
		font-size: 2rem;
		opacity: 0.7;
		place-items: center;
	}
</style>
