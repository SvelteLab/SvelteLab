<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import GitHub from '~icons/mdi/github';
	import Discord from '~icons/mdi/discord';
	import Hamburger from '~icons/mdi/menu';
	import { createEventDispatcher } from 'svelte';
	import Docs from '~icons/material-symbols/docs';

	const dispatcher = createEventDispatcher();
</script>

<header>
	<button
		on:click={() => {
			dispatcher('open');
		}}
		class="open-menu"><Hamburger /></button
	>
	<a href="/" class="logo"><Logo /><Docs /> SvelteLab Docs</a>
	<a href="https://github.com/sveltelab/sveltelab"><GitHub /></a>
	<a href="https://discord.gg/avJNXb8Myp"><Discord /></a>
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
		font-size: 2.5rem;
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

	a:hover {
		color: var(--sk-theme-1);
	}

	.logo {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		margin-right: auto;
	}

	.logo :global(svg) {
		color: var(--sk-theme-1);
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
