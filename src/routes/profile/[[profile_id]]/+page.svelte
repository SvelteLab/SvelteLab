<script lang="ts">
	import { enhance } from '$app/forms';
	import TreeMap from '$lib/components/TreeMap.svelte';
	import type { ShareFn } from '$lib/share';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import Pending from '~icons/eos-icons/loading';
	import TrashCan from '~icons/material-symbols/delete-forever-outline';
	import Fork from '~icons/material-symbols/fork-right-rounded';
	import Share from '~icons/material-symbols/share';
	import type { PageData } from './$types';
	import ProfileHeader from './ProfileHeader.svelte';
	import NoneFound from '~icons/material-symbols/sad-tab-outline-rounded';
	import RelativeTime from '@yaireo/relative-time';

	export let data: PageData;

	let share: ShareFn;

	onMount(async () => {
		share = (await import('$lib/share')).share;
	});

	const search = queryParam('s', ssp.string(), {
		pushHistory: false,
	});

	let loading = [] as string[];

	$: repls = data.repls.filter((repl) =>
		repl.name.toLowerCase().includes($search?.toLowerCase() ?? '')
	);

	const relative_time = new RelativeTime();
</script>

<svelte:head>
	<title>{data.user?.username || 'Profile'} - SvelteLab</title>
</svelte:head>
<ProfileHeader />
<main>
	<input
		bind:value={$search}
		placeholder="🔍 Search..."
		aria-label="Search for a repl"
		type="search"
	/>
	{#each repls as project (project.id)}
		{@const created = relative_time.from(new Date(project.created))}
		{@const updated = relative_time.from(new Date(project.updated))}
		<!-- this will be useful when we will add delete -->
		<article
			animate:flip={{
				duration: 250,
			}}
		>
			<a data-sveltekit-preload-data="off" href="/{project.id}">
				<p>
					{project.name}
				</p>
				<small title={project.created}>created {created}</small>
				{#if created != updated}
					<small title={project.updated}>updated {updated}</small>
				{/if}
				<code>/{project.id}</code>
			</a>
			<div class="buttons">
				<button
					on:click={() => {
						share?.({
							text: `Take a look at my REPL`,
							title: `SvelteLab - ${project.name}`,
							url: `/${project.id}`,
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
			<a data-sveltekit-preload-data="off" href="/{project.id}" class="tree">
				<TreeMap tree={project.files} />
			</a>
			{#if loading.includes(project.id)}
				<div class="loading">
					<Pending />
				</div>
			{/if}
		</article>
	{:else}
		<div class="loader">
			<NoneFound />
			<span>No projects found</span>
		</div>
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
		background-color: transparent;
		border: 1px solid var(--sk-back-4);
		padding: 0.5rem;
		border-radius: 0.5rem;
		color: var(--sk-text-1);
		font-size: 2rem;
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
	.buttons {
		margin-block-start: 2.5rem;
		display: flex;
		font-size: 2rem;
		gap: 0.5em;
	}
	p {
		margin: 0;
		font-size: 2rem;
		word-break: break-all;
	}
	small {
		color: var(--sk-text-2);
		display: block;
		margin-block: 0.5em;
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
