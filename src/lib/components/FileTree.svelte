<script lang="ts">
	import { get_subtree_from_path, is_dir } from '$lib/file_system';
	import { get_icon } from '$lib/file_icons';
	import { files as files_store, webcontainer } from '$lib/webcontainer';
	import { createEventDispatcher } from 'svelte';
	import Check from '~icons/akar-icons/check';
	import Folder from '~icons/akar-icons/folder';
	import FolderAdd from '~icons/akar-icons/folder-add';
	import Plus from '~icons/akar-icons/plus';
	import Delete from '~icons/akar-icons/trash-can';
	export let base_path = './';
	export let is_adding: 'folder' | 'file' | null = null;

	let add: typeof is_adding = null;

	const dispatch = createEventDispatcher();

	function handleAdd({
		name,
		file = '',
		add
	}: {
		name: string;
		file?: string;
		add: typeof is_adding;
	}) {
		if (add === 'file') {
			webcontainer.add_file(`${base_path}${file}/${name}`);
		} else if (add === 'folder') {
			webcontainer.add_folder(`${base_path}${file}/${name}`);
		}
	}

	$: tree = get_subtree_from_path(base_path, $files_store);
	$: files = Object.keys(tree ?? {}).sort((file_one, file_two) => {
		// if they are both dirs order alphabetically
		if (is_dir(tree[file_one]) && is_dir(tree[file_two])) {
			return file_one.localeCompare(file_two);
		}
		//if file_one is dir put it first
		if (is_dir(tree[file_one])) return -1;
		//if file_two is dir put it first
		if (is_dir(tree[file_two])) return 1;
		//if they are both files order alphabetically
		return file_one.localeCompare(file_two);
	});
</script>

<ul>
	{#if base_path === './'}
		<li class="folder">
			Add to root <button
				title="New File"
				on:click={() => {
					is_adding = 'file';
				}}><Plus /></button
			><button
				title="New Folder"
				on:click={() => {
					is_adding = 'folder';
				}}><FolderAdd /></button
			>
		</li>
	{/if}
	{#each files as file}
		{@const file_const = tree[file]}
		{#if is_dir(file_const)}
			<li class="folder">
				<button
					class="file"
					on:click={() => {
						// @ts-ignore
						tree[file].open = !file_const.open;
					}}><Folder />{file}</button
				><button
					title="New File"
					on:click={() => {
						add = 'file';
						// @ts-ignore
						tree[file].open = true;
					}}><Plus /></button
				><button
					title="New Folder"
					on:click={() => {
						add = 'folder';
						// @ts-ignore
						tree[file].open = true;
					}}><FolderAdd /></button
				><button
					title="Delete folder"
					on:click={() => {
						/// TODO: use proper component
						if (
							window.confirm(`Are you sure you want to delete "${file}" and everything inside?`)
						) {
							webcontainer.delete_file(`${base_path}${file}`);
						}
					}}><Delete /></button
				>
			</li>
			{#if file_const.open}
				<svelte:self
					base_path={`${base_path}${file}/`}
					is_adding={add}
					on:add={({ detail: name }) => {
						handleAdd({
							name,
							file,
							add
						});
						add = null;
					}}
				/>
			{/if}
		{:else}
			{@const icon = get_icon(file)}
			{@const path = base_path + file}
			<li class:open={$webcontainer.current_path === path}>
				<button class="file" on:click={() => webcontainer.open_file(path)}>
					<svelte:component this={icon} />{file}
				</button>
				<button
					title="Delete {file}"
					on:click={() => {
						/// TODO: use proper component
						if (window.confirm(`Are you sure you want to delete "${file}"?`)) {
							webcontainer.delete_file(`${base_path}${file}`);
						}
					}}><Delete /></button
				>
			</li>
		{/if}
	{/each}
	{#if is_adding}
		<li>
			<form
				on:submit={(e) => {
					e.preventDefault();
					if (!is_adding) return;
					const formData = new FormData(e.currentTarget);
					const path = formData.get('path');
					if (!path) return;
					if (base_path === './') {
						handleAdd({
							name: path.toString(),
							add: is_adding,
							file: ''
						});
						is_adding = null;
					} else {
						dispatch(`add`, path);
					}
				}}
			>
				<!-- svelte-ignore a11y-autofocus -->
				<input name="path" autofocus /><button title="Create file"><Check /></button>
			</form>
		</li>
	{/if}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding-block: 0.5rem;
		padding-inline-start: 1rem;
		background-color: var(--sk-back-1);
		height: 100%;
	}
	/*style reset for nested folders*/
	ul :global(ul) {
		height: auto !important;
		padding-block: 0 !important;
	}
	li {
		border-bottom: 1px solid var(--sk-back-4);
		color: var(--sk-text-1);
		overflow: hidden;
		white-space: nowrap;
		padding: 0.5rem;
		display: grid;
		grid-template-columns: 1fr repeat(3, auto);
	}
	li > button:not(.file) {
		display: none;
	}
	li:hover > button:not(.file) {
		display: initial;
	}
	@media (hover: none) {
		li > button:not(.file) {
			display: initial;
		}
	}

	li:not(.open) {
		filter: grayscale(100%);
	}
	li.open {
		color: var(--sk-theme-1);
		position: relative;
		border-bottom-color: var(--sk-theme-1);
	}
	li.open::after {
		content: '';
		position: absolute;
		background-color: var(--sk-theme-1);
		inset: 0;
		top: calc(100% - 3px);
	}
	button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0;
		border: 0;
	}
	form {
		margin-left: calc(20px + 0.75rem);
		display: flex;
		gap: 0.5rem;
	}
	input {
		width: 100%;
		height: 100%;
		font-family: var(--sk-font);
		font-size: 1.6rem;
	}
</style>
