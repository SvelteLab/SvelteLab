<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../styles/global.css';
	import LoadingIndicator from './LoadingIndicator.svelte';

	inject({ mode: dev ? 'development' : 'production' });
</script>

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
	:global(:root) {
		--toastContainerBottom: 1.5rem;
		--toastContainerTop: auto;
		--toastMsgPadding: 1.5rem;
		--toastWidth: min(auto, 100%);
		--toastBackground: var(--sk-back-2);
		--toastColor: var(--sk-text-1);
	}
</style>
