<script lang="ts">
	import { enhance } from '$app/forms';
	import TreeMap from '$lib/components/TreeMap.svelte';
	import { share } from '$lib/share';
	import { flip } from 'svelte/animate';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import TrashCan from '~icons/material-symbols/delete-forever-outline';
	import Fork from '~icons/material-symbols/fork-right-rounded';
	import Share from '~icons/material-symbols/share';
	import type { PageData } from './$types';
	import ProfileHeader from './ProfileHeader.svelte';
	import Pending from '~icons/eos-icons/loading';

	export let data: PageData;

	const search = queryParam('s', ssp.string(), {
		debounceHistory: 500
	});
	let loading = [] as string[];
	$: repls = data.repls.filter((repl) =>
		repl.name.toLowerCase().includes($search?.toLowerCase() ?? '')
	);
</script>

<ProfileHeader />
<main>
	<input bind:value={$search} placeholder="search..." aria-label="search a repl" type="search" />
	{#each repls as project (project.id)}
		<!-- this will be useful when we will add delete -->
		<article
			animate:flip={{
				duration: 250
			}}
		>
			<a data-sveltekit-preload-data="off" href="/{project.id}">
				<p>
					{project.name}
				</p>
				<small>/{project.id}</small>
			</a>
			<div class="buttons">
				<button
					on:click={() => {
						share({
							text: `Take a look at my REPL`,
							title: `Svelteblitz - ${project.name}`,
							url: `/${project.id}`
						});
					}}
				>
					<Share />
				</button>
				{#if data.user}
					<form
						use:enhance={() => {
							loading.push(project.id);
							loading = loading;
							return ({ update }) => {
								loading = loading.filter((id) => id !== project.id);
								update();
							};
						}}
						action="?/fork"
						method="POST"
					>
						<input name="id" type="hidden" value={project.id} />
						<button
							on:click={(e) => {
								if (!window.confirm(`Are you sure you want to fork "${project.name}"`)) {
									e.stopPropagation();
									e.preventDefault();
								}
							}}
						>
							<Fork />
						</button>
					</form>
				{/if}
				{#if data.user?.id === data.profile.id}
					<form
						use:enhance={() => {
							loading.push(project.id);
							loading = loading;
							return ({ update }) => {
								loading = loading.filter((id) => id !== project.id);
								// optimistic update
								repls = repls.filter((repl) => repl.id !== project.id);
								update();
							};
						}}
						action="?/delete"
						method="POST"
					>
						<input name="id" type="hidden" value={project.id} />
						<button
							on:click={(e) => {
								if (!window.confirm(`Are you sure you want to delete "${project.name}"`)) {
									e.stopPropagation();
									e.preventDefault();
								}
							}}
							style:color="var(--sk-theme-1)"
						>
							<TrashCan />
						</button>
					</form>
				{/if}
			</div>
			<div class="tree">
				<TreeMap tree={project.files} />
			</div>
			{#if loading.includes(project.id)}
				<div class="loading">
					<Pending />
				</div>
			{/if}
		</article>
	{/each}
</main>

<style>
	:global(body) {
		background-color: var(--sk-back-1);
	}
	main {
		padding: 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		gap: 2rem;
		max-width: 100%;
		background-color: var(--sk-back-1);
	}
	input {
		grid-column: 1/-1;
		width: min(50rem, 100%);
		justify-self: center;
		background-color: var(--sk-back-5);
		padding: 0.5rem;
		border: none;
		border-radius: 0.5rem;
		color: var(--sk-text-1);
	}
	input::placeholder {
		color: var(--sk-text-1);
		opacity: 0.6;
	}
	a {
		color: var(--sk-text-1);
		text-decoration: none;
	}
	article {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 30%), 0 2px 4px -2px rgb(0 0 0 / 70%);
		padding: 2rem;
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		height: 100%;
		background-color: var(--sk-back-2);
		position: relative;
	}
	article > * {
		max-width: 80%;
	}
	.tree {
		right: 0;
		top: 0;
		width: 20%;
		bottom: 0;
		position: absolute;
		border-left: 1px solid var(--sk-code-bg);
		background: linear-gradient(-45deg, var(--sk-code-bg), transparent);
	}
	.tree :global(svg) {
		position: absolute;
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
	.buttons {
		margin-block-start: 2.5rem;
		display: flex;
		font-size: 2rem;
	}
	p {
		margin: 0;
		font-size: 2rem;
	}
	small {
		background: var(--sk-back-5);
		padding: 0.75rem;
		border-radius: 0.3rem;
	}
	form {
		line-height: 0;
	}
	.loading {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 3rem;
		background-color: var(--sk-back-5);
		opacity: 0.7;
		max-width: unset;
	}
</style>
