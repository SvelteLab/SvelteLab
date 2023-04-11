<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_GITHUB_REPO, PUBLIC_TEMPLATE_COOKIE_NAME } from '$env/static/public';
	import { get_cookie, set_cookie } from '$lib/cookie';
	import { createEventDispatcher } from 'svelte';
	import GitHub from '~icons/mdi/github';

	const dispatcher = createEventDispatcher();

	function capitalize(title: string) {
		return `${title.charAt(0).toUpperCase()}${title.substring(1)}`;
	}

	function fix_title(title: string) {
		return title.split('_').map(capitalize).join('+');
	}

	let selected = get_cookie(PUBLIC_TEMPLATE_COOKIE_NAME) || 'basic';
</script>

<form
	on:submit|preventDefault={() => {
		set_cookie(PUBLIC_TEMPLATE_COOKIE_NAME, selected);
		dispatcher('completed');
	}}
>
	<select id="default_template" bind:value={selected}>
		{#each $page.data.templates ?? [] as template}
			<option value={template}>{fix_title(template)}</option>
		{/each}
	</select>
	<button title="Save template">Save</button>
</form>
<a
	href="{PUBLIC_GITHUB_REPO}/issues/new"
	target="_blank"
	rel="noopener noreferrer"
	title="Propose a new template"><GitHub /> Propose a new template</a
>

<style>
	form {
		display: flex;
		gap: 1rem;
		list-style: none;
		flex-wrap: wrap;
	}
	select {
		flex-grow: 1;
		background-color: var(--sk-back-1);
		color: var(--sk-text-1);
		padding: 0.5rem;
	}
	a {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 1ch;
		margin-top: 1rem;
	}
</style>
