<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav>
	<ul>
		{#each data.pages as page (page.link)}
			<li><a href={page.link}>{page.metadata?.title ?? page.link}</a></li>
		{/each}
	</ul>
</nav>
<slot />
