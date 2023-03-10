<script lang="ts">
	import { get_icon } from '$lib/file_icons';
	import { get_subtree_from_path, is_dir } from '$lib/file_system';
	import { repl_name } from '$lib/stores/repl_id_store';
	import { current_tab, open_file } from '$lib/tabs';
	import { files as files_store, webcontainer } from '$lib/webcontainer';
	import { createEventDispatcher } from 'svelte';
	import Plus from '~icons/material-symbols/add-rounded';
	import Check from '~icons/material-symbols/check-small-rounded';
	import FolderAdd from '~icons/material-symbols/create-new-folder-outline-rounded';
	import Delete from '~icons/material-symbols/delete-outline-rounded';
	import ConfigFiles from '~icons/material-symbols/display-settings-outline-rounded';
	import Folder from '~icons/material-symbols/folder-outline-rounded';

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
	$: nodes = Object.keys(tree ?? {}).sort((node_a, node_b) => {
		// if they are both dirs order alphabetically
		if (is_dir(tree[node_a]) && is_dir(tree[node_b])) {
			return node_a.localeCompare(node_b);
		}
		//if file_one is dir put it first
		if (is_dir(tree[node_a])) return -1;
		//if file_two is dir put it first
		if (is_dir(tree[node_b])) return 1;
		//if they are both files order alphabetically
		return node_a.localeCompare(node_b);
	});
</script>

<ul>
	{#if base_path === './'}
		<li class="root">
			<input aria-label="REPL name" bind:value={$repl_name} />
			<div class="hover-group">
				<button
					title="New File"
					on:click={() => {
						is_adding = 'file';
					}}
				>
					<Plus />
				</button>
				<button
					title="New Folder"
					on:click={() => {
						is_adding = 'folder';
					}}
				>
					<FolderAdd />
				</button>
				<button title="Toggle Config Files">
					<ConfigFiles />
				</button>
			</div>
		</li>
	{/if}
	{#each nodes as node_key}
		{@const node = tree[node_key]}
		{#if is_dir(node)}
			<li class="folder">
				<button
					class="node"
					on:click={() => {
						// @ts-ignore
						tree[node_key].open = !node.open;
					}}
				>
					<Folder />{node_key}
				</button>
				<div class="hover-group">
					<button
						title="New File"
						on:click={() => {
							add = 'file';
							// @ts-ignore
							tree[node_key].open = true;
						}}
					>
						<Plus />
					</button>
					<button
						title="New Folder"
						on:click={() => {
							add = 'folder';
							// @ts-ignore
							tree[node_key].open = true;
						}}
					>
						<FolderAdd />
					</button>
					<button
						title="Delete folder"
						on:click={() => {
							/// TODO: use proper component
							if (
								window.confirm(
									`Are you sure you want to delete "${node_key}" and everything inside?`
								)
							) {
								webcontainer.delete_file(`${base_path}${node_key}`);
							}
						}}
					>
						<Delete />
					</button>
				</div>
			</li>
			{#if node.open}
				<svelte:self
					base_path={`${base_path}${node_key}/`}
					is_adding={add}
					on:add={({ detail: name }) => {
						handleAdd({
							name,
							file: node_key,
							add
						});
						add = null;
					}}
				/>
			{/if}
		{:else}
			{@const icon = get_icon(node_key)}
			{@const path = base_path + node_key}
			<li class:open={$current_tab === path}>
				<button class="node" on:click={() => open_file(path)}>
					<svelte:component this={icon} />
					<span>
						{node_key}
					</span>
				</button>
				<div class="hover-group">
					<button
						title="Delete {node_key}"
						on:click={() => {
							/// TODO: use proper component
							if (window.confirm(`Are you sure you want to delete "${node_key}"?`)) {
								webcontainer.delete_file(`${base_path}${node_key}`);
							}
						}}
					>
						<Delete />
					</button>
				</div>
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
		padding: 1rem;
		padding-block: 0rem;
		padding-inline-end: 0rem;
		background-color: var(--sk-back-3);
		height: 100%;
	}

	/*style reset for nested folders*/
	ul :global(ul) {
		height: auto !important;
		padding-block: 0 !important;
	}

	.root {
		background-color: var(--sk-back-1);
		margin-inline-start: -1rem;
		padding-inline-start: 1em;
	}

	.root .hover-group {
		background-color: var(--sk-back-1);
	}

	li {
		display: grid;
		align-items: center;
		gap: 0.5em;
		color: var(--sk-text-1);
		height: 2em;
		overflow: hidden;
		white-space: nowrap;
		padding: 0.5rem;
		position: relative;
	}

	.node {
		flex: 1 0 auto;
		min-width: 0;
	}

	.node span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.hover-group {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		display: flex;
		gap: 0.75rem;
		padding: 0.5rem;
		align-items: center;
		justify-content: end;
		background-color: var(--sk-back-3);
		color: var(--sk-text-3);
	}

	.hover-group button:hover {
		color: var(--sk-text-1);
	}

	li .hover-group {
		display: none;
	}

	li:hover .hover-group {
		display: flex;
	}

	@media (hover: none) {
		li .hover-group {
			display: flex;
			font-size: 1.75rem;
		}
	}

	li:not(.open, .root) {
		filter: grayscale(70%);
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

	button :global(svg) {
		min-width: 18px;
	}

	form {
		margin-left: calc(20px + 0.75rem);
		display: flex;
		gap: 0.5rem;
	}

	input {
		border: none;
		color: var(--sk-text-2);
		flex-grow: 1;
		font-family: inherit;
		font-size: inherit;
		height: 100%;
		width: 100%;
		background-color: transparent;
	}

	input:focus {
		background-color: var(--sk-back-2);
		outline: 1px solid var(--sk-theme-1);
	}
</style>
