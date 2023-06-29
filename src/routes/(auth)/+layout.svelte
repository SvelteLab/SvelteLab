<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { ICON } from '$lib/icons';

	let a_hover = false;
</script>

<header>
	<a
		href="/"
		title="New REPL"
		on:mouseenter={() => (a_hover = true)}
		on:mouseleave={() => (a_hover = false)}
	>
		<h1>
			{#if !a_hover}
				<Logo />
			{:else}
				<ICON.AddNew />
			{/if}
			SvelteLab
		</h1>
	</a>
</header>

<slot />

<style>
	header {
		--padding-y: 0.25em;
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

	a:hover {
		color: var(--sk-theme-1);
	}

	h1 {
		color: var(--sk-text-1);
		color: inherit;
		font-size: 4rem;
		font-weight: 600;
	}

	a :global(svg) {
		display: inline;
		vertical-align: sub;
	}
</style>
