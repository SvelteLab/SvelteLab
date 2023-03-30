<script lang="ts">
	import { page } from '$app/stores';
	import PlaceholderComponent from '$lib/components/PlaceholderComponent.svelte';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import { repl_id, repl_name } from '$lib/stores/repl_id_store';
	import type { ComponentType, SvelteComponentTyped } from 'svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Desktop from './Desktop.svelte';
	import Mobile from './Mobile.svelte';

	$: title = $repl_name ?? 'The SvelteKit REPL';

	let Console: ComponentType<SvelteComponentTyped> = PlaceholderComponent;
	let Editor: ComponentType<SvelteComponentTyped> = VoidEditor;

	onMount(async () => {
		Console = (await import('$lib/components/Console.svelte')).default;
		Editor = (await import('$lib/components/Editor.svelte')).default;
	});

	let width: number;
</script>

<svelte:window bind:innerWidth={width} />

{#if width >= 500}
	<Desktop {Console} {Editor} />
{:else}
	<Mobile {Console} {Editor} />
{/if}
