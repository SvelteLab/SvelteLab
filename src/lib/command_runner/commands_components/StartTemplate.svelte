<script lang="ts">
	import { page } from '$app/stores';
	function capitalize(title: string) {
		return `${title.charAt(0).toUpperCase()}${title.substring(1)}`;
	}

	function fix_title(title: string) {
		return title.split('_').map(capitalize).join('+');
	}
</script>

<ul>
	{#each $page.data.templates ?? [] as template}
		<li>
			<a title="Open {template}" href="./?t={template}" target="_blank" rel="noopener noreferrer">
				{fix_title(template)}
			</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		background-color: var(--sk-back-2);
		display: flex;
		gap: 1rem;
		list-style: none;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
</style>
