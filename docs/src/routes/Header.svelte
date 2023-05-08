<script lang="ts">
	import LogoLong from '$lib/components/LogoLong.svelte';
	import GitHub from '$lib/components/Github.svelte';
</script>

<header>
	<a href="https://sveltelab.dev" class="logo"><LogoLong /></a>
	<a href="https://github.com/sveltelab/sveltelab"><GitHub /></a>
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
</style>
