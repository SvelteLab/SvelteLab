<script lang="ts">
	import { get_file_icon } from '$lib/file_icons';
	import { is_dir } from '$lib/file_system';
	import { files, webcontainer } from '$lib/webcontainer';
	import type { FileSystemTree } from '@webcontainer/api';
	import { createEventDispatcher, tick } from 'svelte';
	import TS from '~icons/vscode-icons/file-type-typescript-official';

	const dispatch = createEventDispatcher();

	let route = '/';
	let old_to_add = null as null | string;
	let input: HTMLInputElement;
	let is_ts = false;

	const creatable_file = [
		'+page.svelte',
		'+page',
		'+page.server',
		'+layout.svelte',
		'+layout',
		'+layout.server',
		'+server',
		'+error.svelte',
	];

	let files_to_create = ['+page.svelte'] as string[];

	let autocomplete =
		is_dir($files.src) && is_dir($files.src.directory.routes)
			? autocomplete_from_tree($files.src.directory.routes.directory)
			: [];

	function autocomplete_from_tree(tree: FileSystemTree, path = '/') {
		let return_value = [] as string[];
		for (let file in tree) {
			const current_file = tree[file];
			if (is_dir(current_file)) {
				return_value.push(path + file);
				return_value.push(...autocomplete_from_tree(current_file.directory, path + file + '/'));
			}
		}
		return return_value;
	}

	$: {
		tick().then(() => {
			if (old_to_add && route.length <= old_to_add.length) return;
			let suggestion = autocomplete.find((ac) => ac.startsWith(route));
			if (suggestion && route) {
				suggestion = suggestion.replace(route, '');
				input.setRangeText(suggestion);
				input.setSelectionRange(route.length, route.length + suggestion.length);
			}
		});
	}
</script>

<form
	on:submit|preventDefault={async (e) => {
		const path = `src/routes/${route}`.split('/').filter(Boolean);
		let prefix = '/';
		for (const dir of path) {
			await webcontainer.add_folder(prefix + dir);
			prefix = prefix + dir + '/';
		}
		for (let file of files_to_create) {
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
	<label>
		Route
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="action-field"
			type="text"
			autofocus
			on:keydown={(e) => {
				if (e.key === 'Tab' && input.selectionStart !== input.selectionEnd) {
					e.preventDefault();
					e.stopPropagation();
					input.setSelectionRange(input.value.length, input.value.length);
					route = input.value;
				}
			}}
			bind:this={input}
			value={route}
			on:input={(e) => {
				old_to_add = route;
				route = e.currentTarget.value;
			}}
			placeholder="insert route to create"
		/>
	</label>

	<section>
		<ul class="action-selection-grid">
			{#each creatable_file as file_to_create}
				{@const label = file_to_create.endsWith('.svelte')
					? file_to_create
					: `${file_to_create}${is_ts ? '.ts' : '.js'}`}
				{@const icon = get_file_icon(label)}
				<li>
					<label>
						<input value={label} type="checkbox" bind:group={files_to_create} />
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
	<button disabled={files_to_create.length === 0} class="action-confirm">
		{#if files_to_create.length > 0}
			Create "{route}" with
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

	button:hover {
		background-color: var(--sk-back-4);
	}
</style>
