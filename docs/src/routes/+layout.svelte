<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { clickOutside } from 'as-comps';
	import '../styles/global.css';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';

	export let data: LayoutData;
	let open = false;

	$: {
		$page.url;
		// reset the menu when page change
		// (using this insteas of aftyerNavigate to also trigger on hash change)
		open = false;
	}

	afterNavigate(() => {
		document.querySelector('main')?.scrollTo(0, 0);
	});
</script>

<div class="container" class:open>
	<Header
		on:open={() => {
			open = !open;
		}}
	/>
	<nav
		use:clickOutside={{
			enabled: open,
			func() {
				open = false;
			}
		}}
	>
		<ul>
			{#each data.pages as doc (doc.link)}
				{@const current = $page.url.pathname.includes(doc.link)}
				<li aria-current={current}><a href={doc.link}>{doc.metadata?.title ?? doc.link}</a></li>
				{#if current}
					<ul>
						{#each doc.metadata?.headings?.slice(1) ?? [] as heading}
							<li style:margin-inline-start="{heading.level - 2}em">
								<a href="{doc.link}{heading.url}">{heading.title}</a>
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		</ul>
	</nav>
	<main>
		<article>
			<slot />
		</article>
	</main>
</div>

<style>
	.container {
		--open: 20%;
		display: grid;
		grid-template-areas: 'header header' 'nav content';
		grid-template-columns: var(--open) 1fr;
		grid-template-rows: min-content 1fr;
		height: 100%;
		transition: grid-template-columns 250ms;
		overflow: hidden;
	}
	.container :global(header) {
		grid-area: header;
	}
	nav {
		grid-area: nav;
		background-color: var(--sk-back-3);
		overflow: auto;
		position: relative;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	ul > ul {
		background-color: var(--sk-back-2);
		padding-inline-start: 1rem;
	}
	a {
		border-bottom: 1px solid var(--sk-back-4);
		padding: 1rem;
		display: block;
	}
	main {
		grid-area: content;
		padding: 1rem;
		overflow: auto;
	}
	@media (max-width: 700px) {
		.container {
			--open: 0%;
			grid-template-columns: var(--open) 100%;
		}
		.open {
			--open: 80%;
		}
		a {
			opacity: 0;
			transition: opacity 50ms;
			transition-delay: 0;
		}
		.open a {
			opacity: 1;
			transition-delay: 50ms;
		}
	}

	[aria-current='true'] {
		background-color: var(--sk-theme-1);
	}

	[aria-current='true'] a {
		font-weight: bold;
		color: #fff;
	}

	article {
		max-width: 70ch;
		margin: auto;
		margin-block-start: 1rem;
	}
</style>
