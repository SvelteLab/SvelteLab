<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: metadata = data.page_info?.metadata ?? {};

	$: current_index = data.pages.findIndex((p) => p.link === data.page_info?.link);
</script>

<svelte:head>
	<title>{metadata.title} – SvelteLab Docs</title>
</svelte:head>
<svelte:component this={data.page} />

{#if current_index > -1}
	{@const prev_index = current_index - 1}
	{@const prev_page = data.pages[prev_index]}
	{@const next_index = current_index + 1}
	{@const next_page = data.pages[next_index]}
	<div class="navigation">
		{#if prev_page}
			<a href={prev_page.link}>
				<span>← Previous</span>
				{prev_page.metadata?.title}
			</a>
		{/if}
		{#if next_page}
			<a href={next_page.link} class="next">
				<span>Next →</span>
				{next_page.metadata?.title}
			</a>
		{/if}
	</div>
{/if}

<style>
	.navigation {
		border-top: 0.1rem solid var(--sk-back-5);
		margin-top: 3rem;
		padding-top: 2rem;
		display: flex;
	}

	a {
		display: grid;
		border-radius: 1rem;
		max-width: max-content;
	}

	a span {
		font-size: 1.2rem;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--sk-text-3);
	}

	.next {
		margin-inline-start: auto;
		text-align: end;
	}
</style>
