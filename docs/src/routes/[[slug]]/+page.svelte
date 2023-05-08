<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: metadata = data.page_info?.metadata ?? {};
</script>

<svelte:head>
	<title>{metadata.title}</title>
</svelte:head>
<svelte:component this={data.page} />
