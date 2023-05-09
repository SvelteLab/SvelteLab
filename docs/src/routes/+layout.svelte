<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import '../styles/global.css';
	import type { LayoutData } from './$types';
	import Header from './Header.svelte';
	import { clickOutside } from 'as-comps';

	export let data: LayoutData;
	let open = false;

	afterNavigate(() => {
		open = false;
	});
</script>

<main class:open>
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
		--open: 20%;
		display: grid;
		grid-template-areas: 'header header' 'nav content';
		grid-template-columns: var(--open) 100%;
		grid-template-rows: min-content 1fr;
		height: 100%;
		transition: grid-template-columns 250ms;
		overflow: hidden;
	}
	main :global(header) {
		grid-area: header;
	}
	nav {
		grid-area: nav;
		background-color: var(--sk-back-1);
		overflow: auto;
		position: relative;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a {
		border-bottom: 1px solid var(--sk-back-4);
		padding: 1rem;
		display: block;
	}
	section {
		grid-area: content;
		padding: 1rem;
		overflow: auto;
	}
	@media (max-width: 700px) {
		main {
			--open: 0%;
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
</style>
