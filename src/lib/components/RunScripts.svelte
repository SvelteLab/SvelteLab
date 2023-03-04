<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import Play from '~icons/akar-icons/play';
	import Stop from '~icons/akar-icons/square';
	import Running from '~icons/eos-icons/loading';
	import Refresh from '~icons/akar-icons/arrow-counter-clockwise';
	let scripts: [string, string][] = [];
	let loading = false;
	async function refresh_package_json() {
		loading = true;
		const [package_json] = await Promise.all([
			webcontainer.read_package_json(),
			new Promise((resolve) => setTimeout(resolve, 1000))
		]);
		scripts = Object.entries(package_json?.scripts || {}) as unknown as [string, string][];
		loading = false;
	}
	onMount(() => {
		return webcontainer.on_init(refresh_package_json);
	});
</script>

<div>
	<span>NPM SCRIPTS</span>
	{#if !loading}
		<button on:click={refresh_package_json}><Refresh /></button>
	{:else}
		<Running />
	{/if}
</div>
<ul>
	{#each scripts as [script, run]}
		{@const actual_command = `npm run ${script}`}
		<li>
			{script}<small>{run}</small>
			<button
				disabled={!!$webcontainer.running_command &&
					$webcontainer.running_command !== actual_command}
				on:click={() => {
					if ($webcontainer.running_process) {
						$webcontainer.running_process.kill();
					} else {
						webcontainer.run_command(actual_command);
					}
				}}
			>
				{#if actual_command === $webcontainer.running_command}
					<Running /><Stop />
				{:else}
					<Play />
				{/if}
			</button>
		</li>
	{:else}
		no scripts
	{/each}
</ul>

<style>
	ul {
		overflow-y: auto;
		height: 100%;
		margin: 0;
		scrollbar-gutter: stable;
		padding: 1rem;
		background-color: var(--sk-back-3);
	}
	li {
		display: grid;
		grid-template-columns: min-content 1fr auto;
		gap: 0.3rem;
		align-items: center;
	}
	small {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.5;
	}
	button {
		display: flex;
	}
	div {
		background-color: var(--sk-back-1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		font-weight: bold;
		font-size: 1.3rem;
		text-transform: uppercase;
	}
</style>
