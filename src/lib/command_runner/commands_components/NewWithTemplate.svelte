<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_GITHUB_REPO } from '$env/static/public';
	import GitHub from '~icons/mdi/github';

	function capitalize(title: string) {
		return `${title.charAt(0).toUpperCase()}${title.substring(1)}`;
	}

	function fix_title(title: string) {
		return title.split('_').map(capitalize).join(' + ');
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
<a
	href="{PUBLIC_GITHUB_REPO}/issues/new"
	target="_blank"
	rel="noopener noreferrer"
	title="Propose a new template"><GitHub /> Propose a new template</a
>

<style>
	ul {
		background-color: var(--sk-back-2);
		display: flex;
		gap: 1rem;
		list-style: none;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
	a {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 1ch;
	}
</style>
