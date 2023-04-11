<script lang="ts">
	import { terminal } from '$lib/terminal';
	import { webcontainer } from '$lib/webcontainer';
	import { toast } from '@zerodevx/svelte-toast';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const addable = [
		{ label: 'Svelte Cubed', icon: null, name: '3d' },
		{ label: 'Bootstrap', icon: null, name: 'bootstrap' },
		{ label: 'Bulma', icon: null, name: 'bulma' },
		{ label: 'CoffeeScript', icon: null, name: 'coffeescript' },
		{ label: 'Imagetools *', icon: null, name: 'imagetools' },
		{ label: 'mdsvex', icon: null, name: 'mdsvex' },
		{ label: 'PostCSS', icon: null, name: 'postcss' },
		{ label: 'Routify *', icon: null, name: 'routify' },
		{ label: 'SCSS', icon: null, name: 'scss' },
		{ label: 'Tailwind CSS', icon: null, name: 'tailwindcss' },
		{ label: 'Tauri *', icon: null, name: 'tauri' },
	];

	let to_add = [] as string[];
	$: list = to_add.join(', ');
</script>

<form
	on:submit|preventDefault={async (e) => {
		const progress_toast = toast.push(`Adding ${to_add.join(', ')}...`, {
			initial: 0,
			dismissable: false,
		});
		webcontainer
			.spawn('npx', ['svelte-add@latest', to_add.join('+'), '--install'])
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
	<ul class="checkbox-grid">
		{#each addable as integration}
			<li>
				<label>
					<input value={integration.name} type="checkbox" bind:group={to_add} />
					{integration.label}
				</label>
			</li>
		{/each}
	</ul>
	<small>* work in progress</small>
	<button disabled={to_add.length === 0} class="confirm">
		{#if to_add.length > 0}
			Add "{list}" to your project
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
