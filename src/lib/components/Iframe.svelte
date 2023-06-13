<script lang="ts">
	import { get_theme } from '$lib/theme';
	import { webcontainer } from '$lib/webcontainer';
	import { tick } from 'svelte';
	import InstallDeps from '~icons/line-md/downloading-loop';
	import Booting from '~icons/line-md/loading-alt-loop';
	import Error from '~icons/material-symbols/chat-error-rounded';
	import OpenInNew from '~icons/material-symbols/open-in-new';
	import Refresh from '~icons/material-symbols/refresh-rounded';

	const theme = get_theme();

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
	let timeout_cancellation: ReturnType<typeof setTimeout>;
	let slow_booting = false;
	$: {
		clearTimeout(timeout_cancellation);
		slow_booting = false;
		if ($webcontainer.status === 'booting' || $webcontainer.status === 'waiting') {
			timeout_cancellation = setTimeout(() => {
				slow_booting = true;
			}, 15000);
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
		{#key $webcontainer.webcontainer_url + $webcontainer.iframe_path + $theme.current}
			<iframe
				title="content"
				src={($webcontainer.webcontainer_url.startsWith('.')
					? $webcontainer.webcontainer_url
					: $webcontainer.webcontainer_url + $webcontainer.iframe_path) +
					'?theme=' +
					$theme.current}
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
			{#if slow_booting && $webcontainer.status !== 'server_closed'}
				<small>
					It seems like this is taking time.
					<a
						href="https://developer.stackblitz.com/platform/webcontainers/browser-config"
						target="_blank"
						rel="noopener noreferrer"
					>
						Make sure your browser is setup correctly
					</a>
					.
				</small>
			{/if}
		</div>
	{/if}
</section>

<style>
	form {
		padding: 0.5em;
		display: flex;
		background-color: var(--sk-back-1);
		gap: 0.5em;
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

	section {
		height: 100%;
	}

	iframe {
		width: 100%;
		height: calc(100% - 2.4em);
		border: none;
	}
	small {
		font-size: initial;
		max-width: 50%;
	}
	small > a {
		display: inline;
		color: var(--sk-theme-1);
		text-decoration: underline;
	}
</style>
