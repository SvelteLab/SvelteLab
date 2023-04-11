<script lang="ts">
	import { get_file_icon } from '$lib/file_icons';
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
		'+server',
		'+error.svelte',
	];

	let to_create = ['+page.svelte'] as string[];

	let autocomplete =
		is_dir($files.src) && is_dir($files.src.directory.routes)
			? autocomplete_from_tree($files.src.directory.routes.directory)
			: [];

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
	<label for="route"> Route </label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		type="text"
		id="route"
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
		<ul class="checkbox-grid">
			{#each creatable as create}
				{@const label = create.endsWith('.svelte') ? create : `${create}${is_ts ? '.ts' : '.js'}`}
				{@const icon = get_file_icon(label)}
				<li>
					<label>
						<input value={label} type="checkbox" bind:group={to_create} />
						<svelte:component this={icon} />
						{label}
					</label>
				</li>
			{/each}
			<li>
				<label>
					<input type="checkbox" bind:checked={is_ts} />
					<TS />
					Use TypeScript
				</label>
			</li>
		</ul>
	</section>
	<button class="confirm">Create route "{to_add}"</button>
</form>

<style>
	form {
		margin: 2rem;
	}

	input[type='text'],
	button.confirm {
		width: 100%;
		color: inherit;
	}

	input[type='text'] {
		border: 1px solid var(--sk-back-5);
		padding: 1rem 1.25rem;
	}

	button.confirm {
		background-color: var(--sk-back-3);
		padding: 0.5rem 1rem;
	}

	button:hover {
		background-color: var(--sk-back-4);
	}
</style>
