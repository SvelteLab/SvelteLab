<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#each data.repls as repl (repl.id)}
	<a href={repl.id}>{repl.name || repl.id}</a><br />
{/each}
