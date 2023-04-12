<script lang="ts">
	import { terminal } from '$lib/terminal';
	import { webcontainer } from '$lib/webcontainer';
	import { toast } from '@zerodevx/svelte-toast';
	import { createEventDispatcher } from 'svelte';
	import Loading from '~icons/eos-icons/loading';

	const dispatch = createEventDispatcher();

	let search = '';
	let loading = false;
	let packages: Array<{
		package: {
			name: string;
			scope: string;
			version: string;
			description: string;
		};
	}> = [];
	let NPM_SEARCH_URL = 'https://registry.npmjs.org/-/v1/search?size=5&text=';
	let debounceTimeout: ReturnType<typeof setTimeout>;

	function handle_search() {
		if (!search) {
			packages = [];
			return;
		}
		loading = true;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const json = await fetch(NPM_SEARCH_URL + search).then((res) => res.json());
			packages = json.objects;
			loading = false;
		}, 500);
	}
</script>

<div class="container">
	<label for="package-search"> npm Package Name </label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		class="action-field"
		id="package-search"
		autofocus
		bind:value={search}
		type="search"
		on:input={handle_search}
	/>

	{#if loading}
		<section><Loading /></section>
	{:else}
		<ul>
			{#each packages ?? [] as { package: library }}
				<li>
					<button
						on:click={async () => {
							const progress_toast = toast.push(`Installing ${library.name}...`, {
								initial: 0,
								dismissable: false,
							});
							const process = await webcontainer.spawn('npm', ['i', library.name]);
							process.output.pipeTo(
								new WritableStream({
									write(chunk) {
										terminal.write(chunk);
									},
								})
							);
							dispatch('completed');
							await process.exit;
							toast.pop(progress_toast);
						}}
					>
						<p>
							{library.name}@{library.version}
						</p>
						<small>
							{library.description}
						</small>
					</button>
				</li>
			{:else}
				{#if !search}
					<section>type to search for an npm package</section>
				{:else}
					<section>No Results</section>
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<style>
	.container {
		margin: 2rem;
		height: 37.2rem;
	}
	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	li {
		min-width: 0;
	}

	button {
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		width: 100%;
		text-align: left;
	}
	p {
		margin: 0;
	}

	section {
		display: grid;
		place-items: center;
		padding: 1rem;
		font-size: 2rem;
	}
	small {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
		opacity: 0.5;
	}
</style>
