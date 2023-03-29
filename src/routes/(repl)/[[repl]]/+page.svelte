<script lang="ts">
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

<svelte:head>
	<title>SvelteLab - {title}</title>
	<meta property="og:site_name" content="SvelteLab" />
	<meta property="og:title" content="SvelteLab - {title}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sveltelab.dev/" />
	<meta property="og:description" content={''} />
	<meta content="summary_large_image" name="twitter:card" />
	<meta content="./og?repl_id={$repl_id ?? ''}" property="og:image" />
</svelte:head>

<svelte:window bind:innerWidth={width} />

{#if width >= 500}
	<Desktop {Console} {Editor} />
{:else}
	<Mobile {Console} {Editor} />
{/if}
