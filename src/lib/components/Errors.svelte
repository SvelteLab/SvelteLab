<script lang="ts">
	import { diagnostic_store } from '$lib/stores/editor_errors_store';
	import { current_tab } from '$lib/tabs';
	import { slide } from 'svelte/transition';
	import ErrorIcon from '~icons/material-symbols/error-circle-rounded-outline';
	import WarningIcon from '~icons/material-symbols/warning-outline-rounded';

	$: diagnostics = $diagnostic_store.get($current_tab) ?? [];
</script>

<ul>
	{#each [...diagnostics] as diagnostic}
		<li class={diagnostic.type} transition:slide={{ delay: 250, duration: 250 }}>
			{#if diagnostic.type === 'warning'}
				<WarningIcon />
			{:else}
				<ErrorIcon />
			{/if}
			{diagnostic.message}
			{#if diagnostic.start}
				at {diagnostic.start?.line}:{diagnostic.start?.character}
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		color: var(--sk-back-1);
		font-size: var(--sk-text-xs);
		margin: 0;
		padding: 0;
	}
	li {
		padding: 0.3em;
		display: grid;
		grid-template-columns: max-content 1fr;
		align-items: center;
		gap: 0.5em;
		border-top: 1px solid var(--sk-back-4);
	}
	li :global(svg) {
		font-size: var(--sk-text-m);
	}
	.warning {
		background-color: #e2aa53;
	}
	.error {
		background-color: #ff5555;
	}
</style>
