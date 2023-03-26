<script lang="ts">
	import type { SvelteError } from '$lib/types';
	import { compile } from 'svelte/compiler';
	import { slide } from 'svelte/transition';
	import type { Warning } from 'svelte/types/compiler/interfaces';
	import ErrorIcon from '~icons/material-symbols/error-circle-rounded-outline';
	import WarningIcon from '~icons/material-symbols/warning-outline-rounded';

	export let code = '';
	export let warnings = [] as Warning[];
	export let error: SvelteError | null = null;

	function parse(code: string) {
		warnings = [];
		error = null;
		try {
			warnings = compile(code)?.warnings ?? [];
		} catch (e) {
			error = e as SvelteError;
		}
	}

	$: parse(code);
</script>

<ul>
	{#if error}
		<li class="error" transition:slide={{ delay: 250, duration: 250 }}>
			<ErrorIcon />{error.message} at {error.start.line}:{error.start.column}
		</li>
	{/if}

	{#each warnings as warning}
		<li class="warning" transition:slide={{ delay: 250, duration: 250 }}>
			<WarningIcon />{warning.message}
			{#if warning.start}
				at {warning.start.line}:{warning.start.column}
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		position: absolute;
		inset: 0;
		top: auto;
		color: var(--sk-back-1);
		font-size: var(--sk-text-xs);
		margin: 0;
		padding: 0;
	}
	li {
		padding: 0.3em;
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em;
		border-top: 1px solid var(--sk-back-4);
	}
	li :global(svg) {
		font-size: var(--sk-text-m);
	}
	.warning {
		background-color: hsl(32, 92%, 47%);
	}
	.error {
		background-color: hsl(332, 86%, 46%);
	}
</style>
