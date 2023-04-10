<script lang="ts">
	import { terminal } from '$lib/terminal';
	import type { NpmResponse } from '$lib/types';
	import { webcontainer } from '$lib/webcontainer';
	import { toast } from '@zerodevx/svelte-toast';
	import { createEventDispatcher } from 'svelte';
	import Loading from '~icons/eos-icons/loading';

	let search = '';

	const dispatch = createEventDispatcher();

	let searchQuery = Promise.resolve(null) as Promise<null | NpmResponse>;
	let debounceTimeout: ReturnType<typeof setTimeout>;
	$: {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			searchQuery = fetch('https://registry.npmjs.org/-/v1/search?size=5&text=' + search).then(
				(res) => res.json()
			);
		}, 500);
	}
</script>

<input bind:value={search} type="search" />

{#await searchQuery}
	<section><Loading /></section>
{:then results}
	<ul>
		{#each results?.objects ?? [] as pack}
			{@const library = pack.package}
			<li>
				<button
					on:click={async () => {
						const progress_toast = toast.push(`Installing ${library.name}...`, {
							initial: 0,
							dismissable: false
						});
						const process = await webcontainer.spawn('npm', ['i', library.name]);
						process.output.pipeTo(
							new WritableStream({
								write(chunk) {
									terminal.write(chunk);
								}
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
		{/each}
	</ul>
{/await}

<style>
	ul {
		list-style: none;
		margin: 0;
		padding-block: 0.5rem;
		display: grid;
		gap: 0.5rem;
		width: 100%;
	}
	li {
		min-width: 0;
	}
	button {
		width: 100%;
		text-align: left;
	}
	p {
		margin: 0;
	}
	input {
		background-color: var(--sk-back-2);
		width: 100%;
		color: var(--sk-text-1);
		padding: 0.5rem;
		border: 0;
		border-radius: 0.5rem;
	}
	section {
		display: grid;
		place-items: center;
		padding: 1rem;
	}
	small {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
		opacity: 0.5;
	}
</style>
