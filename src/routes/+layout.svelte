<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../styles/global.css';
	import LoadingIndicator from './LoadingIndicator.svelte';
	import SvelteCompiler from '$lib/workers/svelte-compiler?worker';
	import { setContext } from 'svelte';

	const svelte_compiler = new SvelteCompiler();
	setContext('svelte-compiler', svelte_compiler);

	inject({ mode: dev ? 'development' : 'production' });
</script>

<a href="#main" class="skip-to-main-content-link">Skip to main content</a>

<LoadingIndicator />
<slot />

<SvelteToast
	options={{
		theme: {
			'--toastBarBackground': 'var(--sk-theme-1)'
		}
	}}
/>

<style>
	.skip-to-main-content-link {
		position: absolute;
		z-index: 999;
		padding: 1em;
		left: -90001px;
		background-color: var(--sk-back-1);
		color: var(--sk-text-1);
		opacity: 0;
		border: 1px solid var(--sk-theme-1);
		margin: 1em;
		border-radius: 0.5rem;
	}
	.skip-to-main-content-link:focus {
		left: 0;
		opacity: 1;
	}
</style>
