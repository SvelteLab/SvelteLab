<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { tick } from 'svelte';
	import InstallDeps from '~icons/line-md/downloading-loop';
	import Booting from '~icons/line-md/loading-alt-loop';
	import Error from '~icons/material-symbols/chat-error-rounded';
	import OpenInNew from '~icons/material-symbols/open-in-new';
	import Refresh from '~icons/material-symbols/refresh-rounded';

	async function handleUrlChange(e: SubmitEvent) {
		webcontainer.set_iframe_path(''); // refresh even if nothing changed
		const url = new FormData(e.target as HTMLFormElement).get('url')?.toString() || '/';
		await tick();
		if (url.startsWith('/')) {
			webcontainer.set_iframe_path(url);
		} else {
			webcontainer.set_iframe_path('/' + url);
		}
	}
</script>

<section>
	{#if $webcontainer.webcontainer_url}
		<form on:submit|preventDefault={handleUrlChange}>
			<button title="Refresh">
				<Refresh />
			</button>
			<input
				autocomplete="off"
				aria-label="current path"
				name="url"
				type="text"
				value={$webcontainer.iframe_path}
			/>
			<a
				title="Open in new Tab"
				href={$webcontainer.webcontainer_url + $webcontainer.iframe_path}
				target="_blank"
				rel="noopener noreferrer"
			>
				<OpenInNew />
			</a>
		</form>
		{#key $webcontainer.webcontainer_url + $webcontainer.iframe_path}
			<iframe
				title="content"
				src={$webcontainer.webcontainer_url.startsWith('.')
					? $webcontainer.webcontainer_url
					: $webcontainer.webcontainer_url + $webcontainer.iframe_path}
			/>
		{/key}
	{:else}
		<div class="loader">
			{#if $webcontainer.status === 'booting'}
				<Booting />
				<span> Booting WebContainer and mounting Filesystem... </span>
			{:else if $webcontainer.status === 'waiting'}
				<InstallDeps />
				<span> Installing Dependencies and starting Vite... </span>
			{:else if $webcontainer.status === 'server_closed'}
				<Error />
				<span> Server Closed </span>
				<span>Try running a script...</span>
			{/if}
		</div>
	{/if}
</section>

<style>
	form {
		padding: 0.25em;
		display: flex;
		background-color: var(--sk-back-2);
		gap: 0.5rem;
		border-bottom: 1px solid var(--sk-back-4);
	}

	a,
	button {
		display: flex;
		align-items: center;
		color: var(--sk-text-2);
		font-size: inherit;
	}

	input {
		border: none;
		color: var(--sk-text-2);
		flex-grow: 1;
		font-family: inherit;
		font-size: inherit;
		height: 100%;
		width: 100%;
		background-color: transparent;
	}

	input:focus {
		background-color: var(--sk-back-2);
		outline: 1px solid var(--sk-theme-1);
	}

	iframe,
	section {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
