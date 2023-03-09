<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import Desktop from './Desktop.svelte';
	import Mobile from './Mobile.svelte';

	onMount(async () => {
		return webcontainer.on_init(async () => {
			await webcontainer.install_dependencies();
			webcontainer.run_dev_server();
		});
	});

	let width: number;
</script>

<svelte:window bind:innerWidth={width} />

{#if width >= 500}
	<Desktop />
{:else}
	<Mobile />
{/if}
