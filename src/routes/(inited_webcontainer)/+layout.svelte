<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import '../../styles/global.css';
	onMount(() => {
		//this is to interact with the filesistem
		//from the console...we can remove it later
		(window as any).wc = webcontainer;
	});
</script>

{#await webcontainer.init()}
	Booting up webcontainer...
{:then _}
	<slot />
{/await}
