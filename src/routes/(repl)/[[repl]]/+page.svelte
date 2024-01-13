<script lang="ts">
	import PlaceholderComponent from '$lib/components/PlaceholderComponent.svelte';
	import VoidEditor from '$lib/components/VoidEditor.svelte';
	import type { ComponentType, SvelteComponent } from 'svelte';
	import { onMount } from 'svelte';
	import Desktop from './Desktop.svelte';
	import Mobile from './Mobile.svelte';
	import LanguageClientProvider from '$lib/components/LanguageClientProvider.svelte';

	// eslint-disable-next-line @typescript-eslint/naming-convention
	let Console: ComponentType<SvelteComponent> = PlaceholderComponent;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	let Editor: ComponentType<SvelteComponent> = VoidEditor;

	onMount(async () => {
		Console = (await import('$lib/components/Console.svelte')).default;
		Editor = (await import('$lib/components/Editor.svelte')).default;
	});

	let width: number;
</script>

<svelte:window bind:innerWidth={width} />

<LanguageClientProvider>
	{#if width >= 500}
		<Desktop {Console} {Editor} />
	{:else}
		<Mobile {Console} {Editor} />
	{/if}
</LanguageClientProvider>
