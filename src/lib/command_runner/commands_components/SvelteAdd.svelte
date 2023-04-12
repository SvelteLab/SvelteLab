<script lang="ts">
	import { terminal } from '$lib/terminal';
	import { webcontainer } from '$lib/webcontainer';
	import { toast } from '@zerodevx/svelte-toast';
	import { createEventDispatcher } from 'svelte';
	import Routify from '~icons/material-symbols/alt-route-rounded';
	import Imagetools from '~icons/material-symbols/imagesmode';
	import Bulma from '~icons/mdi/bulma';
	import Sass from '~icons/mdi/sass';
	import Tailwind from '~icons/mdi/tailwind';
	import Cubed from '~icons/ph/cube-bold';
	import Bootstrap from '~icons/ri/bootstrap-fill';
	import Coffeescript from '~icons/simple-icons/coffeescript';
	import Markdown from '~icons/simple-icons/markdown';
	import PostCSS from '~icons/simple-icons/postcss';
	import Tauri from '~icons/simple-icons/tauri';

	const dispatch = createEventDispatcher();

	const addable = [
		{ label: 'PostCSS', icon: PostCSS, name: 'postcss' },
		{ label: 'SCSS', icon: Sass, name: 'scss' },
		{ label: 'Tailwind CSS', icon: Tailwind, name: 'tailwindcss' },
		{ label: 'Bootstrap', icon: Bootstrap, name: 'bootstrap' },
		{ label: 'Bulma', icon: Bulma, name: 'bulma' },
		{ label: 'Imagetools*', icon: Imagetools, name: 'imagetools' },
		{ label: 'mdsvex', icon: Markdown, name: 'mdsvex' },
		{ label: 'CoffeeScript', icon: Coffeescript, name: 'coffeescript' },
		// { label: 'Svelte Cubed', icon: Cubed, name: '3d' },
		// { label: 'Routify*', icon: Routify, name: 'routify' },
		// { label: 'Tauri*', icon: Tauri, name: 'tauri' },
	];

	let integrations_to_add: Array<(typeof addable)[0]> = [];
	$: integrations_to_add_as_string = integrations_to_add.map((i) => i.label).join(', ');
</script>

<form
	on:submit|preventDefault={async (e) => {
		const progress_toast = toast.push(`Adding ${integrations_to_add_as_string}...`, {
			initial: 0,
			dismissable: false,
		});
		webcontainer
			.spawn('npx', [
				'svelte-add@latest',
				integrations_to_add.map((i) => i.name).join('+'),
				'--install',
			])
			.then(async (process) => {
				dispatch('completed');
				process.output.pipeTo(
					new WritableStream({
						write(chunk) {
							terminal.write(chunk);
						},
					})
				);
				await process.exit;
				toast.pop(progress_toast);
				terminal.writeln(
					'Finished svelte-add...you might need to restart your server for everything to properly work'
				);
			});
	}}
>
	<p>
		<a href="https://github.com/svelte-add/svelte-add">Svelte Add</a> is a community project to easily
		add integrations and other functionality to Svelte apps.
	</p>
	<ul class="action-selection-grid">
		{#each addable as integration}
			<li>
				<label>
					<input value={integration} type="checkbox" bind:group={integrations_to_add} />
					<svelte:component this={integration.icon} />
					{integration.label}
				</label>
			</li>
		{/each}
	</ul>
	<small>* work in progress</small>
	<button disabled={integrations_to_add.length === 0} class="action-confirm">
		{#if integrations_to_add.length > 0}
			Add
			{integrations_to_add_as_string}
			to your project
		{:else}
			Select some integrations above
		{/if}
	</button>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
	}

	input {
		background-color: var(--sk-back-2);
		width: 100%;
		color: var(--sk-text-1);
		padding: 0.5rem;
		border: 0;
		border-radius: 0.5rem;
	}

	input::selection {
		background-color: var(--sk-back-5);
	}

	label {
		display: flex;
		gap: 0.5rem;
	}

	small {
		margin-inline-start: auto;
	}

	p {
		margin: 0;
	}
</style>
