<script>
	import { update_first_time } from '$lib/first_load';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import '../styles/global.css';
	import LoadingIndicator from './LoadingIndicator.svelte';

	onMount(update_first_time);
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
