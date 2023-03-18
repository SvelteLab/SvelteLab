<script lang="ts">
	import type { SvelteError } from '$lib/types';
	import { compile } from 'svelte/compiler';
	import type { Warning } from 'svelte/types/compiler/interfaces';
	import ErrorIcon from '~icons/material-symbols/error-circle-rounded-outline';
	import WarningIcon from '~icons/material-symbols/warning-outline';

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

<errors-container>
	{#if error}
		<div class="error"><ErrorIcon />{error.message} at {error.start.line}:{error.start.column}</div>
	{/if}

	{#each warnings as warning}
		<div class="warning"><WarningIcon />{warning.message}</div>
	{/each}
</errors-container>

<style>
	errors-container {
		position: absolute;
		inset: 0;
		top: auto;
		color: hsl(0, 0%, 10%);
		font-weight: bold;
		font-size: var(--sk-text-xs);
	}
	div {
		padding: 0.3em;
		border-bottom: 1px solid hsl(0, 0%, 10%);
		display: grid;
		grid-template-columns: min-content 1fr;
		gap: 1rem;
	}
	.warning {
		background-image: linear-gradient(
			80deg,
			hsl(29deg 100% 50%) 0%,
			hsl(32deg 100% 50%) 15%,
			hsl(36deg 100% 50%) 27%,
			hsl(39deg 100% 49%) 37%,
			hsl(43deg 100% 48%) 46%,
			hsl(46deg 100% 48%) 55%,
			hsl(51deg 100% 47%) 65%,
			hsl(55deg 100% 45%) 74%,
			hsl(60deg 93% 46%) 85%,
			hsl(65deg 83% 53%) 100%
		);
	}
	.error {
		background-image: linear-gradient(
			80deg,
			hsl(0deg 100% 50%) 0%,
			hsl(0deg 98% 51%) 15%,
			hsl(0deg 97% 51%) 27%,
			hsl(0deg 95% 52%) 37%,
			hsl(0deg 93% 52%) 46%,
			hsl(0deg 91% 53%) 55%,
			hsl(0deg 89% 53%) 65%,
			hsl(0deg 87% 53%) 74%,
			hsl(0deg 85% 53%) 85%,
			hsl(0deg 83% 53%) 100%
		);
	}
</style>
