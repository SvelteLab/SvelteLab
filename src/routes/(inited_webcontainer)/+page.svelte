<script lang="ts">
	import Console from '$lib/components/Console.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { webcontainer, logs } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	onMount(async () => {
		await webcontainer.install_dependencies();
		webcontainer.run_dev_server();
	});
</script>

<main>
	<section class="editor">
		<Editor />
	</section>
	<section class="iframe">
		{#key $webcontainer.iframe_url}
			<iframe title="content" src={$webcontainer.iframe_url} />
		{/key}
	</section>
	<section class="console">
		<Console />
	</section>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 3fr 1fr;
		height: 100vh;
		overflow-y: auto;
	}
	section {
		display: grid;
	}
	section > :global(*) {
		grid-area: 1 / -1 / 1 / -1;
		width: auto;
	}
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
	.console {
		grid-column: 1/-1;
		overflow: hidden;
	}
</style>
