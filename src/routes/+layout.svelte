<script>
	import { apply_font_preferences } from '$lib/font_preferences';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../styles/global.css';
	import LoadingIndicator from './LoadingIndicator.svelte';

	apply_font_preferences();
</script>

<a href="#main" class="skip-to-main-content-link">Skip to main content</a>
<h1 class="screen-reader-only">SvelteLab</h1>
<LoadingIndicator />
<slot />

<SvelteToast
	options={{
		theme: {
			'--toastBarBackground': 'var(--sk-theme-1)',
		},
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
