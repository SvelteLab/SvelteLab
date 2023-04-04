<script lang="ts">
	import { terminal } from '$lib/terminal';
	import { webcontainer } from '$lib/webcontainer';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const creatable = [
		'3d',
		'bootstrap',
		'bulma',
		'coffeescript',
		'imagetools',
		'mdsvex',
		'postcss',
		'scss',
		'tailwindcss',
		'tauri'
	];

	let to_create = [] as string[];
	$: list = to_create.join(', ');
</script>

<form
	on:submit|preventDefault={async (e) => {
		webcontainer
			.spawn('npx', ['svelte-add@latest', to_create.join('+'), '--install'])
			.then(async (process) => {
				dispatch('completed');
				process.output.pipeTo(
					new WritableStream({
						write(chunk) {
							terminal.write(chunk);
						}
					})
				);
				await process.exit;
				terminal.writeln(
					'Finished svelte-add...you might need to restart your server for everything to properly work'
				);
			});
	}}
>
	<section class="checkboxes">
		{#each creatable as create}
			<label>
				<input value={create} type="checkbox" bind:group={to_create} />
				{create}
			</label>
		{/each}
	</section>
	<button disabled={to_create.length === 0} class="create">Add "{list}" to your project</button>
</form>

<style>
	form {
		display: grid;
		gap: 0.5rem;
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
	.checkboxes {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	label {
		display: flex;
		gap: 0.5rem;
	}
	.create {
		background-color: var(--sk-theme-1);
		padding: 0.5rem;
	}
</style>
