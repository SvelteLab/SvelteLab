<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import Refresh from '~icons/akar-icons/arrow-clockwise';

	function handleUrlChange(e: SubmitEvent) {
		webcontainer.set_iframe_path(''); // refresh even if nothing changed
		const url = new FormData(e.target as HTMLFormElement).get('url')?.toString() || '/';
		if (url.startsWith('/')) {
			webcontainer.set_iframe_path(url);
		} else {
			webcontainer.set_iframe_path('/' + url);
		}
	}
</script>

<section>
	<form on:submit|preventDefault={handleUrlChange}>
		<button title="Refresh">
			<Refresh />
		</button>
		<input name="url" type="text" value={$webcontainer.iframe_path} />
	</form>
	{#key $webcontainer.webcontainer_url + $webcontainer.iframe_path}
		<iframe
			title="content"
			src={$webcontainer.webcontainer_url.startsWith('.')
				? $webcontainer.webcontainer_url
				: $webcontainer.webcontainer_url + $webcontainer.iframe_path}
		/>
	{/key}
</section>

<style>
	form {
		padding: 0.25em;
		display: flex;
		background-color: var(--sk-back-2);
		gap: 0.5rem;
		border-bottom: 1px solid var(--sk-back-4);
	}

	input {
		border: none;
		color: var(--sk-text-2);
		flex-grow: 1;
		font-family: inherit;
		font-size: inherit;
		height: 100%;
		width: 100%;
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
