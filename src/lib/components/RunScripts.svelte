<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import { onMount } from 'svelte';
	import Refresh from '~icons/akar-icons/arrow-counter-clockwise';
	import Play from '~icons/akar-icons/play';
	import Stop from '~icons/akar-icons/square';
	import Running from '~icons/eos-icons/loading';
	let scripts: [string, string][] = [];
	let loading = false;
	async function refresh_package_json() {
		loading = true;
		const [package_json] = await Promise.all([
			webcontainer.read_package_json()
			// new Promise((resolve) => setTimeout(resolve, 1000))
		]);
		scripts = Object.entries(package_json?.scripts || {}) as unknown as [string, string][];
		loading = false;
	}
	onMount(() => {
		return webcontainer.on_init(refresh_package_json);
	});
</script>

<div class="heading">
	<span>NPM SCRIPTS</span>
	{#if !loading}
		<div class="hover-group">
			<button on:click={refresh_package_json}><Refresh /></button>
		</div>
	{:else}
		<Running />
	{/if}
</div>
<ul>
	{#each scripts as [script, run]}
		{@const actual_command = `npm run ${script}`}
		{@const running = actual_command === $webcontainer.running_command}
		<li>
			<button
				on:click={() => {
					$webcontainer.running_process?.kill();
					if (!running) webcontainer.run_command(actual_command);
				}}
			>
				{script}
				<small>{run}</small>
				{#if running}
					<Running />
				{/if}
			</button>
			<button
				class="hover-group"
				on:click={() => {
					$webcontainer.running_process?.kill();
					if (!running) webcontainer.run_command(actual_command);
				}}
			>
				{#if running}
					<Stop />
				{:else}
					<Play />
				{/if}
			</button>
		</li>
	{:else}
		<li>
			no scripts...

			<div class="hover-group">
				<button on:click={refresh_package_json}><Refresh /></button>
			</div>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 1rem;
		padding-block: 0rem;
		padding-inline-end: 0rem;
		background-color: var(--sk-back-3);
		height: 100%;
	}
	li {
		display: grid;
		color: var(--sk-text-1);
		height: 2em;
		overflow: hidden;
		white-space: nowrap;
		padding: 0.5rem;
		position: relative;
	}
	small {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0.5;
	}

	button {
		min-width: 0;
		display: flex;
		gap: 0.5rem;
		align-items: center;
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

	.hover-group {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		display: flex;
		gap: 0.75rem;
		padding: 0.5rem;
		align-items: center;
		justify-content: end;
		background-color: var(--sk-back-3);
		color: var(--sk-text-3);
	}

	.heading {
		padding-inline-start: 1em;
		position: relative;
	}

	.heading .hover-group {
		background-color: var(--sk-back-1);
	}

	.heading .hover-group,
	li .hover-group {
		display: none;
	}

	.heading:hover .hover-group,
	li:hover .hover-group {
		display: flex;
	}

	@media (hover: none) {
		.heading .hover-group,
		li .hover-group {
			display: flex;
		}
	}
</style>
