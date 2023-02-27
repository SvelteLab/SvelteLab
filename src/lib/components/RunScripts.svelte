<script lang="ts">
	import { in_memory_fs, webcontainer } from '$lib/webcontainer';
	import Play from '~icons/akar-icons/play';
	import Stop from '~icons/akar-icons/square';
	import Running from '~icons/eos-icons/loading';
	let scripts: [string, string][] = [];
	$: {
		try {
			const package_json = JSON.parse($in_memory_fs['package.json'].file.contents);
			scripts = Object.entries(package_json?.scripts || {}) as unknown as [string, string][];
		} catch (e) {}
	}
</script>

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
</style>
