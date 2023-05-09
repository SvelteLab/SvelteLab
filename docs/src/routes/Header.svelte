<script lang="ts">
	import LogoLong from '$lib/components/LogoLong.svelte';
	import GitHub from '~icons/mdi/github';
	import Hamburger from '~icons/mdi/menu';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
</script>

<header>
	<button
		on:click={() => {
			dispatcher('open');
		}}
		class="open-menu"><Hamburger font-size="1.2em" /></button
	>
	<a href="https://sveltelab.dev" class="logo"><LogoLong /></a>
	<a href="https://github.com/sveltelab/sveltelab"><GitHub font-size="1.2em" /></a>
</header>

<style>
	header {
		--padding-y: 0.5em;
		padding: var(--padding-y) 1em;
		display: flex;
		gap: 1em;
		background-color: var(--sk-back-2);
		position: relative;
		z-index: 2;
		align-items: center;
		--shadow-height: 0.5rem;
		--shadow-gradient: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.1) 0%,
			rgba(0, 0, 0, 0.05) 30%,
			transparent 100%
		);
		max-width: 100vw;
	}

	header:after {
		content: '';
		position: absolute;
		width: 100%;
		height: var(--shadow-height);
		left: 0;
		bottom: calc(-1 * var(--shadow-height));
		background: var(--shadow-gradient);
	}
	a {
		color: var(--sk-text-1);
	}
	.logo {
		margin-right: auto;
	}
	.open-menu {
		display: none;
	}

	@media (max-width: 700px) {
		.open-menu {
			display: inline;
		}
	}
</style>
