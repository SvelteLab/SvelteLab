<script lang="ts">
	import { is_dir } from '$lib/file_system';
	import { files, webcontainer } from '$lib/webcontainer';
	import type { FileSystemTree } from '@webcontainer/api';
	import { createEventDispatcher, tick } from 'svelte';
	import TS from '~icons/vscode-icons/file-type-typescript-official';

	const dispatch = createEventDispatcher();
	let to_add = '/';
	let old_to_add = null as null | string;
	let input: HTMLInputElement;

	let is_ts = false;

	const creatable = [
		'+page.svelte',
		'+page',
		'+page.server',
		'+layout.svelte',
		'+layout',
		'+layout.server',
		'+error.svelte',
		'+server'
	];

	let to_create = [] as string[];

	function autocomplete_from_tree(tree: FileSystemTree, path = '/') {
		let retval = [] as string[];
		for (let file in tree) {
			const current_file = tree[file];
			if (is_dir(current_file)) {
				retval.push(path + file);
				retval.push(...autocomplete_from_tree(current_file.directory, path + file + '/'));
			}
		}
		return retval;
	}

	let autocomplete =
		is_dir($files.src) && is_dir($files.src.directory.routes)
			? autocomplete_from_tree($files.src.directory.routes.directory)
			: [];

	$: {
		tick().then(() => {
			if (old_to_add && to_add.length <= old_to_add.length) return;
			let suggestion = autocomplete.find((ac) => ac.startsWith(to_add));
			if (suggestion && to_add) {
				suggestion = suggestion.replace(to_add, '');
				input.setRangeText(suggestion);
				input.setSelectionRange(to_add.length, to_add.length + suggestion.length);
			}
		});
	}
</script>

<form
	on:submit|preventDefault={async (e) => {
		const path = `src/routes/${to_add}`.split('/').filter(Boolean);
		let prefix = '/';
		for (const dir of path) {
			await webcontainer.add_folder(prefix + dir);
			prefix = prefix + dir + '/';
		}
		for (let file of to_create) {
			// we need to do this because of a small bug in svelte
			// i think
			if (is_ts) {
				file = file.replace('.js', '.ts');
			} else {
				file = file.replace('.ts', '.js');
			}
			await webcontainer.add_file(prefix + file);
		}
		dispatch('completed');
	}}
>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		autofocus
		on:keydown={(e) => {
			if (e.key === 'Tab' && input.selectionStart !== input.selectionEnd) {
				e.preventDefault();
				e.stopPropagation();
				input.setSelectionRange(input.value.length, input.value.length);
				to_add = input.value;
			}
		}}
		bind:this={input}
		value={to_add}
		on:input={(e) => {
			old_to_add = to_add;
			to_add = e.currentTarget.value;
		}}
		placeholder="insert route to create"
	/>
	<section>
		<button on:click={() => (is_ts = !is_ts)} type="button" class="ts-button" class:is_ts>
			<TS />
		</button>
		<div class="checkboxes">
			{#each creatable as create}
				{@const label = create.endsWith('.svelte') ? create : `${create}${is_ts ? '.ts' : '.js'}`}
				<label>
					<input value={label} type="checkbox" bind:group={to_create} />
					{label}
				</label>
			{/each}
		</div>
	</section>
	<button class="create">Create route "{to_add}"</button>
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
	section {
		display: grid;
		grid-template-columns: min-content 1fr;
		gap: 1rem;
	}
	.checkboxes {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.ts-button {
		opacity: 0.5;
	}
	.is_ts {
		opacity: 1;
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
