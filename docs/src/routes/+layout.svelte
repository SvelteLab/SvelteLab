<script lang="ts">
	import '../styles/global.css';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';

	export let data: LayoutData;
</script>

<main>
	<Header />
	<nav>
		<ul>
			{#each data.pages as page (page.link)}
				<li><a href={page.link}>{page.metadata?.title ?? page.link}</a></li>
			{/each}
		</ul>
	</nav>
	<section>
		<slot />
	</section>
</main>

<style>
	main {
		display: grid;
		grid-template-areas: 'header header header' 'nav content content';
		grid-template-columns: 20% auto auto;
		grid-template-rows: min-content 1fr;
		height: 100%;
	}
	main :global(header) {
		grid-area: header;
	}
	nav {
		grid-area: nav;
		background-color: var(--sk-back-1);
		padding: 1rem;
		overflow: auto;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	section {
		grid-area: content;
		padding: 1rem;
		overflow: auto;
	}
</style>
